"use client";

import { useState, useEffect } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  type Project,
} from "./actions";
import { getTeamMembers, type TeamMember } from "../team/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/skeleton-table";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(
    null
  );
  const [newImageInput, setNewImageInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [projectsData, membersData] = await Promise.all([
      getProjects(),
      getTeamMembers(),
    ]);
    setProjects(projectsData);
    setTeamMembers(membersData);
    setLoading(false);
  };

  const getMember = (id: string) => teamMembers.find((m) => m.id === id);

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const result = await deleteProject(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Project deleted successfully");
      loadData();
    }
  };

  const handleEdit = (project: Project) => {
    setCurrentProject({ ...project });
    setIsPanelOpen(true);
  };

  const handleAddNew = () => {
    setCurrentProject({
      title: "",
      description: "",
      status: "Pending",
      start_date: new Date().toISOString().split("T")[0],
      due_date: "",
      assigned_member_ids: [],
      tags: [],
      link: "",
      images: [],
      metrics: "",
    });
    setIsPanelOpen(true);
  };

  const toggleMemberAssignment = (memberId: string) => {
    if (!currentProject) return;
    const currentIds = currentProject.assigned_member_ids || [];
    if (currentIds.includes(memberId)) {
      setCurrentProject({
        ...currentProject,
        assigned_member_ids: currentIds.filter((id) => id !== memberId),
      });
    } else {
      setCurrentProject({
        ...currentProject,
        assigned_member_ids: [...currentIds, memberId],
      });
    }
  };

  const addImage = () => {
    if (!newImageInput || !currentProject) return;
    setCurrentProject({
      ...currentProject,
      images: [...(currentProject.images || []), newImageInput],
    });
    setNewImageInput("");
  };

  const removeImage = (index: number) => {
    if (!currentProject) return;
    const newImages = [...(currentProject.images || [])];
    newImages.splice(index, 1);
    setCurrentProject({
      ...currentProject,
      images: newImages,
    });
  };

  const handleSave = async () => {
    if (!currentProject?.title) {
      toast.error("Project title is required");
      return;
    }

    const formData = new FormData();
    if (currentProject.id) {
      formData.append("id", currentProject.id);
    }
    formData.append("title", currentProject.title);
    formData.append("description", currentProject.description || "");
    formData.append("status", currentProject.status || "Pending");
    formData.append("dueDate", currentProject.due_date || "");
    formData.append("link", currentProject.link || "");
    formData.append("metrics", currentProject.metrics || "");
    formData.append("tags", (currentProject.tags || []).join(", "));
    formData.append("images", JSON.stringify(currentProject.images || []));
    formData.append(
      "memberIds",
      JSON.stringify(currentProject.assigned_member_ids || [])
    );

    const result = currentProject.id
      ? await updateProject(formData)
      : await createProject(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        currentProject.id
          ? "Project updated successfully"
          : "Project created successfully"
      );
      setIsPanelOpen(false);
      loadData();
    }
  };

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage projects and assign team members.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9 w-[250px] bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : (
        <div className="border border-border bg-card rounded-md overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground uppercase bg-secondary/30 font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-foreground text-base">
                          {project.title}
                        </div>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {project.description}
                      </div>
                      <div className="flex gap-1 mt-1">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={`
                          ${
                            project.status === "Completed"
                              ? "border-green-500 text-green-500"
                              : ""
                          }
                          ${
                            project.status === "In Progress"
                              ? "border-blue-500 text-blue-500"
                              : ""
                          }
                          ${
                            project.status === "Pending"
                              ? "border-yellow-500 text-yellow-500"
                              : ""
                          }
                      `}
                    >
                      {project.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Start:{" "}
                        {project.start_date
                          ? new Date(project.start_date).toLocaleDateString()
                          : "-"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Due:{" "}
                        <span className="text-foreground">
                          {project.due_date
                            ? new Date(project.due_date).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2 overflow-hidden">
                      {project.assigned_member_ids?.map((id) => {
                        const member = getMember(id);
                        if (!member) return null;
                        return (
                          <Avatar
                            key={id}
                            className="inline-block h-8 w-8 ring-2 ring-background"
                          >
                            <AvatarImage
                              src={member.avatar || undefined}
                              alt={member.name}
                            />
                            <AvatarFallback>
                              {member.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                      {!project.assigned_member_ids ||
                      project.assigned_member_ids.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">
                          Unassigned
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(project)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Centered Modal for Edit/Create */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsPanelOpen(false)}
          />

          <div className="relative w-full max-w-4xl bg-background rounded-lg shadow-2xl border border-border max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-2xl font-bold tracking-tight">
                {currentProject?.id ? "Edit Project" : "New Project"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPanelOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium leading-none">
                    Project Title
                  </label>
                  <Input
                    value={currentProject?.title || ""}
                    onChange={(e) =>
                      setCurrentProject((curr) => ({
                        ...curr,
                        title: e.target.value,
                      }))
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium leading-none">
                    Description
                  </label>
                  <Textarea
                    value={currentProject?.description || ""}
                    onChange={(e) =>
                      setCurrentProject((curr) => ({
                        ...curr,
                        description: e.target.value,
                      }))
                    }
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium leading-none">
                    Tags (comma separated)
                  </label>
                  <Input
                    value={currentProject?.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setCurrentProject((curr) => ({
                        ...curr,
                        tags: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      }))
                    }
                    className="mt-2"
                    placeholder="Next.js, React, Stripe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium leading-none">
                      Project URL
                    </label>
                    <Input
                      value={currentProject?.link || ""}
                      onChange={(e) =>
                        setCurrentProject((curr) => ({
                          ...curr,
                          link: e.target.value,
                        }))
                      }
                      className="mt-2"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium leading-none">
                      Metrics
                    </label>
                    <Input
                      value={currentProject?.metrics || ""}
                      onChange={(e) =>
                        setCurrentProject((curr) => ({
                          ...curr,
                          metrics: e.target.value,
                        }))
                      }
                      className="mt-2"
                      placeholder="+20% Conversion"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium leading-none">
                      Status
                    </label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                      value={currentProject?.status || "Pending"}
                      onChange={(e) =>
                        setCurrentProject((curr) => ({
                          ...curr,
                          status: e.target.value as any,
                        }))
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium leading-none">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={currentProject?.due_date || ""}
                      onChange={(e) =>
                        setCurrentProject((curr) => ({
                          ...curr,
                          due_date: e.target.value,
                        }))
                      }
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Image Management */}
                <div>
                  <label className="text-sm font-medium leading-none">
                    Project Images
                  </label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newImageInput}
                      onChange={(e) => setNewImageInput(e.target.value)}
                      placeholder="Image URL..."
                    />
                    <Button
                      type="button"
                      onClick={addImage}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {currentProject?.images?.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group aspect-video bg-muted rounded-md overflow-hidden"
                      >
                        <img
                          src={img}
                          alt="Project"
                          className="object-cover w-full h-full"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-3">Assign Team Members</h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto border border-border rounded-md p-2">
                  {teamMembers.map((member) => {
                    const isAssigned =
                      currentProject?.assigned_member_ids?.includes(member.id);
                    return (
                      <div
                        key={member.id}
                        className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-muted ${
                          isAssigned ? "bg-secondary" : ""
                        }`}
                        onClick={() => toggleMemberAssignment(member.id)}
                      >
                        <div
                          className={`w-4 h-4 border rounded flex items-center justify-center ${
                            isAssigned
                              ? "bg-primary border-primary"
                              : "border-input"
                          }`}
                        >
                          {isAssigned && (
                            <div className="w-2 h-2 bg-background rounded-sm" />
                          )}
                        </div>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar || undefined} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <div className="font-medium leading-none">
                            {member.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {member.role}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsPanelOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
