import { z } from "zod";

export const noticeSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(500, "Title is too long"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),
  priority: z.enum(["normal", "important", "urgent"]),
  is_pinned: z.boolean().default(false),
});

export type NoticeInput = z.infer<typeof noticeSchema>;
