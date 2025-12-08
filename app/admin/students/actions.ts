"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  enrollment_no: string | null;
  role: "Student" | "Team Lead" | "Member";
  status: "Active" | "Inactive" | "Alumni";
  joined_date: string;
  avatar: string | null;
};

export async function getStudents() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching students:", error);
    return [];
  }

  return data as Student[];
}

export async function createStudent(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;
  const enrollmentNo = formData.get("enrollmentNo") as string;

  const { data, error } = await supabase
    .from("students")
    .insert({
      name,
      email,
      phone,
      role,
      status,
      enrollment_no: enrollmentNo,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/students");
  return { success: true, data };
}

export async function updateStudent(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("students")
    .update({
      name,
      email,
      phone,
      role,
      status,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/students");
  return { success: true };
}

export async function deleteStudent(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/students");
  return { success: true };
}
