/**
 * Supabase sync utilities
 *
 * These functions mirror localStorage data to Supabase so progress
 * is preserved across devices. They are safe to call even before
 * Supabase credentials are configured — they no-op if env vars are missing.
 */

import { createClient } from "./client";
import { getSessions, getActiveSessionId } from "@/lib/session-store";
import type { TopicId } from "@/lib/types";

const DONE_KEY = "interview-prep-done";

function getDoneIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(DONE_KEY) || "[]");
  } catch {
    return [];
  }
}

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && !url.includes("your-project-id");
}

// ── Upsert user after login ────────────────────────────────────────────────
export async function syncUser(user: {
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
  providerId: string;
}) {
  if (!isConfigured()) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  await supabase.from("users").upsert(
    {
      email: user.email,
      name: user.name,
      image: user.image,
      provider: user.provider,
      provider_id: user.providerId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "provider,provider_id" }
  );
}

// ── Push all localStorage sessions to Supabase ────────────────────────────
export async function syncSessionsToSupabase(userId: string) {
  if (!isConfigured()) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const sessions = getSessions();
  const activeId = getActiveSessionId();

  for (const session of sessions) {
    await supabase.from("sessions").upsert(
      {
        id: session.id,
        user_id: userId,
        name: session.name,
        topics: session.topics as string[],
        target_date: session.targetDate ?? null,
        is_active: session.id === activeId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  }
}

// ── Push localStorage completed questions to Supabase ─────────────────────
export async function syncProgressToSupabase(
  userId: string,
  sessionId: string,
  questionTopicMap: Record<string, TopicId>
) {
  if (!isConfigured()) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;
  const doneIds = getDoneIds();

  const rows = doneIds.map((qId) => ({
    user_id: userId,
    session_id: sessionId,
    question_id: qId,
    topic_id: questionTopicMap[qId] ?? "dsa",
    status: "done" as const,
    completed_at: new Date().toISOString(),
  }));

  if (rows.length === 0) return;

  await supabase
    .from("question_progress")
    .upsert(rows, { onConflict: "user_id,session_id,question_id" });
}

// ── Fetch progress from Supabase and write to localStorage ───────────────
export async function pullProgressFromSupabase(
  userId: string,
  sessionId: string
): Promise<void> {
  if (!isConfigured()) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any;

  const { data } = await supabase
    .from("question_progress")
    .select("question_id")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .eq("status", "done");

  if (!data) return;

  const ids = data.map((r: { question_id: string }) => r.question_id);
  localStorage.setItem(DONE_KEY, JSON.stringify(ids));
}
