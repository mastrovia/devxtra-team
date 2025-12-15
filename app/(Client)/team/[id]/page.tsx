import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import WorkCard from '@/components/WorkCard';
import Timeline from '@/components/Timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getPublicMemberById } from '../../actions';

export default async function DeveloperPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    // Handle potential invalid UUIDs or missing IDs gracefully
    if (!resolvedParams.id) return notFound();

    try {
        const developer = await getPublicMemberById(resolvedParams.id);

        if (!developer) {
            notFound();
        }

        return (
            <div className="container mx-auto px-6 py-12 pt-32">
                {/* <Breadcrumbs className="mb-8" /> */}
                <Button
                    variant="ghost"
                    asChild
                    className="mb-8 pl-0 hover:bg-transparent hover:text-primary"
                >
                    <Link href="/team">← Back to Team</Link>
                </Button>

                <header className="flex flex-col md:flex-row gap-8 items-start mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="shrink-0">
                        <div className="h-32 w-32 rounded-full border-4 border-card bg-muted overflow-hidden grayscale">
                            <Image
                                src={developer.avatar}
                                alt={developer.name}
                                width={128}
                                height={128}
                                className="object-cover h-full w-full"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold tracking-tight mb-2">{developer.name}</h1>
                        <p className="font-mono text-muted-foreground uppercase tracking-widest text-sm mb-6">
                            {developer.role}
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-6">
                            {developer.bio || 'No bio available.'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {developer.skills.map((skill: string) => (
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
                        {developer.works.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {developer.works.map((project: any) => (
                                    <div key={project.id} className="h-full">
                                        <Link
                                            href={`/works/${project.id}`}
                                            className="block h-full"
                                        >
                                            <WorkCard project={project} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No public projects yet.</p>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold tracking-tight mb-8">Career Timeline</h2>
                        <Timeline items={developer.timeline} />
                    </section>
                </div>
            </div>
        );
    } catch (error) {
        // If fetch fails (e.g. invalid UUID syntax), show not found
        console.error('Error fetching developer:', error);
        notFound();
    }
}
