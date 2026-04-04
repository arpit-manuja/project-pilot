/**
 * questions-db.ts
 *
 * Fetches questions from Supabase with a 1-hour ISR cache.
 * Falls back to the local QUESTIONS array if Supabase is not configured
 * or returns an error — so the app always works.
 */

import { createClient } from "./supabase/server";
import {
  QUESTIONS,
  Question,
  Difficulty,
  getQuestionsByTopic as localGetByTopic,
  getQuestionsByTopics as localGetByTopics,
  getTopicQuestionCount as localGetCount,
} from "./questions";
import type { TopicId } from "./types";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && !url.includes("your-project-id");
}

// Map DB row → Question shape used throughout the app
function rowToQuestion(row: {
  id: string;
  topic_id: string;
  title: string;
  description: string;
  hint: string | null;
  solution: string;
  difficulty: string;
  tags: string[];
}): Question {
  return {
    id: row.id,
    topicId: row.topic_id as TopicId,
    title: row.title,
    description: row.description,
    hint: row.hint ?? undefined,
    solution: row.solution,
    difficulty: row.difficulty as Difficulty,
    tags: row.tags,
  };
}

// ── Fetch all questions ────────────────────────────────────────────────────
export async function getAllQuestions(): Promise<Question[]> {
  if (!isSupabaseConfigured()) return QUESTIONS;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("topic_id")
      .order("difficulty");

    if (error || !data || data.length === 0) return QUESTIONS;
    return data.map(rowToQuestion);
  } catch {
    return QUESTIONS;
  }
}

// ── Fetch questions for a single topic ────────────────────────────────────
export async function getQuestionsByTopicFromDB(
  topicId: TopicId
): Promise<Question[]> {
  if (!isSupabaseConfigured()) return localGetByTopic(topicId);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("topic_id", topicId)
      .order("difficulty");

    if (error || !data || data.length === 0) return localGetByTopic(topicId);
    return data.map(rowToQuestion);
  } catch {
    return localGetByTopic(topicId);
  }
}

// ── Fetch questions for multiple topics ──────────────────────────────────
export async function getQuestionsByTopicsFromDB(
  topicIds: TopicId[]
): Promise<Question[]> {
  if (!isSupabaseConfigured()) return localGetByTopics(topicIds);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .in("topic_id", topicIds)
      .order("topic_id")
      .order("difficulty");

    if (error || !data || data.length === 0) return localGetByTopics(topicIds);
    return data.map(rowToQuestion);
  } catch {
    return localGetByTopics(topicIds);
  }
}

// ── Get question count for a topic ───────────────────────────────────────
export async function getTopicQuestionCountFromDB(
  topicId: TopicId
): Promise<number> {
  if (!isSupabaseConfigured()) return localGetCount(topicId);

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true })
      .eq("topic_id", topicId);

    if (error || count === null) return localGetCount(topicId);
    return count;
  } catch {
    return localGetCount(topicId);
  }
}

// ── Get a single question by ID ───────────────────────────────────────────
export async function getQuestionByIdFromDB(
  id: string
): Promise<Question | undefined> {
  if (!isSupabaseConfigured()) {
    return QUESTIONS.find((q) => q.id === id);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return QUESTIONS.find((q) => q.id === id);
    return rowToQuestion(data);
  } catch {
    return QUESTIONS.find((q) => q.id === id);
  }
}
