import { TimelineItem } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function Timeline({ items }: { items: TimelineItem[] }) {
    return (
        <div className="relative pl-8 border-l border-border space-y-8">
            {items.map((item, index) => (
                <div key={index} className="relative">
                    <div className="absolute -left-[37px] top-1 h-4 w-4 rounded-full border-2 border-background bg-muted-foreground ring-4 ring-background" />
                    <div className="flex flex-col gap-1">
                        <Badge variant="secondary" className="w-fit font-mono text-xs mb-1">
                            {item.year}
                        </Badge>
                        <h4 className="text-base font-semibold text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
