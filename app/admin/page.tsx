"use client";

import { initialStudents, initialProjects } from "@/lib/admin-data";
import { Users, BookOpen, CheckCircle, Clock } from "lucide-react";

export default function AdminDashboard() {
  const totalStudents = initialStudents.length;
  const totalProjects = initialProjects.length;
  const completedProjects = initialProjects.filter(
    (p) => p.status === "Completed"
  ).length;
  const activeProjects = initialProjects.filter(
    (p) => p.status === "In Progress" || p.status === "Pending"
  ).length;

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      description: "Active enrollments",
    },
    {
      title: "Total Projects",
      value: totalProjects,
      icon: BookOpen,
      description: "All active & archived",
    },
    {
      title: "Completed",
      value: completedProjects,
      icon: CheckCircle,
      description: "Delivered projects",
    },
    {
      title: "Active",
      value: activeProjects,
      icon: Clock,
      description: "Currently in progress",
    },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="p-8 border border-border bg-card text-card-foreground hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-secondary/50 rounded-none group-hover:bg-secondary transition-colors">
                <stat.icon className="h-6 w-6 text-foreground" />
              </div>
              <span className="text-4xl font-bold tracking-tighter tabular-nums">
                {stat.value}
              </span>
            </div>
            <h3 className="text-lg font-medium text-muted-foreground">
              {stat.title}
            </h3>
            <p className="text-sm text-muted-foreground/60 mt-2">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity / Quick Actions could go here */}
        <div className="border border-border p-8 bg-background">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              No recent activity to display.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
