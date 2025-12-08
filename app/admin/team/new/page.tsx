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
  Activity,
  FileText,
  Code,
  Github,
  Linkedin,
  Globe,
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
    role: "Member" as any,
    status: "Active" as any,
    avatar: "",
    bio: "",
    skills: [] as string[],
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
  });

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

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/team">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add Team Member</h1>
        <p className="text-muted-foreground mt-2">
          Create a new team member profile with all the necessary details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Section */}
        <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-none p-8">
          <div className="flex items-start gap-8">
            {/* Avatar Upload */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage src={formData.avatar} alt="Preview" />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-primary/20 to-primary/5">
                    {formData.name?.slice(0, 2).toUpperCase() || (
                      <User className="h-12 w-12" />
                    )}
                  </AvatarFallback>
                </Avatar>
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 rounded-none flex items-center justify-center">
                    <div className="h-8 w-8 border-3 border-white border-t-transparent rounded-none animate-spin" />
                  </div>
                )}
                <label className="absolute inset-0 rounded-none cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 bg-black/40 rounded-none flex items-center justify-center">
                    <Upload className="h-8 w-8 text-white" />
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
              <p className="text-xs text-center text-muted-foreground mt-3">
                {uploading ? "Uploading..." : "Click to upload"}
              </p>
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
                    className="mt-2 h-11"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-2 h-11"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-2 h-11"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Enrollment Number
                  </Label>
                  <Input
                    value={formData.enrollment_no}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        enrollment_no: e.target.value,
                      })
                    }
                    className="mt-2 h-11"
                    placeholder="DX-2024-001"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Role
                  </Label>
                  <select
                    className="flex h-11 w-full rounded-none border border-input bg-background px-3 py-2 text-sm mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as any })
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
        </div>

        {/* About Section */}
        <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-none p-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            About
          </h3>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="mt-2 min-h-[120px] resize-none"
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
                className="mt-2 h-11"
                placeholder="React, Node.js, TypeScript, UI/UX"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Separate skills with commas
              </p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-none p-8">
          <h3 className="text-lg font-semibold mb-6">Social & Links</h3>
          <div className="grid md:grid-cols-3 gap-4">
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
                className="mt-2 h-11"
                placeholder="https://github.com/username"
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
                className="mt-2 h-11"
                placeholder="https://linkedin.com/in/username"
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
                className="mt-2 h-11"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Link href="/admin/team">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              size="lg"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading || uploading}
            size="lg"
            className="min-w-[140px]"
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
      </form>
    </div>
  );
}
