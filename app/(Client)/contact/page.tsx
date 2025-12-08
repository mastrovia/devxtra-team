"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Message sent successfully!", {
            description: "We'll get back to you within 24 hours.",
        });
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <PageHeader
                title="Start a Project"
                description="Ready to transform your digital presence? Tell us about your vision."
            />

            <div className="container mx-auto px-6">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-8 rounded-lg shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium leading-none">
                                    Name
                                </label>
                                <Input id="name" placeholder="John Doe" required />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium leading-none">
                                    Email
                                </label>
                                <Input id="email" type="email" placeholder="john@example.com" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium leading-none">
                                Project Details
                            </label>
                            <Textarea
                                id="message"
                                placeholder="Tell us about your project requirements..."
                                className="min-h-[150px]"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
