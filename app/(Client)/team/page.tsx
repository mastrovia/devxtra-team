import DeveloperCard from "@/components/DeveloperCard";
import { developers } from "@/lib/data";
import PageHeader from "@/components/PageHeader";

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-background">
            <PageHeader
                title="Our Elite Squad"
                description="Meet the minds behind the code. Specialists in every domain, united by a passion for excellence."
            />

            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {developers.map((dev) => (
                        <div key={dev.id} className="h-full">
                            <DeveloperCard developer={dev} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
