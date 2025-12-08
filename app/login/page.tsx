"use client";

import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is installed as per package.json

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const result = await login(formData);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      // Redirect handled by server action or middleware,
      // but explicit refresh helps client router sync
      window.location.href = "/admin";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-card border border-border/50 text-card-foreground shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Admin Login</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form action={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2"
                placeholder="admin@devxtra.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-2"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
