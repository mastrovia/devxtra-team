"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadAvatar(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" };
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File size must be less than 5MB" };
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()
    .toString(36)
    .substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  // Get public URL
  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return { url: data.publicUrl };
}

export async function uploadProjectImage(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" };
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File size must be less than 5MB" };
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()
    .toString(36)
    .substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `project-images/${fileName}`;

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  // Get public URL
  const { data } = supabase.storage
    .from("project-images")
    .getPublicUrl(filePath);

  return { url: data.publicUrl };
}

export async function deleteAvatar(url: string): Promise<{ error?: string }> {
  const supabase = await createClient();

  // Extract file path from URL
  const path = url.split("/storage/v1/object/public/avatars/")[1];

  if (!path) {
    return { error: "Invalid URL" };
  }

  const { error } = await supabase.storage
    .from("avatars")
    .remove([`avatars/${path}`]);

  if (error) {
    return { error: error.message };
  }

  return {};
}

export async function deleteProjectImage(
  url: string
): Promise<{ error?: string }> {
  const supabase = await createClient();

  // Extract file path from URL
  const path = url.split("/storage/v1/object/public/project-images/")[1];

  if (!path) {
    return { error: "Invalid URL" };
  }

  const { error } = await supabase.storage
    .from("project-images")
    .remove([`project-images/${path}`]);

  if (error) {
    return { error: error.message };
  }

  return {};
}
