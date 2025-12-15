"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPublicProjects() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
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
      ? new Date(p.start_date)
          .toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
          .toUpperCase()
      : new Date(p.created_at)
          .toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
          .toUpperCase(),
    tags: p.tags || [],
  }));
}

export async function getPublicTeam() {
  const supabase = await createClient();

  const { data: team, error } = await supabase.from("team").select("*").eq("status", "Active").order("name", { ascending: true });

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

  const { count: teamCount } = await supabase.from("team").select("*", { count: "exact", head: true }).eq("status", "Active");

  const { count: projectCount } = await supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "Completed");

  return {
    experts: teamCount || 0,
    shipped: projectCount || 0,
  };
}

export async function getPublicMemberById(id: string) {
  const supabase = await createClient();

  const { data: member, error } = await supabase.from("team").select("*").eq("id", id).single();

  if (error || !member) {
    return null;
  }

  // Fetch projects
  const { data: projectMembers } = await supabase.from("project_members").select("project_id, projects(*)").eq("member_id", id);

  const works = (projectMembers || [])
    .map((pm: any) => pm.projects)
    .filter((p: any) => p && (p.status === "Completed" || p.status === "In Progress") && p.category !== "self") // Show completed/in-progress works, hide self category
    .map((p: any) => ({
      ...p,
      year: p.start_date
        ? new Date(p.start_date)
            .toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
            .toUpperCase()
        : new Date(p.created_at)
            .toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
            .toUpperCase(),
      tags: p.tags || [],
    }));

  // Create timeline events
  const joinedDate = new Date(member.joined_date || member.created_at);
  const joinedEvent = {
    year: joinedDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase(),
    title: "Joined Team",
    description: `Started role as ${member.role}`,
    dateObj: joinedDate,
  };

  const projectEvents = works.map((p: any) => {
    const startDate = p.start_date ? new Date(p.start_date) : new Date(p.created_at);
    const endDate = p.due_date ? new Date(p.due_date) : null;

    const startStr = startDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
    const endStr = endDate ? endDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase() : "PRESENT";

    return {
      year: `${startStr} - ${endStr}`,
      title: p.title,
      description: `Worked on ${p.title}`,
      dateObj: startDate,
    };
  });

  // Combine and sort chronologically
  const timeline = [joinedEvent, ...projectEvents]
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
    .map(({ dateObj, ...rest }) => rest);

  return {
    ...member,
    skills: member.skills || [],
    works,
    timeline,
  };
}

export async function getPublicProjectById(id: string) {
  const supabase = await createClient();

  // Fetch project details
  const { data: project, error } = await supabase.from("projects").select("*").eq("id", id).single();

  if (error || !project || project.category === "self") {
    return null;
  }

  // Fetch team members involved in the project
  const { data: projectMembers } = await supabase.from("project_members").select("member_id, team(*)").eq("project_id", id);

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
      ? new Date(project.start_date)
          .toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
          .toUpperCase()
      : new Date(project.created_at)
          .toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
          .toUpperCase(),
    tags: project.tags || [],
    team,
  };
}
