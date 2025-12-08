import { developers } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import WorkCard from "@/components/WorkCard";
import Timeline from "@/components/Timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default async function DeveloperPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const developer = developers.find((d) => d.id === resolvedParams.id);

    if (!developer) {
        notFound();
    }

    return (
        <div className="container mx-auto px-6 py-12 pt-32">
            <Breadcrumbs className="mb-8" />
            <Button variant="ghost" asChild className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
                <Link href="/team">← Back to Team</Link>
            </Button>

            <header className="flex flex-col md:flex-row gap-8 items-start mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="shrink-0">
                    <div className="h-32 w-32 rounded-full border-4 border-card bg-muted overflow-hidden">
                        <Image
                            src={developer.avatar}
                            alt={developer.name}
                            width={128}
                            height={128}
                            className="object-cover"
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">{developer.name}</h1>
                    <p className="font-mono text-muted-foreground uppercase tracking-widest text-sm mb-6">
                        {developer.role}
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-6">
                        {developer.bio}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {developer.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="px-3 py-1">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
            </header>

            <Separator className="my-12" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
                <section className="lg:col-span-2">
                    <h2 className="text-2xl font-bold tracking-tight mb-8">Selected Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {developer.works.map((project) => (
                            <WorkCard key={project.id} project={project} />
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-8">Career Timeline</h2>
                    <Timeline items={developer.timeline} />
                </section>
            </div>
        </div>
    );
}

export function generateStaticParams() {
    return developers.map((developer) => ({
        id: developer.id,
    }));
}
