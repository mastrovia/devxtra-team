import Link from "next/link";
import { Developer } from "@/lib/data";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function DeveloperCard({ developer }: { developer: Developer }) {
  return (
    <Link href={`/team/${developer.id}`} className="block h-full group">
      <div className="h-full border border-border bg-card hover:border-foreground/50 transition-colors duration-300 flex flex-col items-stretch">
        <CardHeader className="flex flex-row items-center gap-4 pb-4 pt-6 px-6">
          <Avatar className="h-16 w-16 border border-border group-hover:border-foreground transition-colors duration-300">
            <AvatarImage src={developer.avatar} alt={developer.name} />
            <AvatarFallback>{developer.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-foreground group-hover:underline decoration-1 underline-offset-4 transition-all duration-300">
              {developer.name}
            </h3>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {developer.role}
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3 group-hover:text-foreground transition-colors duration-300">
            {developer.bio}
          </p>
          <div className="flex flex-wrap gap-2">
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
        </CardContent>
      </div>
    </Link>
  );
}
