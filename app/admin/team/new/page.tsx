"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTeamMember } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
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
  Check,
} from "lucide-react";
import Link from "next/link";

export default function NewTeamMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enrollment_no: `DX-2024-${Math.floor(Math.random() * 1000)}`,
    role: "Member" as string,
    status: "Active" as string,
    avatar: "",
    bio: "",
    skills: [] as string[],
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    // Avatar is optional

    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("role", formData.role);
    data.append("status", formData.status);
    data.append("enrollmentNo", formData.enrollment_no);
    data.append("avatar", formData.avatar);
    data.append("bio", formData.bio);
    data.append("skills", formData.skills.join(", "));
    data.append("githubUrl", formData.github_url);
    data.append("linkedinUrl", formData.linkedin_url);
    data.append("portfolioUrl", formData.portfolio_url);

    const result = await createTeamMember(data);

    if (result.error) {
      toast.error(`Failed to create team member: ${result.error}`);
      setLoading(false);
    } else {
      toast.success("Team member created successfully!");
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
      setFormData({ ...formData, avatar: "" });
      URL.revokeObjectURL(localPreview);
    } else if (result.url) {
      setFormData({ ...formData, avatar: result.url });
      toast.success("Image uploaded successfully!");
      URL.revokeObjectURL(localPreview);
    }
  };

  const isFormValid =
    formData.name.trim().length > 0 && formData.email.trim().length > 0;

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <Link href="/admin/team">
          <Button variant="ghost" size="sm" className="-ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mt-2">Add Team Member</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create a new team member profile
        </p>
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
                    {formData.name?.slice(0, 2).toUpperCase() || (
                      <User className="h-10 w-10" />
                    )}
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
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                {uploading ? "Uploading..." : "Optional"}
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
                  placeholder="John Doe"
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
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-2 h-10 rounded-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Enrollment No
                </Label>
                <Input
                  value={formData.enrollment_no}
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
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="mt-2 min-h-[80px] resize-none rounded-none"
                placeholder="Tell us about this team member..."
              />
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Code className="h-4 w-4" />
                Skills
              </Label>
              <Input
                value={formData.skills.join(", ")}
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
                placeholder="React, Node.js, TypeScript"
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
                value={formData.github_url}
                onChange={(e) =>
                  setFormData({ ...formData, github_url: e.target.value })
                }
                className="mt-2 h-10 rounded-none"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Label>
              <Input
                value={formData.linkedin_url}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin_url: e.target.value })
                }
                className="mt-2 h-10 rounded-none"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Portfolio
              </Label>
              <Input
                value={formData.portfolio_url}
                onChange={(e) =>
                  setFormData({ ...formData, portfolio_url: e.target.value })
                }
                className="mt-2 h-10 rounded-none"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed bottom bar */}
      <div className="h-20 flex-shrink-0" />

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-64 right-0 border-t border-border bg-card/95 backdrop-blur px-8 py-4 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {isFormValid ? (
              <span className="text-green-600 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Ready to create
              </span>
            ) : (
              <span>Fill in required fields (name, email)</span>
            )}
          </div>
          <div className="flex gap-3">
            <Link href="/admin/team">
              <Button
                variant="outline"
                disabled={loading}
                className="rounded-none"
              >
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className="min-w-[120px] rounded-none"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-none animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Member
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
