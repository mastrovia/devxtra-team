"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ className }: { className?: string }) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter((item) => item !== "");

    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-muted-foreground mb-4", className)}>
            <Link href="/" className="hover:text-foreground transition-colors flex items-center">
                <Home className="h-4 w-4" />
            </Link>
            {segments.length > 0 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />}

            {segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;
                const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

                return (
                    <Fragment key={href}>
                        {isLast ? (
                            <span className="font-medium text-foreground">{title}</span>
                        ) : (
                            <Link href={href} className="hover:text-foreground transition-colors">
                                {title}
                            </Link>
                        )}
                        {!isLast && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />}
                    </Fragment>
                );
            })}
        </nav>
    );
}
