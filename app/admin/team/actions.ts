"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  enrollment_no: string | null;
  role: "Student" | "Team Lead" | "Member" | "Developer" | "Designer";
  status: "Active" | "Inactive" | "Alumni";
  joined_date: string;
  avatar: string;
  bio: string | null;
  skills: string[];
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
};

export async function getTeamMembers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching team members:", error);
    return [];
  }

  return data as TeamMember[];
}

export async function createTeamMember(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;
  const enrollmentNo = formData.get("enrollmentNo") as string;
  const avatar = formData.get("avatar") as string;
  const bio = formData.get("bio") as string;
  const skillsStr = formData.get("skills") as string;
  const githubUrl = formData.get("githubUrl") as string;
  const linkedinUrl = formData.get("linkedinUrl") as string;
  const portfolioUrl = formData.get("portfolioUrl") as string;

  const skills = skillsStr
    ? skillsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const { data, error } = await supabase
    .from("team")
    .insert({
      name,
      email,
      phone,
      role,
      status,
      enrollment_no: enrollmentNo,
      avatar:
        avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      bio,
      skills,
      github_url: githubUrl || null,
      linkedin_url: linkedinUrl || null,
      portfolio_url: portfolioUrl || null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/team");
  return { success: true, data };
}

export async function updateTeamMember(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;
  const avatar = formData.get("avatar") as string;
  const bio = formData.get("bio") as string;
  const skillsStr = formData.get("skills") as string;
  const githubUrl = formData.get("githubUrl") as string;
  const linkedinUrl = formData.get("linkedinUrl") as string;
  const portfolioUrl = formData.get("portfolioUrl") as string;

  const skills = skillsStr
    ? skillsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const updateData: any = {
    name,
    email,
    phone,
    role,
    status,
    bio,
    skills,
    github_url: githubUrl || null,
    linkedin_url: linkedinUrl || null,
    portfolio_url: portfolioUrl || null,
  };

  // Only update avatar if provided
  if (avatar) {
    updateData.avatar = avatar;
  }

  const { error } = await supabase.from("team").update(updateData).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/team");
  return { success: true };
}

export async function deleteTeamMember(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("team").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/team");
  return { success: true };
}
