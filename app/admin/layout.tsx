"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth-actions";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    loadUser();
  }, []);

  // Get page title based on route
  useEffect(() => {
    const getPageTitle = () => {
      if (pathname === "/admin") return "Dashboard";
      if (pathname === "/admin/team") return "Team Members";
      if (pathname === "/admin/team/new") return "Add Team Member";
      if (pathname.startsWith("/admin/team/")) return "Edit Team Member";
      if (pathname === "/admin/projects") return "Projects";
      if (pathname === "/admin/projects/new") return "Add Project";
      if (pathname.startsWith("/admin/projects/")) return "Edit Project";
      if (pathname === "/admin/settings") return "Settings";
      return "Admin";
    };

    setPageTitle(getPageTitle());
  }, [pathname]);

  // Listen for custom title updates from child pages
  useEffect(() => {
    const handleTitleChange = (e: any) => {
      if (e.detail) {
        setPageTitle(e.detail);
      }
    };

    window.addEventListener("updatePageTitle", handleTitleChange);
    return () => {
      window.removeEventListener("updatePageTitle", handleTitleChange);
    };
  }, []);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/team", label: "Team", icon: Users },
    { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Fixed Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col fixed left-0 top-0 bottom-0 z-40">
        <div className="p-6 h-20 border-b border-border">
          <h1 className="text-xl font-bold tracking-tight">DevXtra Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-none text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start rounded-none border-foreground/20 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
            onClick={async () => {
              await logout();
            }}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area with Fixed Header */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Fixed Header */}
        <header className="h-20 border-b border-border bg-card px-8 flex items-center justify-between fixed top-0 right-0 left-64 z-30">
          <div>
            <h2 className="text-lg font-semibold capitalize">
              {pageTitle || pathname.split("/").pop() || "Dashboard"}
            </h2>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-medium text-sm">{user.email}</div>
                <div className="text-xs text-muted-foreground font-mono">
                  ID: {user.id}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto mt-20 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
