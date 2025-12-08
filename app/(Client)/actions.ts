"use server";

import { createClient, createPublicClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

// Cache public projects for 5 minutes
export const getPublicProjects = unstable_cache(
  async () => {
    const supabase = createPublicClient();

    const { data: projects, error } = await supabase
      .from("projects")
      .select(
        "id, title, description, status, start_date, created_at, tags, link, metrics, category, images"
      )
      .eq("status", "Completed")
      .neq("category", "self")
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
  },
  ["public-projects"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["projects"],
  }
);

// Cache public team for 5 minutes
export const getPublicTeam = unstable_cache(
  async () => {
    const supabase = createPublicClient();

    const { data: team, error } = await supabase
      .from("team")
      .select("id, name, email, role, status, avatar, bio, skills")
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
  },
  ["public-team"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["team"],
  }
);

// Cache landing stats for 10 minutes (changes rarely)
export const getLandingStats = unstable_cache(
  async () => {
    const supabase = createPublicClient();

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
  },
  ["landing-stats"],
  {
    revalidate: 600, // Cache for 10 minutes
    tags: ["stats"],
  }
);

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
      (p: any) =>
        p &&
        (p.status === "Completed" || p.status === "In Progress") &&
        p.category !== "self"
    ) // Show completed/in-progress works, hide self category
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

export async function getPublicProjectById(id: string) {
  const supabase = await createClient();

  // Fetch project details
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project || project.category === "self") {
    return null;
  }

  // Fetch team members involved in the project
  const { data: projectMembers } = await supabase
    .from("project_members")
    .select("member_id, team(*)")
    .eq("project_id", id);

  const team = (projectMembers || [])
    .map((pm: any) => pm.team)
    .filter((t: any) => t && t.status === "Active")
    .map((t: any) => ({
      ...t,
      skills: t.skills || [],
      works: [],
      timeline: [],
      quote: t.bio ? t.bio.split(".")[0] : "Building the future.",
    }));

  return {
    ...project,
    year: project.start_date
      ? new Date(project.start_date).getFullYear().toString()
      : new Date(project.created_at).getFullYear().toString(),
    tags: project.tags || [],
    team,
  };
}
