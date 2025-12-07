"use client";

import { Breadcrumbs } from "@/components/ui/breadcrumbs";

interface PageHeaderProps {
    title: string;
    description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <section className="relative flex flex-col justify-center items-start text-left px-6 pt-40 pb-20 container mx-auto">
            <Breadcrumbs className="mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-foreground max-w-4xl">
                {title}
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light">
                {description}
            </p>

            <div className="w-24 h-1 bg-foreground mt-8" />
        </section>
    );
}
