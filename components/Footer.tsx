import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-background border-t border-border py-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <Link href="/" className="text-2xl font-bold tracking-tight text-foreground flex items-center mb-6">
                            Devxtra Team
                        </Link>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            DevXtra is an elite collective of engineers, creators, and founders in the making. We build what the future needs

                        </p>
                        <div className="flex gap-4">
                            {[Github, Twitter, Linkedin].map((Icon, i) => (
                                <Button key={i} variant="ghost" size="icon" className="hover:text-foreground hover:bg-muted/50 rounded-none">
                                    <Icon className="h-5 w-5" />
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold mb-6 text-foreground">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="/team" className="text-muted-foreground hover:text-foreground transition-colors">The Team</Link></li>
                            <li><Link href="/works" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</Link></li>
                            <li><Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold mb-6 text-foreground">Legal</h4>
                        <ul className="space-y-4">
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold mb-6 text-foreground">Stay Updated</h4>
                        <p className="text-sm text-muted-foreground mb-4">Join our briefing on future technologies.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-muted border border-border rounded-none px-4 py-2 text-sm w-full focus:outline-none focus:border-foreground transition-colors text-foreground"
                            />
                            <Button size="icon" className="bg-foreground text-background hover:bg-foreground/90 rounded-none">
                                <Mail className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">© 2025 Devxtra Team. All rights reserved.</p>
                    <p className="text-sm text-muted-foreground font-mono">Designed in SF. Built for the world.</p>
                </div>
            </div>
        </footer>
    );
}
