"use client";

import WorkCard from "@/components/WorkCard";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import { getPublicProjects } from "../actions";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorksPage() {
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorks = async () => {
      const data = await getPublicProjects();
      setWorks(data);
      setLoading(false);
    };
    loadWorks();
  }, []);

  const allTags = Array.from(new Set(works.flatMap((w) => w.tags || []))).slice(
    0,
    15
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Our Work"
        description="A showcase of technical excellence and creative innovation. Explore our portfolio of deployed solutions."
      />

      <div className="container mx-auto px-6 py-12">
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {loading
            ? [1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))
            : allTags.map((tech: any) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="px-3 py-1 text-sm border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-default"
                >
                  {tech}
                </Badge>
              ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-full">
                  <div className="border border-border p-6 space-y-4 h-[300px] flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              ))
            : works.map((work) => (
                <div key={work.id} className="h-full">
                  <WorkCard project={work} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
