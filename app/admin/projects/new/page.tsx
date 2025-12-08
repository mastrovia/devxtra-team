"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../actions";
import { getTeamMembers } from "../../team/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  FileText,
  Calendar,
  Link as LinkIcon,
  Users,
  Target,
  Check,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending" as string,
    start_date: "",
    due_date: "",
    tags: [] as string[],
    link: "",
    images: [] as string[],
    metrics: "",
    assigned_member_ids: [] as string[],
  });

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    const members = await getTeamMembers();
    setTeamMembers(members);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error("Project title is required");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("status", formData.status);
    data.append("startDate", formData.start_date);
    data.append("dueDate", formData.due_date);
    data.append("tags", formData.tags.join(","));
    data.append("link", formData.link);
    data.append("images", formData.images.join(","));
    data.append("metrics", formData.metrics);
    data.append("memberIds", formData.assigned_member_ids.join(","));

    const result = await createProject(data);

    if (result.error) {
      toast.error(`Failed to create project: ${result.error}`);
      setLoading(false);
    } else {
      toast.success("Project created successfully!");
      router.push("/admin/projects");
    }
  };

  const toggleMember = (memberId: string) => {
    setFormData({
      ...formData,
      assigned_member_ids: formData.assigned_member_ids.includes(memberId)
        ? formData.assigned_member_ids.filter((id) => id !== memberId)
        : [...formData.assigned_member_ids, memberId],
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setFormData({ ...formData, images: [...formData.images, localPreview] });
    setUploading(true);

    const data = new FormData();
    data.append("file", file);

    const { uploadProjectImage } = await import("@/lib/upload");
    const result = await uploadProjectImage(data);

    setUploading(false);

    if (result.error) {
      toast.error(result.error);
      setFormData({
        ...formData,
        images: formData.images.filter((img) => img !== localPreview),
      });
      URL.revokeObjectURL(localPreview);
    } else if (result.url) {
      setFormData({
        ...formData,
        images: formData.images.map((img) =>
          img === localPreview ? result.url! : img
        ),
      });
      toast.success("Image uploaded successfully!");
      URL.revokeObjectURL(localPreview);
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const isFormValid = formData.title.trim().length > 0;

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm" className="-ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex gap-6">
        {/* Left Side - Form */}
        <div className="flex-1">
          <div className="space-y-6">
            {/* Project Details */}
            <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-none p-6">
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Details
              </h3>
              <div className="space-y-5">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Project Title *
                  </Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="mt-2 h-11 rounded-none"
                    placeholder="e.g., Website Redesign"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-2 min-h-[100px] resize-none rounded-none"
                    placeholder="Describe the project goals..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <select
                      className="flex h-11 w-full rounded-none border border-input bg-background px-3 py-2 text-sm mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Tags</Label>
                    <Input
                      value={formData.tags.join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tags: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                      className="mt-2 h-11 rounded-none"
                      placeholder="Web, Design"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-none p-6">
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline & Resources
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="mt-2 h-11 rounded-none"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Due Date</Label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) =>
                      setFormData({ ...formData, due_date: e.target.value })
                    }
                    className="mt-2 h-11 rounded-none"
                  />
                </div>

                <div className="col-span-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Project Link
                  </Label>
                  <Input
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="mt-2 h-11 rounded-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Project Images */}
            <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-none p-6">
              <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Project Images
              </h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Project image ${index + 1}`}
                        className="h-24 w-32 object-cover border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <label className="h-24 w-32 border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                    {uploading ? (
                      <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">
                          Upload
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Optional. Add screenshots or project images.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Team Members */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-none max-h-[400px] flex flex-col">
            <div className="p-4 border-b border-border flex-shrink-0">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {formData.assigned_member_ids.length} selected
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {teamMembers.map((member) => {
                const isSelected = formData.assigned_member_ids.includes(
                  member.id
                );
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleMember(member.id)}
                    className={`w-full p-3 rounded-none border-2 transition-all flex items-center gap-3 ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:bg-muted/50"
                    }`}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0 rounded-none">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-xs rounded-none">
                        {member.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-medium truncate">
                        {member.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {member.role}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-none bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
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
              <span>Fill in project title to continue</span>
            )}
          </div>
          <div className="flex gap-3">
            <Link href="/admin/projects">
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
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
