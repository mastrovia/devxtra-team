"use client";

import { useState, useEffect } from "react";
import {
  inviteAdmin,
  listAdmins,
  deleteAdmin,
  toggleBanAdmin,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Loader2,
  Trash2,
  Ban,
  CheckCircle,
  UserPlus,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";

type AdminUser = {
  id: string;
  email: string | undefined;
  last_sign_in_at: string | undefined;
  created_at: string;
  banned_until: string | undefined;
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isDirectAdd, setIsDirectAdd] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    setCurrentUserId(data.user?.id || null);
  };

  const fetchAdmins = async () => {
    const data = await listAdmins();
    setAdmins(data as any); // Cast for simplicity due to Supabase type variations
  };

  const handleInvite = async (formData: FormData) => {
    setLoading(true);
    setTempPassword(null);

    // Append the switch state to formData manually if not standard form submission behavior
    formData.set("directAdd", isDirectAdd ? "on" : "off");

    const result = await inviteAdmin(formData);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      if (result.tempPassword) {
        setTempPassword(result.tempPassword);
        toast.success("User created! Copy the temporary password.");
      } else {
        toast.success("Invitation sent successfully!");
      }
      fetchAdmins(); // Refresh list
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY remove this admin?"))
      return;
    const res = await deleteAdmin(id);
    if (res?.error) toast.error(res.error);
    else {
      toast.success("Admin removed.");
      fetchAdmins();
    }
  };

  const handleToggleBan = async (id: string, isCurrentlyBanned: boolean) => {
    const res = await toggleBanAdmin(id, !isCurrentlyBanned); // Toggle
    if (res?.error) toast.error(res.error);
    else {
      toast.success(isCurrentlyBanned ? "Admin enabled." : "Admin disabled.");
      fetchAdmins();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage admin access and global configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invite / Add Form */}
        <div className="border border-border bg-card p-6 rounded-none">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Admin
          </h3>

          <form action={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                name="email"
                type="email"
                placeholder="colleague@devxtra.com"
                required
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label
                htmlFor="direct-mode"
                className="flex flex-col gap-1 cursor-pointer"
              >
                <span>Direct Add Mode</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Skip email, create manually
                </span>
              </Label>
              <Switch
                id="direct-mode"
                checked={isDirectAdd}
                onCheckedChange={setIsDirectAdd}
              />
            </div>

            {tempPassword && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-none flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-semibold text-green-700">Temp Password:</p>
                  <code className="text-foreground">{tempPassword}</code>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(tempPassword)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : isDirectAdd ? (
                "Create User"
              ) : (
                "Send Invite"
              )}
            </Button>
          </form>
        </div>

        {/* Info Card / Instructions */}
        <div className="border border-border bg-secondary/20 p-6 rounded-none flex flex-col justify-center">
          <h4 className="font-semibold mb-2">Access Management</h4>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
            <li>
              <strong>Invites:</strong> Sends an email with a magic link to set
              up their password.
            </li>
            <li>
              <strong>Direct Add:</strong> Generates a user immediately. You
              must share the credentials manually.
            </li>
            <li>
              <strong>Disable:</strong> Temporarily blocks access without
              deleting history.
            </li>
          </ul>
        </div>
      </div>

      {/* Admins List */}
      <div className="border border-border bg-card rounded-none overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-semibold">Team Members</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-5">Email</TableHead>
              <TableHead className="p-5">Status</TableHead>
              <TableHead className="p-5">Last Login</TableHead>
              <TableHead className="p-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => {
              const isBanned =
                !!admin.banned_until && admin.banned_until !== "none";
              const isMe = currentUserId === admin.id;

              return (
                <TableRow key={admin.id}>
                  <TableCell className="p-5 font-medium">
                    {admin.email}
                    {isMe && (
                      <Badge variant="secondary" className="ml-2 text-[10px]">
                        YOU
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="p-5">
                    {isBanned ? (
                      <Badge variant="destructive">Disabled</Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200 bg-green-50"
                      >
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="p-5 text-muted-foreground text-xs">
                    {admin.last_sign_in_at
                      ? new Date(admin.last_sign_in_at).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell className="p-5 text-right space-x-2">
                    {!isMe && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          title={isBanned ? "Enable Access" : "Disable Access"}
                          onClick={() => handleToggleBan(admin.id, isBanned)}
                        >
                          {isBanned ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Ban className="h-4 w-4 text-orange-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemove(admin.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
