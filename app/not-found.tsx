import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
            <h1 className="text-9xl font-bold tracking-tighter text-muted-foreground/20">404</h1>
            <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Page Not Found</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
                The page you are looking for does not exist or has been moved to another dimension.
            </p>
            <Button asChild size="lg">
                <Link href="/">Return Home</Link>
            </Button>
        </div>
    );
}
