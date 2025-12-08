"use server";

import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  totalTeamMembers: number;
  activeMembers: number;
  totalProjects: number;
  projectsByStatus: {
    pending: number;
    inProgress: number;
    completed: number;
    onHold: number;
  };
  recentProjects: Array<{
    id: string;
    title: string;
    status: string;
    created_at: string;
  }>;
  teamMembersWithProjects: Array<{
    name: string;
    projectCount: number;
  }>;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  // Get team members count
  const { count: totalTeamMembers } = await supabase
    .from("team")
    .select("*", { count: "exact", head: true });

  const { count: activeMembers } = await supabase
    .from("team")
    .select("*", { count: "exact", head: true })
    .eq("status", "Active");

  // Get projects count
  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  // Get projects by status
  const { data: allProjects } = await supabase
    .from("projects")
    .select("status");

  const projectsByStatus = {
    pending: allProjects?.filter((p) => p.status === "Pending").length || 0,
    inProgress:
      allProjects?.filter((p) => p.status === "In Progress").length || 0,
    completed: allProjects?.filter((p) => p.status === "Completed").length || 0,
    onHold: allProjects?.filter((p) => p.status === "On Hold").length || 0,
  };

  // Get recent projects
  const { data: recentProjects } = await supabase
    .from("projects")
    .select("id, title, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  // Get team members with project counts
  const { data: teamMembers } = await supabase
    .from("team")
    .select("id, name")
    .limit(5);

  const teamMembersWithProjects = await Promise.all(
    (teamMembers || []).map(async (member) => {
      const { count } = await supabase
        .from("project_members")
        .select("*", { count: "exact", head: true })
        .eq("member_id", member.id);

      return {
        name: member.name,
        projectCount: count || 0,
      };
    })
  );

  return {
    totalTeamMembers: totalTeamMembers || 0,
    activeMembers: activeMembers || 0,
    totalProjects: totalProjects || 0,
    projectsByStatus,
    recentProjects: recentProjects || [],
    teamMembersWithProjects,
  };
}
