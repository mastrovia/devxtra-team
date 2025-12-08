"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Code,
  Database,
  Layout,
  Terminal,
  Shield,
  Cpu,
} from "lucide-react";
import { testimonials } from "@/lib/data";
import DeveloperCard from "@/components/DeveloperCard";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLandingStats, getPublicTeam } from "./actions";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const container = useRef(null);
  const [stats, setStats] = useState({ experts: 0, shipped: 0 });
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [statsData, teamData] = await Promise.all([
        getLandingStats(),
        getPublicTeam(),
      ]);
      setStats(statsData);
      setTeam(teamData);
    };
    loadData();
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".hero-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
      });

      gsap.utils.toArray(".reveal-section").forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      });
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="flex flex-col min-h-screen overflow-hidden bg-background"
    >
      {/* Hero Section - Swiss Style Grid */}
      <section className="relative flex flex-col justify-center px-6 pt-40 pb-32 min-h-[80vh] container mx-auto border-x border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <h1 className="hero-text text-6xl md:text-9xl font-bold tracking-tighter mb-8 text-foreground leading-none">
              Digital
              <br />
              Excellence.
            </h1>
            <p className="hero-text text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed font-light">
              DevXtra is an elite collective of engineers, creators, and
              founders in the making. We build what the future needs
            </p>
            <div className="hero-text flex flex-wrap gap-6">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-lg rounded-none bg-foreground text-background hover:bg-foreground/90"
              >
                <Link href="/contact">Start a Project</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg rounded-none border-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                <Link href="/works">View Case Studies</Link>
              </Button>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end items-start border-l border-border/50 pl-8">
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">
              Current Status
            </p>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-bold">Accepting New Clients</span>
            </div>
            <div className="space-y-4 w-full">
              <div className="border-t border-border pt-4">
                <p className="text-3xl font-bold">{stats.experts}+</p>
                <p className="text-sm text-muted-foreground">Experts</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-3xl font-bold">{stats.shipped}+</p>
                <p className="text-sm text-muted-foreground">
                  Projects Shipped
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By / Logos */}
      <section className="py-16 border-y border-border bg-card">
        <div className="container mx-auto px-6">
          <p className="text-left text-sm font-mono text-muted-foreground mb-8 uppercase tracking-widest">
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap justify-start items-center gap-12 md:gap-24 grayscale opacity-70 hover:opacity-100 transition-opacity">
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              ACME Corp
            </h3>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              GlobalBank
            </h3>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              Nebula AI
            </h3>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              Vertex
            </h3>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              Stratos
            </h3>
          </div>
        </div>
      </section>

      {/* Principles Grid */}
      <section className="py-32 px-6 reveal-section container mx-auto border-x border-border/50">
        <div className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight max-w-xl">
            Core Architecture
          </h2>
          <p className="text-xl text-muted-foreground max-w-sm mt-8 md:mt-0">
            We don't just write code. We engineer robust, scalable ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
          {[
            {
              icon: Layout,
              title: "Immersive UI/UX",
              desc: "Interfaces that respond naturally to human intent.",
            },
            {
              icon: Code,
              title: "Modern Frontend",
              desc: "Built on Next.js for speed and SEO dominance.",
            },
            {
              icon: Database,
              title: "Scalable Backend",
              desc: "Distributed systems that handle millions of requests.",
            },
            {
              icon: Terminal,
              title: "DevOps & Cloud",
              desc: "Automated pipelines and serverless infrastructure.",
            },
            {
              icon: Cpu,
              title: "AI Integration",
              desc: "LLMs and predictive models embedded in your workflow.",
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              desc: "Bank-grade encryption and compliance standards.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group p-12 bg-background hover:bg-muted/30 transition-colors duration-300"
            >
              <div className="mb-6 text-foreground group-hover:scale-110 transition-transform origin-left">
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-secondary/30 reveal-section border-y border-border">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16">
            Client Perspectives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-10 bg-background border border-border relative shadow-sm"
              >
                <p className="text-lg text-foreground mb-8 relative z-10 font-light leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="border-t border-border pt-6 mt-6">
                  <h4 className="font-bold text-foreground text-lg">
                    {t.client}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-32 px-6 reveal-section container mx-auto border-x border-border/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-border pb-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            The Collective
          </h2>
          <Button
            variant="link"
            asChild
            className="hidden md:flex text-lg p-0 h-auto font-semibold"
          >
            <Link href="/team" className="group flex items-center gap-2">
              Meet the Team{" "}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.length > 0 ? (
            team.slice(0, 3).map((dev) => (
              <div key={dev.id} className="h-full">
                <DeveloperCard developer={dev} />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              Loading team data...
            </div>
          )}
        </div>

        <div className="mt-12 md:hidden">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full rounded-none"
          >
            <Link href="/team">View All Members</Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 text-center reveal-section bg-foreground text-background">
        <div className="container mx-auto">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tight mb-8">
            Ready to scale?
          </h2>
          <p className="text-xl md:text-2xl text-background/80 mb-12 max-w-2xl mx-auto font-light">
            Join the next generation of creators who trust DevXtra to build
            their future.
          </p>
          <Button
            size="lg"
            className="h-20 px-16 text-xl rounded-none bg-background text-foreground hover:bg-background/90 font-bold border-2 border-transparent hover:border-background transition-all"
          >
            <Link href="/contact">Initiate Collaboration</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
