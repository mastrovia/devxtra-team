"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTeamMembers, updateTeamMember } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    loadMember();
  }, [id]);

  const loadMember = async () => {
    const members = await getTeamMembers();
    const member = members.find((m) => m.id === id);

    if (!member) {
      toast.error("Team member not found");
      router.push("/admin/team");
      return;
    }

    setFormData(member);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    if (!formData.avatar) {
      toast.error("Profile image is required");
      return;
    }

    setSaving(true);

    const data = new FormData();
    data.append("id", formData.id);
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone || "");
    data.append("role", formData.role);
    data.append("status", formData.status);
    data.append("avatar", formData.avatar);
    data.append("bio", formData.bio || "");
    data.append("skills", (formData.skills || []).join(", "));
    data.append("githubUrl", formData.github_url || "");
    data.append("linkedinUrl", formData.linkedin_url || "");
    data.append("portfolioUrl", formData.portfolio_url || "");

    const result = await updateTeamMember(data);

    if (result.error) {
      toast.error(`Failed to update: ${result.error}`);
      setSaving(false);
    } else {
      toast.success("Team member updated successfully!");
      router.push("/admin/team");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/team">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team
          </Button>
        </Link>
      </div>

      <div className="border border-border rounded-lg bg-card">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold">Edit Team Member</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update team member profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Profile Image */}
            <div>
              <Label>Profile Image URL *</Label>
              <div className="flex items-center gap-4 mt-2">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback>
                    {formData.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Input
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  className="flex-1"
                  required
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Enrollment Number</Label>
                <Input
                  value={formData.enrollment_no || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, enrollment_no: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Role</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="Student">Student</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Member">Member</option>
                </select>
              </div>

              <div>
                <Label>Status</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <Label>Bio</Label>
              <Textarea
                value={formData.bio || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="mt-2"
                rows={3}
                placeholder="Tell us about this team member..."
              />
            </div>

            {/* Skills */}
            <div>
              <Label>Skills (comma separated)</Label>
              <Input
                value={(formData.skills || []).join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="mt-2"
                placeholder="React, Node.js, TypeScript"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>GitHub URL</Label>
                <Input
                  value={formData.github_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, github_url: e.target.value })
                  }
                  className="mt-2"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <Label>LinkedIn URL</Label>
                <Input
                  value={formData.linkedin_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin_url: e.target.value })
                  }
                  className="mt-2"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Portfolio URL</Label>
                <Input
                  value={formData.portfolio_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, portfolio_url: e.target.value })
                  }
                  className="mt-2"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
            <Link href="/admin/team">
              <Button type="button" variant="outline" disabled={saving}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
