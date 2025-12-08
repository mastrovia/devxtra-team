import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import DeveloperCard from "@/components/DeveloperCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getPublicProjectById } from "../../actions";
import { Project } from "@/lib/data";

export default async function WorkDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  if (!resolvedParams.id) return notFound();

  const work = await getPublicProjectById(resolvedParams.id);

  if (!work) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-12 pt-32 min-h-screen">
      <Button
        variant="ghost"
        asChild
        className="mb-8 pl-0 hover:bg-transparent hover:text-primary transition-colors"
      >
        <Link href="/works">← Back to Works</Link>
      </Button>

      <header className="flex flex-col gap-8 items-start mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full max-w-4xl">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {work.title}
            </h1>
            {work.status === "In Progress" && (
              <Badge variant="secondary" className="text-base px-3 py-1">
                In Progress
              </Badge>
            )}
            {work.year && (
              <Badge
                variant="outline"
                className="text-base px-3 py-1 font-mono"
              >
                {work.year}
              </Badge>
            )}
          </div>

          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            {work.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {work.tags.map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-4 py-1.5 text-sm bg-secondary/50 text-secondary-foreground"
              >
                {tag}
              </Badge>
            ))}
            {work.metrics && (
              <Badge
                variant="default"
                className="px-4 py-1.5 text-sm bg-primary text-primary-foreground font-semibold"
              >
                {work.metrics}
              </Badge>
            )}
          </div>

          {work.link && (
            <Button asChild size="lg" className="gap-2 group">
              <a
                href={work.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Visit Project
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </Button>
          )}
        </div>
      </header>

      <Separator className="my-12 opacity-50" />

      <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        <h2 className="text-2xl font-bold tracking-tight mb-8 flex items-center gap-3">
          Contributors
          <Badge
            variant="outline"
            className="ml-2 font-mono font-normal text-muted-foreground"
          >
            {work.team?.length || 0}
          </Badge>
        </h2>

        {work.team && work.team.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {work.team.map((dev: any) => (
              <div key={dev.id} className="h-full">
                <DeveloperCard developer={dev} />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 border border-dashed border-border rounded-xl text-center text-muted-foreground bg-muted/20">
            <p>No team members listed for this project.</p>
          </div>
        )}
      </section>
    </div>
  );
}
