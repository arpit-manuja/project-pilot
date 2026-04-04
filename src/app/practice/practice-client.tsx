"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { Question, Difficulty } from "@/lib/questions";
import { AVAILABLE_TOPICS, TopicId } from "@/lib/types";
import { getActiveSession } from "@/lib/session-store";
import { CodeIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const DONE_KEY = "interview-prep-done";

function getDoneIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(DONE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function toggleDone(id: string): Set<string> {
  const done = getDoneIds();
  if (done.has(id)) { done.delete(id); } else { done.add(id); }
  localStorage.setItem(DONE_KEY, JSON.stringify([...done]));
  return new Set(done);
}

const difficultyColors: Record<Difficulty, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function PracticePage({ allQuestions }: { allQuestions: Question[] }) {
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [activeTopic, setActiveTopic] = useState<TopicId | "all">("all");
  const [activeDiff, setActiveDiff] = useState<Difficulty | "all">("all");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [sessionTopics, setSessionTopics] = useState<TopicId[]>([]);
  const [selected, setSelected] = useState<Question | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Run only on client after hydration to avoid SSR mismatch
  useEffect(() => {
    const session = getActiveSession();
    setSessionTopics(session ? session.topics : AVAILABLE_TOPICS.map((t) => t.id));
    setDoneIds(getDoneIds());
    setMounted(true);
  }, []);

  const questions = useMemo(
    () => allQuestions.filter((q) => sessionTopics.includes(q.topicId)),
    [allQuestions, sessionTopics]
  );

  const filtered = useMemo(() => {
    let result = questions;
    if (activeTopic !== "all") result = result.filter((q) => q.topicId === activeTopic);
    if (activeDiff !== "all") result = result.filter((q) => q.difficulty === activeDiff);
    if (hideCompleted) result = result.filter((q) => !doneIds.has(q.id));
    return result;
  }, [questions, activeTopic, activeDiff, hideCompleted, doneIds]);

  const handleToggleDone = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDoneIds(toggleDone(id));
  }, []);

  const topicsInSession = AVAILABLE_TOPICS.filter((t) => sessionTopics.includes(t.id));
  const totalDone = questions.filter((q) => doneIds.has(q.id)).length;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
              <CodeIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              InterviewReady
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              {totalDone}/{questions.length} completed
            </span>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 sticky top-20">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Topics</p>
            <button
              onClick={() => setActiveTopic("all")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${activeTopic === "all" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
            >
              All Topics
            </button>
            {topicsInSession.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${activeTopic === t.id ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
              >
                {t.name}
              </button>
            ))}

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-5">Difficulty</p>
            {(["all", "easy", "medium", "hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setActiveDiff(d)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 capitalize transition-colors ${activeDiff === d ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`}
              >
                {d === "all" ? "All" : d}
              </button>
            ))}

            <label className="flex items-center gap-2 mt-5 cursor-pointer">
              <input
                type="checkbox"
                checked={hideCompleted}
                onChange={(e) => setHideCompleted(e.target.checked)}
                className="accent-blue-600 w-4 h-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Hide completed</span>
            </label>
          </div>
        </aside>

        {/* Main: Question List + Detail */}
        <main className="flex-1 min-w-0">
          {/* Progress Bar */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 mb-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">Session Progress</span>
                <span className="text-gray-500">{totalDone}/{questions.length}</span>
              </div>
              <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${questions.length ? (totalDone / questions.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            <span className="text-lg font-bold text-blue-600">
              {questions.length ? Math.round((totalDone / questions.length) * 100) : 0}%
            </span>
          </div>

          {/* Mobile Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 lg:hidden">
            {(["all", ...topicsInSession.map((t) => t.id)] as (TopicId | "all")[]).map((tid) => {
              const label = tid === "all" ? "All" : AVAILABLE_TOPICS.find((t) => t.id === tid)?.name ?? tid;
              return (
                <button
                  key={tid}
                  onClick={() => setActiveTopic(tid)}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium transition-colors ${activeTopic === tid ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border"}`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {selected ? (
            /* ── Question Detail View ── */
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
                <button
                  onClick={() => { setSelected(null); setShowSolution(false); }}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to list
                </button>
                <button
                  onClick={(e) => handleToggleDone(selected.id, e)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${doneIds.has(selected.id) ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-green-100 hover:text-green-700"}`}
                >
                  {doneIds.has(selected.id) ? (
                    <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Completed</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Mark Done</>
                  )}
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${difficultyColors[selected.difficulty]}`}>
                    {selected.difficulty}
                  </span>
                  {selected.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">{selected.title}</h2>

                <div className="prose dark:prose-invert max-w-none mb-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                </div>

                {selected.hint && (
                  <details className="mb-6 group">
                    <summary className="cursor-pointer flex items-center gap-2 text-blue-600 font-medium select-none">
                      <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Show Hint
                    </summary>
                    <div className="mt-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm">
                      {selected.hint}
                    </div>
                  </details>
                )}

                <div>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    {showSolution ? "Hide Solution" : "View Solution"}
                    <svg className={`w-4 h-4 transition-transform ${showSolution ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showSolution && (
                    <div className="mt-4 p-5 rounded-xl bg-gray-900 text-gray-100 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                      {selected.solution}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* ── Question List ── */
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center text-gray-500">
                    No questions match your filters.
                  </CardContent>
                </Card>
              ) : (
                filtered.map((q, i) => {
                  const done = doneIds.has(q.id);
                  const topic = AVAILABLE_TOPICS.find((t) => t.id === q.topicId);
                  return (
                    <div
                      key={q.id}
                      onClick={() => { setSelected(q); setShowSolution(false); }}
                      className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md border transition-all cursor-pointer flex items-center gap-4 p-4 ${done ? "border-green-200 dark:border-green-800/50" : "border-transparent hover:border-blue-200 dark:hover:border-blue-800"}`}
                    >
                      {/* Number */}
                      <span className="w-7 text-center text-sm font-mono text-gray-400">{i + 1}</span>

                      {/* Done checkbox */}
                      <button
                        onClick={(e) => handleToggleDone(q.id, e)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${done ? "border-green-500 bg-green-500" : "border-gray-300 dark:border-gray-600 hover:border-green-400"}`}
                      >
                        {done && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* Title + topic */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${done ? "line-through text-gray-400" : "text-gray-900 dark:text-white"}`}>
                          {q.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{topic?.name}</p>
                      </div>

                      {/* Difficulty badge */}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize hidden sm:block ${difficultyColors[q.difficulty]}`}>
                        {q.difficulty}
                      </span>

                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
