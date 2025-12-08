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
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  User,
  Mail,
  Phone,
  Hash,
  Briefcase,
  FileText,
  Code,
  Github,
  Linkedin,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadMember();
  }, [id]);

  useEffect(() => {
    if (formData?.name) {
      const event = new CustomEvent("updatePageTitle", {
        detail: `Edit ${formData.name}`,
      });
      window.dispatchEvent(event);
    }
  }, [formData?.name]);

  useEffect(() => {
    if (formData && originalData) {
      const currentData = JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        avatar: formData.avatar,
        bio: formData.bio,
        skills: formData.skills,
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        portfolio_url: formData.portfolio_url,
      });
      setHasChanges(currentData !== originalData);
    }
  }, [formData, originalData]);

  const loadMember = async () => {
    const members = await getTeamMembers();
    const member = members.find((m) => m.id === id);

    if (!member) {
      toast.error("Team member not found");
      router.push("/admin/team");
      return;
    }

    setFormData(member);
    setOriginalData(
      JSON.stringify({
        name: member.name,
        email: member.email,
        phone: member.phone,
        role: member.role,
        status: member.status,
        avatar: member.avatar,
        bio: member.bio,
        skills: member.skills,
        github_url: member.github_url,
        linkedin_url: member.linkedin_url,
        portfolio_url: member.portfolio_url,
      })
    );
    setLoading(false);
  };

  const handleSubmit = async () => {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setFormData({ ...formData, avatar: localPreview });
    setUploading(true);

    const data = new FormData();
    data.append("file", file);

    const { uploadAvatar } = await import("@/lib/upload");
    const result = await uploadAvatar(data);

    setUploading(false);

    if (result.error) {
      toast.error(result.error);
      loadMember();
      URL.revokeObjectURL(localPreview);
    } else if (result.url) {
      setFormData({ ...formData, avatar: result.url });
      toast.success("Image uploaded successfully!");
      URL.revokeObjectURL(localPreview);
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
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex-shrink-0 mb-6 flex items-start justify-between">
        <div>
          <Link href="/admin/team">
            <Button variant="ghost" size="sm" className="-ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team
            </Button>
          </Link>
          <h1 className="text-2xl font-bold mt-2">{formData.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Update team member profile
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground mb-1">Member ID</div>
          <div className="text-xs font-mono bg-muted px-3 py-1.5 rounded-none border border-border">
            {formData.id}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-none p-6">
          <div className="flex items-start gap-6">
            {/* Avatar Upload */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg rounded-none">
                  <AvatarImage src={formData.avatar} alt="Preview" />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-primary/5 rounded-none">
                    {formData.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <label className="absolute inset-0 cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading || saving}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                {uploading ? "Uploading..." : "Click to change"}
              </p>
            </div>

            {/* Basic Info */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-2 h-10 rounded-none"
                />
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-2 h-10 rounded-none"
                />
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                <Input
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-2 h-10 rounded-none"
                />
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Enrollment No
                </Label>
                <Input
                  value={formData.enrollment_no || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, enrollment_no: e.target.value })
                  }
                  className="mt-2 h-10 rounded-none"
                />
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Role
                </Label>
                <select
                  className="flex h-10 w-full rounded-none border border-input bg-background px-3 py-2 text-sm mt-2"
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
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-none p-6">
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            About
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Bio</Label>
              <Textarea
                value={formData.bio || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="mt-2 min-h-[80px] resize-none rounded-none"
              />
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Code className="h-4 w-4" />
                Skills
              </Label>
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
                className="mt-2 h-10 rounded-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate with commas
              </p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-none p-6">
          <h3 className="text-base font-semibold mb-4">Social & Links</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Label>
              <Input
                value={formData.github_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, github_url: e.target.value })
                }
                className="mt-2 h-10 rounded-none"
              />
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Label>
              <Input
                value={formData.linkedin_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin_url: e.target.value })
                }
                className="mt-2 h-10 rounded-none"
              />
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Portfolio
              </Label>
              <Input
                value={formData.portfolio_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, portfolio_url: e.target.value })
                }
                className="mt-2 h-10 rounded-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed bottom bar */}
      <div className="h-20 flex-shrink-0" />

      {/* Fixed Bottom Bar - Only shows when there are changes */}
      {hasChanges && (
        <div className="fixed bottom-0 left-64 right-0 border-t border-border bg-card/95 backdrop-blur px-8 py-4 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-sm text-amber-600 flex items-center gap-2">
              <div className="h-2 w-2 rounded-none bg-amber-500 animate-pulse" />
              Unsaved changes
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={loadMember}
                disabled={saving}
                className="rounded-none"
              >
                Discard
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving || !formData.name || !formData.email}
                className="min-w-[120px] rounded-none"
              >
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
          </div>
        </div>
      )}
    </div>
  );
}
