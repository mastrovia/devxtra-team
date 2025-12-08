"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProjects, deleteProject, Project } from "./actions";
import { getTeamMembers } from "../team/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash2, Edit2, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/skeleton-table";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const result = await deleteProject(id);
    if (result.error) {
      toast.error(`Failed to delete: ${result.error}`);
    } else {
      toast.success("Project deleted successfully");
      loadData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/15 text-green-700 border-green-200 hover:bg-green-500/25 outline-none border-none";
      case "In Progress":
        return "bg-blue-500/15 text-blue-700 border-blue-200 hover:bg-blue-500/25 outline-none border-none";
      case "On Hold":
        return "bg-amber-500/15 text-amber-700 border-amber-200 hover:bg-amber-500/25 outline-none border-none";
      default:
        return "bg-gray-500/15 text-gray-700 border-gray-200 hover:bg-gray-500/25 outline-none border-none";
    }
  };

  const getAssignedMembers = (memberIds: string[]) => {
    return teamMembers.filter((m) => memberIds?.includes(m.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your projects and team assignments.
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
          <Link href="/admin/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : (
        <div className="border border-border bg-card rounded-none overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground uppercase bg-secondary/30 font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Tags</th>
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
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        {project.title}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                        {project.description || "No description"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="default"
                      className={getStatusColor(project.status)}
                    >
                      {project.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {getAssignedMembers(project.assigned_member_ids || [])
                        .slice(0, 4)
                        .map((member) => (
                          <Avatar
                            key={member.id}
                            className="h-8 w-8 border-2 border-background"
                          >
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">
                              {member.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      {(project.assigned_member_ids || []).length > 4 && (
                        <div className="h-8 w-8 rounded-none bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                          +{(project.assigned_member_ids || []).length - 4}
                        </div>
                      )}
                      {(!project.assigned_member_ids ||
                        project.assigned_member_ids.length === 0) && (
                        <span className="text-xs text-muted-foreground">
                          No team
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {project.due_date
                        ? new Date(project.due_date).toLocaleDateString()
                        : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(project.tags || []).slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {(project.tags || []).length > 2 && (
                        <span className="px-2 py-0.5 text-xs rounded bg-secondary text-secondary-foreground">
                          +{(project.tags || []).length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/projects/${project.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
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
                    colSpan={6}
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
    </div>
  );
}
