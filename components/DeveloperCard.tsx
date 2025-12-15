import Link from 'next/link';
import { Developer } from '@/lib/data';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function DeveloperCard({ developer }: { developer: Developer }) {
    return (
        <Link href={`/team/${developer.id}`} className="block h-full group">
            <div className="h-full border border-border bg-card hover:border-foreground/50 transition-colors duration-300 flex flex-col items-center text-center p-6">
                <div className="relative mb-4">
                    <Avatar className="h-24 w-24 border border-border group-hover:border-foreground transition-colors duration-300 grayscale">
                        <AvatarImage src={developer.avatar} alt={developer.name} />
                        <AvatarFallback>{developer.name[0]}</AvatarFallback>
                    </Avatar>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:underline decoration-1 underline-offset-4 transition-all duration-300">
                    {developer.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-4">{developer.role}</p>

                <div className="w-full border-t border-border my-4" />

                <p className="text-xs text-muted-foreground mb-1">{developer.batch}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {developer.skills.slice(0, 3).map((skill) => (
                        <Badge
                            key={skill}
                            variant="secondary"
                            className="text-[10px] px-2 bg-secondary text-secondary-foreground border border-transparent rounded-sm"
                        >
                            {skill}
                        </Badge>
                    ))}
                </div>
            </div>
        </Link>
    );
}
