"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, type DashboardStats } from "./actions";
import {
  Users,
  FolderGit2,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const COLORS = {
  pending: "#eab308",
  inProgress: "#3b82f6",
  completed: "#22c55e",
  onHold: "#ef4444",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const data = await getDashboardStats();
    setStats(data);
    setLoading(false);
  };

  const projectStatusData = stats
    ? [
        {
          name: "Pending",
          value: stats.projectsByStatus.pending,
          color: COLORS.pending,
        },
        {
          name: "In Progress",
          value: stats.projectsByStatus.inProgress,
          color: COLORS.inProgress,
        },
        {
          name: "Completed",
          value: stats.projectsByStatus.completed,
          color: COLORS.completed,
        },
        {
          name: "On Hold",
          value: stats.projectsByStatus.onHold,
          color: COLORS.onHold,
        },
      ].filter((item) => item.value > 0)
    : [];

  const teamWorkloadData = stats?.teamMembersWithProjects || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your team and projects
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your team and projects
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Team Members"
          value={stats?.totalTeamMembers || 0}
          icon={Users}
          description={`${stats?.activeMembers || 0} active`}
          color="blue"
        />
        <StatsCard
          title="Total Projects"
          value={stats?.totalProjects || 0}
          icon={FolderGit2}
          description="All projects"
          color="purple"
        />
        <StatsCard
          title="Completed"
          value={stats?.projectsByStatus.completed || 0}
          icon={CheckCircle2}
          description="Projects done"
          color="green"
        />
        <StatsCard
          title="In Progress"
          value={stats?.projectsByStatus.inProgress || 0}
          icon={TrendingUp}
          description="Active projects"
          color="amber"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <div className="border border-border bg-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Project Status Distribution
          </h3>
          {projectStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No projects yet
            </div>
          )}
        </div>

        {/* Team Workload */}
        <div className="border border-border bg-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Team Workload</h3>
          {teamWorkloadData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={teamWorkloadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="projectCount"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No team members yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="border border-border bg-card rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
        {stats?.recentProjects && stats.recentProjects.length > 0 ? (
          <div className="space-y-3">
            {stats.recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FolderGit2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    project.status === "Completed"
                      ? "border-green-500 text-green-500"
                      : project.status === "In Progress"
                      ? "border-blue-500 text-blue-500"
                      : project.status === "Pending"
                      ? "border-yellow-500 text-yellow-500"
                      : "border-red-500 text-red-500"
                  }
                >
                  {project.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No recent projects
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
  color: "blue" | "purple" | "green" | "amber";
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600",
    purple: "bg-purple-500/10 text-purple-600",
    green: "bg-green-500/10 text-green-600",
    amber: "bg-amber-500/10 text-amber-600",
  };

  return (
    <div className="border border-border bg-card rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
