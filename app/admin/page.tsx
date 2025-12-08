"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, type DashboardStats } from "./actions";
import {
  Users,
  FolderGit2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const STATUS_COLORS = {
  Pending: "#f59e0b",
  "In Progress": "#3b82f6",
  Completed: "#10b981",
  "On Hold": "#ef4444",
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

  // Prepare data for charts
  const statusChartData = stats
    ? [
        {
          status: "Pending",
          count: stats.projectsByStatus.pending,
          fill: STATUS_COLORS.Pending,
        },
        {
          status: "Active",
          count: stats.projectsByStatus.inProgress,
          fill: STATUS_COLORS["In Progress"],
        },
        {
          status: "Done",
          count: stats.projectsByStatus.completed,
          fill: STATUS_COLORS.Completed,
        },
        {
          status: "On Hold",
          count: stats.projectsByStatus.onHold,
          fill: STATUS_COLORS["On Hold"],
        },
      ].filter((item) => item.count > 0)
    : [];

  const workloadData = stats?.teamMembersWithProjects.slice(0, 5) || [];

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const completionRate = stats?.totalProjects
    ? Math.round((stats.projectsByStatus.completed / stats.totalProjects) * 100)
    : 0;

  // Calculate active rate (percentage of active members)
  const activeRate = stats?.totalTeamMembers
    ? Math.round((stats.activeMembers / stats.totalTeamMembers) * 100)
    : 0;

  // Calculate in-progress percentage
  const inProgressRate = stats?.totalProjects
    ? Math.round(
        (stats.projectsByStatus.inProgress / stats.totalProjects) * 100
      )
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Track team performance and project progress
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Team Members"
          value={stats?.totalTeamMembers || 0}
          subtitle={`${activeRate}% active`}
          icon={Users}
        />
        <MetricCard
          label="Total Projects"
          value={stats?.totalProjects || 0}
          subtitle="All time"
          icon={FolderGit2}
        />
        <MetricCard
          label="Completed"
          value={stats?.projectsByStatus.completed || 0}
          subtitle={`${completionRate}% success rate`}
          icon={CheckCircle2}
        />
        <MetricCard
          label="In Progress"
          value={stats?.projectsByStatus.inProgress || 0}
          subtitle={`${inProgressRate}% of total`}
          icon={Activity}
          pulse={(stats?.projectsByStatus.inProgress || 0) > 0}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project Status Overview */}
        <div className="lg:col-span-2 border border-border rounded-none p-6 bg-gradient-to-br from-card to-card/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-base">Project Status</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Distribution across stages
              </p>
            </div>
          </div>

          {statusChartData.length > 0 ? (
            <div className="space-y-3">
              {statusChartData.map((item) => {
                const percentage = stats?.totalProjects
                  ? Math.round((item.count / stats.totalProjects) * 100)
                  : 0;

                return (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.status}</span>
                      <span className="text-muted-foreground">
                        {item.count} projects
                      </span>
                    </div>
                    <div className="h-2 bg-secondary/30 rounded-none overflow-hidden">
                      <div
                        className="h-full rounded-none transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.fill,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              No project data available
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="border border-border rounded-none p-6 bg-gradient-to-br from-card to-card/50">
          <h3 className="font-semibold text-base mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <StatItem
              label="Completion Rate"
              value={`${completionRate}%`}
              icon={TrendingUp}
            />
            <StatItem
              label="Pending Tasks"
              value={stats?.projectsByStatus.pending || 0}
              icon={Clock}
            />
            <StatItem
              label="Active Members"
              value={stats?.activeMembers || 0}
              icon={Users}
            />
          </div>
        </div>
      </div>

      {/* Team Workload & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Team Workload Chart */}
        <div className="border border-border rounded-none p-6 bg-gradient-to-br from-card to-card/50">
          <div className="mb-4">
            <h3 className="font-semibold text-base">Team Workload</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Projects per member
            </p>
          </div>

          {workloadData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={workloadData}
                layout="horizontal"
                margin={{ left: 0, right: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="projectCount" radius={[0, 4, 4, 0]}>
                  {workloadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3b82f6" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              No team data available
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="border border-border rounded-none p-6 bg-gradient-to-br from-card to-card/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-base">Recent Projects</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Latest additions
              </p>
            </div>
            <Link
              href="/admin/projects"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {stats?.recentProjects && stats.recentProjects.length > 0 ? (
            <div className="space-y-3">
              {stats.recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 rounded-none hover:bg-muted/30 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded-none bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FolderGit2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                        {project.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 flex-shrink-0"
                    style={{
                      borderColor:
                        STATUS_COLORS[
                          project.status as keyof typeof STATUS_COLORS
                        ],
                      color:
                        STATUS_COLORS[
                          project.status as keyof typeof STATUS_COLORS
                        ],
                    }}
                  >
                    {project.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
              No recent projects
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  pulse,
}: {
  label: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  pulse?: boolean;
}) {
  return (
    <div className="relative border border-border rounded-none p-5 bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`p-2 rounded-none bg-primary/5 ${
            pulse ? "animate-pulse" : ""
          }`}
        >
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold mb-0.5">{value}</p>
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
          {label}
        </p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-none bg-muted/30">
      <div className="p-2 rounded-none bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
