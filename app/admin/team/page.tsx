"use client";

import { useState, useEffect } from "react";
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  type TeamMember,
} from "./actions";
import { getProjects } from "../projects/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash2, Edit2, X, Save, FolderGit2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/skeleton-table";

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentMember, setCurrentMember] =
    useState<Partial<TeamMember> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [membersData, projectsData] = await Promise.all([
      getTeamMembers(),
      getProjects(),
    ]);
    setTeamMembers(membersData);
    setProjects(projectsData);
    setLoading(false);
  };

  const getMemberProjectCount = (memberId: string) => {
    return projects.filter((p) => p.assigned_member_ids?.includes(memberId))
      .length;
  };

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;

    const result = await deleteTeamMember(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Team member removed successfully");
      loadData();
    }
  };

  const handleEdit = (member: TeamMember) => {
    setCurrentMember({ ...member });
    setIsPanelOpen(true);
  };

  const handleAddNew = () => {
    setCurrentMember({
      name: "",
      email: "",
      role: "Member",
      status: "Active",
      phone: "",
      enrollment_no: `DX-2024-${Math.floor(Math.random() * 1000)}`,
    });
    setIsPanelOpen(true);
  };

  const handleSave = async () => {
    if (!currentMember?.name || !currentMember.email) {
      toast.error("Name and email are required");
      return;
    }

    const formData = new FormData();
    if (currentMember.id) {
      formData.append("id", currentMember.id);
    }
    formData.append("name", currentMember.name);
    formData.append("email", currentMember.email);
    formData.append("phone", currentMember.phone || "");
    formData.append("role", currentMember.role || "Member");
    formData.append("status", currentMember.status || "Active");
    formData.append("enrollmentNo", currentMember.enrollment_no || "");

    const result = currentMember.id
      ? await updateTeamMember(formData)
      : await createTeamMember(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        currentMember.id
          ? "Team member updated successfully"
          : "Team member added successfully"
      );
      setIsPanelOpen(false);
      loadData();
    }
  };

  return (
    <div className="space-y-6 relative h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team</h2>
          <p className="text-muted-foreground">
            Manage your team members and collaborators.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team..."
              className="pl-9 w-[250px] bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : (
        <div className="border border-border bg-card rounded-md overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-muted-foreground uppercase bg-secondary/30 font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Projects</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={member.avatar || undefined}
                          alt={member.name}
                        />
                        <AvatarFallback>
                          {member.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-foreground">
                          {member.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-gray-500/10">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <FolderGit2 className="h-4 w-4" />
                      <span className="font-mono">
                        {getMemberProjectCount(member.id)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        member.status === "Active" ? "default" : "secondary"
                      }
                      className={
                        member.status === "Active"
                          ? "bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-200"
                          : ""
                      }
                    >
                      {member.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {member.phone || "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No team members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-over Panel for Edit/Create */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsPanelOpen(false)}
          />

          <div className="relative w-full max-w-md bg-background h-full shadow-2xl p-6 border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold tracking-tight">
                {currentMember?.id ? "Edit Member" : "New Member"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPanelOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="text-sm font-medium leading-none">
                  Full Name
                </label>
                <Input
                  value={currentMember?.name || ""}
                  onChange={(e) =>
                    setCurrentMember((curr) => ({
                      ...curr,
                      name: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium leading-none">
                  Email Address
                </label>
                <Input
                  value={currentMember?.email || ""}
                  onChange={(e) =>
                    setCurrentMember((curr) => ({
                      ...curr,
                      email: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium leading-none">
                  Phone
                </label>
                <Input
                  value={currentMember?.phone || ""}
                  onChange={(e) =>
                    setCurrentMember((curr) => ({
                      ...curr,
                      phone: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium leading-none">
                    Role
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                    value={currentMember?.role || "Member"}
                    onChange={(e) =>
                      setCurrentMember((curr) => ({
                        ...curr,
                        role: e.target.value as any,
                      }))
                    }
                  >
                    <option value="Student">Student</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium leading-none">
                    Status
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                    value={currentMember?.status || "Active"}
                    onChange={(e) =>
                      setCurrentMember((curr) => ({
                        ...curr,
                        status: e.target.value as any,
                      }))
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border mt-auto">
              <Button className="w-full" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
