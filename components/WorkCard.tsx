import { Project } from '@/lib/data';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function WorkCard({ project }: { project: Project }) {
    return (
        <div className="h-full border border-border bg-card hover:border-foreground/50 transition-colors duration-300 flex flex-col items-stretch group">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-6 px-6">
                <CardTitle className="text-lg font-bold group-hover:underline decoration-1 underline-offset-4 transition-all flex items-center justify-between w-full">
                    <span>{project.title}</span>
                    <span className="text-sm font-mono font-normal text-muted-foreground ml-2">
                        {project.year}
                    </span>
                </CardTitle>
                <div className="flex items-center gap-3">
                    {project.metrics && (
                        <Badge
                            variant="default"
                            className="bg-foreground text-background hover:bg-foreground/90 rounded-sm"
                        >
                            {project.metrics}
                        </Badge>
                    )}
                    {project.budget && (
                        <Badge variant="outline" className="font-mono text-xs rounded-sm">
                            {project.budget}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-4 px-6 pb-6">
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed group-hover:text-foreground transition-colors">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-sm"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </div>
    );
}
