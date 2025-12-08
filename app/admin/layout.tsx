"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth-actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Team", href: "/admin/team", icon: Users },
    { name: "Projects", href: "/admin/projects", icon: CheckSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Fixed Sidebar */}
      <aside className="w-64  border-r border-border bg-card flex flex-col fixed left-0 top-0 bottom-0 z-40">
        <div className="p-6 h-20 border-b border-border">
          <h1 className="text-xl font-bold tracking-tight">DevXtra Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start rounded-none border-l-2 border-transparent hover:border-l-primary data-[active=true]:border-l-primary transition-all"
                data-active={isActive}
              >
                <Link href={item.href}>
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
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
              {pathname.split("/").pop() || "Dashboard"}
            </h2>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto mt-16 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
