"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Project = {
  id: string;
  title: string;
  description: string | null;
  status: "Pending" | "In Progress" | "Completed" | "On Hold";
  start_date: string | null;
  due_date: string | null;
  tags: string[];
  link: string | null;
  images: string[];
  metrics: string | null;
  assigned_member_ids?: string[];
};

export async function getProjects() {
  const supabase = await createClient();

  // Get projects
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  // Get project members for each project
  const projectsWithMembers = await Promise.all(
    projects.map(async (project) => {
      const { data: members } = await supabase
        .from("project_members")
        .select("member_id")
        .eq("project_id", project.id);

      return {
        ...project,
        assigned_member_ids: members?.map((m) => m.member_id) || [],
      };
    })
  );

  return projectsWithMembers as Project[];
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const dueDate = formData.get("dueDate") as string;
  const link = formData.get("link") as string;
  const metrics = formData.get("metrics") as string;
  const tagsStr = formData.get("tags") as string;
  const imagesStr = formData.get("images") as string;
  const memberIdsStr = formData.get("memberIds") as string;

  const tags = tagsStr
    ? tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const images = imagesStr
    ? imagesStr
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean)
    : [];
  const memberIds = memberIdsStr
    ? memberIdsStr
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean)
    : [];

  // Insert project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      title,
      description,
      status,
      start_date: new Date().toISOString(),
      due_date: dueDate || null,
      tags,
      link: link || null,
      images,
      metrics: metrics || null,
    })
    .select()
    .single();

  if (projectError) {
    return { error: projectError.message };
  }

  // Insert project members
  if (memberIds.length > 0) {
    const { error: membersError } = await supabase
      .from("project_members")
      .insert(
        memberIds.map((memberId: string) => ({
          project_id: project.id,
          member_id: memberId,
        }))
      );

    if (membersError) {
      return { error: membersError.message };
    }
  }

  revalidatePath("/admin/projects");
  return { success: true, data: project };
}

export async function updateProject(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const dueDate = formData.get("dueDate") as string;
  const link = formData.get("link") as string;
  const metrics = formData.get("metrics") as string;
  const tagsStr = formData.get("tags") as string;
  const imagesStr = formData.get("images") as string;
  const memberIdsStr = formData.get("memberIds") as string;

  const tags = tagsStr
    ? tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const images = imagesStr
    ? imagesStr
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean)
    : [];
  const memberIds = memberIdsStr
    ? memberIdsStr
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean)
    : [];

  // Update project
  const { error: projectError } = await supabase
    .from("projects")
    .update({
      title,
      description,
      status,
      due_date: dueDate || null,
      tags,
      link: link || null,
      images,
      metrics: metrics || null,
    })
    .eq("id", id);

  if (projectError) {
    return { error: projectError.message };
  }

  // Update project members: delete all and re-insert
  await supabase.from("project_members").delete().eq("project_id", id);

  if (memberIds.length > 0) {
    const { error: membersError } = await supabase
      .from("project_members")
      .insert(
        memberIds.map((memberId: string) => ({
          project_id: id,
          member_id: memberId,
        }))
      );

    if (membersError) {
      return { error: membersError.message };
    }
  }

  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/projects");
  return { success: true };
}
