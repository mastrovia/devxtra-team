"use server";

import { createClient } from "@/lib/supabase/server";

export async function inviteAdmin(formData: FormData) {
  const email = formData.get("email") as string;

  // We need the service role key to invite users without sending them a magic link that logs *us* in,
  // or generally to manage users. However, "inviteUserByEmail" sends an invite email.
  // Standard `supabase.auth.admin.inviteUserByEmail` requires the service_role key.

  const supabase = await createClient(true); // true = use service role

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Invitation sent successfully." };
}
