import { developers } from "@/lib/data";
import WorkCard from "@/components/WorkCard";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";

export default function WorksPage() {
    const allWorks = developers.flatMap((dev) => dev.works);
    const stack = Array.from(new Set(developers.flatMap((dev) => dev.skills))).slice(0, 10);

    return (
        <div className="min-h-screen bg-background">
            <PageHeader
                title="Our Work"
                description="A showcase of technical excellence and creative innovation. Explore our portfolio of deployed solutions."
            />

            <div className="container mx-auto px-6 py-12">
                <div className="mb-12 flex flex-wrap justify-center gap-2">
                    {stack.map((tech) => (
                        <Badge key={tech} variant="outline" className="px-3 py-1 text-sm border-muted-foreground/30 text-muted-foreground hover:border-neon-cyan hover:text-neon-cyan transition-colors cursor-default">
                            {tech}
                        </Badge>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allWorks.map((work) => (
                        <div key={work.id} className="h-full">
                            <WorkCard project={work} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
