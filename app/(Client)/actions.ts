"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPublicProjects() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "Completed")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return (projects || []).map((p) => ({
    ...p,
    year: p.start_date
      ? new Date(p.start_date).getFullYear().toString()
      : new Date(p.created_at).getFullYear().toString(),
    tags: p.tags || [],
  }));
}

export async function getPublicTeam() {
  const supabase = await createClient();

  const { data: team, error } = await supabase
    .from("team")
    .select("*")
    .eq("status", "Active")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching team:", error);
    return [];
  }

  return (team || []).map((t) => ({
    ...t,
    skills: t.skills || [],
    works: [], // Placeholder to match type
    timeline: [], // Placeholder to match type
    quote: t.bio ? t.bio.split(".")[0] : "Building the future.",
  }));
}

export async function getLandingStats() {
  const supabase = await createClient();

  const { count: teamCount } = await supabase
    .from("team")
    .select("*", { count: "exact", head: true })
    .eq("status", "Active");

  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "Completed");

  return {
    experts: teamCount || 0,
    shipped: projectCount || 0,
  };
}

export async function getPublicMemberById(id: string) {
  const supabase = await createClient();

  const { data: member, error } = await supabase
    .from("team")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !member) {
    return null;
  }

  // Fetch projects
  const { data: projectMembers } = await supabase
    .from("project_members")
    .select("project_id, projects(*)")
    .eq("member_id", id);

  const works = (projectMembers || [])
    .map((pm: any) => pm.projects)
    .filter(
      (p: any) => p && (p.status === "Completed" || p.status === "In Progress")
    ) // Show completed/in-progress works
    .map((p: any) => ({
      ...p,
      year: p.start_date
        ? new Date(p.start_date).getFullYear().toString()
        : new Date(p.created_at).getFullYear().toString(),
      tags: p.tags || [],
    }));

  return {
    ...member,
    skills: member.skills || [],
    works,
    timeline: [
      {
        year: new Date(member.joined_date || member.created_at)
          .getFullYear()
          .toString(),
        title: "Joined Team",
        description: `Started role as ${member.role}`,
      },
    ], // Simplified timeline for now
  };
}
