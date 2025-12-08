"use client";

import { useState } from "react";
import { inviteAdmin } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, MailPlus } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleInvite = async (formData: FormData) => {
    setLoading(true);
    const result = await inviteAdmin(formData);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Invitation sent successfully!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage admin access and global configurations.
        </p>
      </div>

      <div className="border border-border bg-card p-6 rounded-md">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MailPlus className="h-5 w-5" />
          Invite New Admin
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Send an email invitation to a new team member. They will receive a
          link to set their password.
        </p>

        <form action={handleInvite} className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium leading-none">
              Email Address
            </label>
            <Input
              name="email"
              type="email"
              placeholder="colleague@devxtra.com"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Send Invite"
            )}
          </Button>
        </form>
      </div>

      <div className="border border-border bg-card p-6 rounded-md opacity-50 cursor-not-allowed">
        <h3 className="text-xl font-semibold mb-2">Global Site Metadata</h3>
        <p className="text-sm text-muted-foreground">Coming soon...</p>
      </div>
    </div>
  );
}
