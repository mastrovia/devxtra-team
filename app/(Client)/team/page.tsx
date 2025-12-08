"use client";

import DeveloperCard from "@/components/DeveloperCard";
import PageHeader from "@/components/PageHeader";
import { getPublicTeam } from "../actions";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      const data = await getPublicTeam();
      setTeam(data);
      setLoading(false);
    };
    loadTeam();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Our Elite Squad"
        description="Meet the minds behind the code. Specialists in every domain, united by a passion for excellence."
      />

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-full">
                  <div className="border border-border p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-sm" />
                      <Skeleton className="h-6 w-16 rounded-sm" />
                      <Skeleton className="h-6 w-16 rounded-sm" />
                    </div>
                  </div>
                </div>
              ))
            : team.map((dev) => (
                <div key={dev.id} className="h-full">
                  <DeveloperCard developer={dev} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
