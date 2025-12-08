"use server";

import { createClient } from "@/lib/supabase/server";

export async function inviteAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const isDirectAdd = formData.get("directAdd") === "on";

  const supabase = await createClient(true); // true = use service role

  if (isDirectAdd) {
    // Direct Add: Create user with a temporary password (manual onboarding)
    const tempPassword = Math.random().toString(36).slice(-8) + "X1!";
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { role: "admin" },
    });

    if (error) {
      return { error: error.message };
    }

    return {
      success: true,
      message: `User created directly.`,
      tempPassword: tempPassword,
    };
  } else {
    // Standard Invite: Sends Supabase Invite Email
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);

    if (error) {
      return { error: error.message };
    }

    return { success: true, message: "Invitation email sent successfully." };
  }
}

export async function listAdmins() {
  const supabase = await createClient(true);
  // Fetch users (limitation: listUsers fetches at most 50 by default, pagination needed for large teams)
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  if (error || !users) return [];

  // Filter logic can be added here if needed, or simply return all users if all are admins
  return users.map((u) => ({
    id: u.id,
    email: u.email,
    last_sign_in_at: u.last_sign_in_at,
    created_at: u.created_at,
    banned_until: u.banned_until,
  }));
}

export async function deleteAdmin(userId: string) {
  const supabase = await createClient(true);
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function toggleBanAdmin(userId: string, isBanned: boolean) {
  const supabase = await createClient(true);
  const banDuration = isBanned ? "876000h" : "0s"; // 100 years or 0 seconds (unban) if undefined doesn't work well, but `ban_duration` is technically specific.
  // Actually, deleteUser is 'soft delete' usually? No.
  // To ban, we update user:

  // Supabase admin.updateUserById allows 'ban_duration'
  // but the JS SDK exposes it slightly differently depending on version.
  // The safest "Disable" is often setting `ban_duration` to a very long time.
  // If we want to unban, we set it to 'none' or 0? Documentation says: "a ban duration of 'none' removes the ban".

  // Let's rely on delete for removal as requested by user ("remove non current user").
  // For "disable", using ban logic:

  /* 
       Note: Supabase API for "active" status via updateUser attributes is limited.
       Banning is the standard way to disable access.
    */

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: isBanned ? "876600h" : "none",
  });

  if (error) return { error: error.message };
  return { success: true };
}
