"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { noticeSchema, type NoticeInput } from "@/lib/validations/notice";

export async function getNotices() {
  const supabase = await createClient();

  // Handle cases where Supabase is not yet configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "your-supabase-url-here") {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("notices")
    .select(`
      *,
      profiles:author_id (
        full_name,
        avatar_url
      )
    `)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function createNotice(input: NoticeInput) {
  const supabase = await createClient();

  // Validate session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Validate input
  const validated = noticeSchema.parse(input);

  // Get user details to confirm role and college_id
  const { data: userData } = await supabase
    .from("users")
    .select("college_id, role")
    .eq("id", user.id)
    .single();

  if (!userData || !["teacher", "college_admin", "super_admin"].includes(userData.role)) {
    throw new Error("Insufficient permissions to post notices");
  }

  const { error } = await supabase.from("notices").insert({
    ...validated,
    college_id: userData.college_id,
    author_id: user.id,
  });

  if (error) throw error;

  revalidatePath("/notices");
  revalidatePath("/");
  return { success: true };
}
