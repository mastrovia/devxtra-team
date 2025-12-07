"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 flex items-center transition-all duration-300 border-b",
                scrolled
                    ? "h-16 bg-background/80 backdrop-blur-md border-border/50"
                    : "h-20 bg-background/0 border-transparent"
            )}
        >
            <div className="container mx-auto px-6 flex justify-between items-center w-full">
                <Link href="/" className="text-xl font-bold tracking-tight text-foreground flex items-center z-50 relative">
                    DevXtra
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {["Team", "Works", "Contact"].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase()}`}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                    <Button variant="outline" size="sm" asChild className="rounded-none border-foreground/20 hover:bg-foreground hover:text-background transition-colors">
                        <Link href="/contact">
                            Get in touch
                        </Link>
                    </Button>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden z-50 relative p-2"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>

                {/* Mobile Nav Overlay */}
                <div className={cn(
                    "fixed inset-0 bg-background z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out md:hidden",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    {["Team", "Works", "Contact"].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase()}`}
                            className="text-3xl font-bold tracking-tight hover:text-muted-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item}
                        </Link>
                    ))}
                    <Button variant="outline" size="lg" asChild className="mt-8 rounded-none border-foreground/20 hover:bg-foreground hover:text-background transition-colors">
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                            Get in touch
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
