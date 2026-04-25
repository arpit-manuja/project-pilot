"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CodeIcon } from "@/components/icons";
import { LogoutButton } from "@/components/auth/logout-button";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Question, Difficulty } from "@/lib/questions";
import { AVAILABLE_TOPICS, TopicId } from "@/lib/types";
import { getActiveSession } from "@/lib/session-store";

const DONE_KEY = "interview-prep-done";

function getDoneIds(user: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(`${DONE_KEY}-${user}`) || "[]"));
  } catch {
    return new Set();
  }
}

function toggleDone(id: string, user: string): Set<string> {
  const done = getDoneIds(user);
  if (done.has(id)) {
    done.delete(id);
  } else {
    done.add(id);
  }
  localStorage.setItem(`${DONE_KEY}-${user}`, JSON.stringify([...done]));
  return new Set(done);
}

const difficultyTone: Record<Difficulty, string> = {
  easy: "border-[rgba(61,191,130,0.25)] bg-[rgba(61,191,130,0.12)] text-[#7ED9A6]",
  medium: "border-[rgba(232,161,64,0.25)] bg-[rgba(232,161,64,0.12)] text-[#E8A140]",
  hard: "border-[rgba(210,90,90,0.25)] bg-[rgba(210,90,90,0.12)] text-[#F0A7A7]",
};

const baseFilterClass =
  "rounded-full border px-3 py-2 text-xs font-medium tracking-[0.04em] transition-all";

export default function PracticePage({ allQuestions, userEmail }: { allQuestions: Question[], userEmail: string }) {
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [activeTopic, setActiveTopic] = useState<TopicId | "all">("all");
  const [activeDiff, setActiveDiff] = useState<Difficulty | "all">("all");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [sessionTopics, setSessionTopics] = useState<TopicId[]>([]);
  const [selected, setSelected] = useState<Question | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const session = getActiveSession(userEmail);
    // Client-only hydration from localStorage/session state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionTopics(session ? session.topics : AVAILABLE_TOPICS.map((topic) => topic.id));
    setDoneIds(getDoneIds(userEmail));
    setMounted(true);
  }, [userEmail]);

  const questions = useMemo(
    () => allQuestions.filter((question) => sessionTopics.includes(question.topicId)),
    [allQuestions, sessionTopics]
  );

  const filtered = useMemo(() => {
    let result = questions;
    if (activeTopic !== "all") result = result.filter((question) => question.topicId === activeTopic);
    if (activeDiff !== "all") result = result.filter((question) => question.difficulty === activeDiff);
    if (hideCompleted) result = result.filter((question) => !doneIds.has(question.id));
    return result;
  }, [questions, activeTopic, activeDiff, hideCompleted, doneIds]);

  const topicsInSession = AVAILABLE_TOPICS.filter((topic) => sessionTopics.includes(topic.id));
  const totalDone = questions.filter((question) => doneIds.has(question.id)).length;
  const progress = questions.length ? Math.round((totalDone / questions.length) * 100) : 0;

  const handleToggleDone = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Check if we are marking it as done (it wasn't done before)
    const isNowDone = !doneIds.has(id);
    setDoneIds(toggleDone(id, userEmail));
    
    if (isNowDone) {
      // Side-cannon continuous celebration
      const duration = 1500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ["#3DBF82", "#7ED9A6", "#E8A140", "#ffffff"],
          ticks: 200
        });
        
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ["#3DBF82", "#7ED9A6", "#E8A140", "#ffffff"],
          ticks: 200
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
    }
  };

  const resetQuestionView = () => {
    setSelected(null);
    setShowSolution(false);
  };

  if (!mounted) {
    return (
      <div className="ir-login-page">
        <div className="ir-login-bg" />
        <div className="ir-login-grid" />
        <div className="ir-login-grain" />
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E8A140] border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="ir-login-page">
      <div className="ir-login-bg" />
      <div className="ir-login-grid" />
      <div className="ir-login-grain" />

      <div className="ir-login-shell">
        <header className="ir-login-nav">
          <Link href="/dashboard" className="ir-login-logo">
            <div className="ir-login-logo-icon">
              <CodeIcon className="h-[18px] w-[18px] text-[#0C0A00]" />
            </div>
            <span className="ir-login-logo-text">InterviewReady</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="ir-login-nav-badge">
              <div className="ir-login-pulse" />
              {totalDone}/{questions.length} completed
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="ir-login-center px-6">
          <div className="w-full max-w-[980px]">
            <section className="mb-7 text-center">
              <div className="ir-login-copy-tag">
                <div className="ir-login-copy-tag-square" />
                Practice Workspace
              </div>
              <h1 className="ir-login-copy-title">
                Practice with <em>steady focus.</em>
              </h1>
              <p className="mx-auto mt-5 max-w-[620px] text-[15px] leading-8 text-[var(--off)]">
                Review your active question set, filter by topic or difficulty, and keep every
                solved problem inside the same workspace.
              </p>
            </section>

            <section className="ir-login-card">
              <div className="ir-login-card-bar" />
              <div className="ir-login-card-inner">
                {selected ? (
                  <div className="w-full rounded-[18px] border border-[var(--card-border)] bg-[rgba(24,20,17,0.92)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--card-border)] px-5 py-4">
                      <button
                        type="button"
                        onClick={resetQuestionView}
                        className="flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[#F5F0E8]"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to list
                      </button>

                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={(event) => handleToggleDone(selected.id, event)}
                        className={`relative z-10 flex min-w-[124px] items-center justify-center overflow-hidden rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                          doneIds.has(selected.id)
                            ? "border-[#3DBF82] bg-[#3DBF82] text-[#0C0A00] shadow-[0_0_24px_rgba(61,191,130,0.3)]"
                            : "border-[var(--card-border)] bg-[var(--bg3)] text-[var(--off)] hover:border-[#E8A140] hover:text-[#E8A140]"
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          {doneIds.has(selected.id) ? (
                            <motion.div
                              key="done"
                              initial={{ opacity: 0, scale: 0.5, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.5, y: 10 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="flex items-center gap-1.5"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                              Completed
                              
                              {/* Expanding Shockwave Ripple */}
                              <motion.div
                                initial={{ scale: 1, opacity: 0.8 }}
                                animate={{ scale: 1.6, opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="absolute inset-0 rounded-full border-2 border-[#3DBF82] pointer-events-none"
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="mark"
                              initial={{ opacity: 0, scale: 0.5, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.5, y: -10 }}
                              transition={{ duration: 0.15 }}
                            >
                              Mark Done
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>

                    <div className="px-5 py-6">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${difficultyTone[selected.difficulty]}`}>
                          {selected.difficulty}
                        </span>
                        {selected.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-[var(--card-border)] bg-[var(--bg3)] px-2.5 py-1 text-xs text-[var(--off)]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h3 className="font-editorial text-[34px] leading-tight text-[#F5F0E8]">
                        {selected.title}
                      </h3>

                      <div className="mt-5 rounded-[16px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-4 text-[15px] leading-8 text-[var(--off)] whitespace-pre-wrap">
                        {selected.description}
                      </div>

                      {selected.hint ? (
                        <details className="mt-4 overflow-hidden rounded-[16px] border border-[var(--card-border)] bg-[var(--bg3)]">
                          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-[#E8A140]">
                            Show Hint
                          </summary>
                          <div className="border-t border-[var(--card-border)] px-4 py-4 text-sm leading-7 text-[var(--off)]">
                            {selected.hint}
                          </div>
                        </details>
                      ) : null}

                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setShowSolution((current) => !current)}
                          className="relative flex h-[48px] items-center justify-center overflow-hidden rounded-[13px] border border-[#E8A140] bg-[#E8A140] px-5 text-[14px] font-medium tracking-[0.01em] text-[#0C0A00] shadow-[0_0_24px_rgba(232,161,64,0.22),0_4px_12px_rgba(0,0,0,0.25)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(232,161,64,0.3),0_8px_20px_rgba(0,0,0,0.35)]"
                        >
                          {showSolution ? "Hide Solution" : "View Solution"}
                        </button>

                        {showSolution ? (
                          <div className="mt-4 overflow-x-auto rounded-[16px] border border-[rgba(232,161,64,0.18)] bg-[#15110e] px-4 py-4 font-mono text-sm leading-7 text-[#F5F0E8] whitespace-pre-wrap">
                            {selected.solution}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full shrink-0 md:w-[240px]">
                    <div className="mb-6">
                      <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                        Session Progress
                      </div>
                      <div className="mb-3 font-editorial text-[42px] leading-none text-[#F5F0E8]">
                        {progress}%
                      </div>
                      <div className="h-[8px] overflow-hidden rounded-full bg-[var(--border)]">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#E8A140_0%,#C4832A_100%)] transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-[13px] border border-[var(--card-border)] bg-[rgba(24,20,17,0.92)] px-4 py-3">
                        <div className="font-editorial text-[24px] leading-none text-[#F5F0E8]">
                          {questions.length}
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                          Total
                        </div>
                      </div>
                      <div className="rounded-[13px] border border-[var(--card-border)] bg-[rgba(24,20,17,0.92)] px-4 py-3">
                        <div className="font-editorial text-[24px] leading-none text-[#3DBF82]">
                          {totalDone}
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                          Done
                        </div>
                      </div>
                      <div className="col-span-2 rounded-[13px] border border-[var(--card-border)] bg-[rgba(24,20,17,0.92)] px-4 py-3 text-center">
                        <div className="font-editorial text-[24px] leading-none text-[#F5F0E8]">
                          {Math.max(questions.length - totalDone, 0)}
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                          Remaining
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">

                <div className="mb-5 grid gap-3 rounded-[18px] border border-[var(--card-border)] bg-[rgba(24,20,17,0.92)] p-4">
                  <div>
                    <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                      Topics
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTopic("all");
                          setSelected(null);
                        }}
                        className={`${baseFilterClass} ${
                          activeTopic === "all"
                            ? "border-[#E8A140] bg-[rgba(232,161,64,0.12)] text-[#E8A140]"
                            : "border-[var(--card-border)] bg-[var(--bg3)] text-[var(--off)] hover:border-[#5d4420] hover:bg-[#2A2520]"
                        }`}
                      >
                        All Topics
                      </button>
                      {topicsInSession.map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => {
                            setActiveTopic(topic.id);
                            setSelected(null);
                          }}
                          className={`${baseFilterClass} ${
                            activeTopic === topic.id
                              ? "border-[#E8A140] bg-[rgba(232,161,64,0.12)] text-[#E8A140]"
                              : "border-[var(--card-border)] bg-[var(--bg3)] text-[var(--off)] hover:border-[#5d4420] hover:bg-[#2A2520]"
                          }`}
                        >
                          {topic.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                      Difficulty
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["all", "easy", "medium", "hard"] as const).map((difficulty) => (
                        <button
                          key={difficulty}
                          type="button"
                          onClick={() => {
                            setActiveDiff(difficulty);
                            setSelected(null);
                          }}
                          className={`${baseFilterClass} capitalize ${
                            activeDiff === difficulty
                              ? "border-[#E8A140] bg-[rgba(232,161,64,0.12)] text-[#E8A140]"
                              : "border-[var(--card-border)] bg-[var(--bg3)] text-[var(--off)] hover:border-[#5d4420] hover:bg-[#2A2520]"
                          }`}
                        >
                          {difficulty}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="inline-flex w-fit items-center gap-3 rounded-full border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-2 text-sm text-[var(--off)]">
                    <input
                      type="checkbox"
                      checked={hideCompleted}
                      onChange={(event) => {
                        setHideCompleted(event.target.checked);
                        setSelected(null);
                      }}
                      className="h-4 w-4 accent-[#E8A140]"
                    />
                    Hide completed questions
                  </label>
                </div>

                <div className="mb-5 grid gap-[10px] md:grid-cols-3">
                  <Link
                    href="/dashboard"
                    className="flex h-[52px] w-full items-center justify-center rounded-[13px] border border-[#F5F0E8] bg-transparent px-[18px] text-[14px] font-medium tracking-[0.01em] text-[#F5F0E8] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[rgba(245,240,232,0.06)]"
                  >
                    Back to Dashboard
                  </Link>
                  <Link
                    href="/session"
                    className="flex h-[52px] w-full items-center justify-center rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-[18px] text-[14px] font-medium tracking-[0.01em] text-[#F5F0E8] shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#2A2520]"
                  >
                    Manage Sessions
                  </Link>
                  <Link
                    href="/session/new"
                    className="relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-[13px] border border-[#E8A140] bg-[#E8A140] px-[18px] text-[14px] font-medium tracking-[0.01em] text-[#0C0A00] shadow-[0_0_24px_rgba(232,161,64,0.25),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(232,161,64,0.35),0_8px_20px_rgba(0,0,0,0.35)]"
                  >
                    Create New Session
                  </Link>
                </div>

                {filtered.length === 0 ? (
                  <div className="rounded-[18px] border border-[var(--card-border)] bg-[rgba(24,20,17,0.92)] px-5 py-16 text-center text-[15px] text-[var(--muted)]">
                    No questions match your current filters.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((question, index) => {
                      const done = doneIds.has(question.id);
                      const topic = AVAILABLE_TOPICS.find((entry) => entry.id === question.topicId);

                      return (
                        <div
                          key={question.id}
                          onClick={() => {
                            setSelected(question);
                            setShowSolution(false);
                          }}
                          className={`flex w-full items-center gap-4 rounded-[16px] border px-4 py-4 text-left transition-all ${
                            done
                              ? "border-[rgba(61,191,130,0.2)] bg-[rgba(61,191,130,0.08)]"
                              : "border-[var(--card-border)] bg-[rgba(24,20,17,0.92)] hover:border-[#5d4420] hover:bg-[#2A2520]"
                          }`}
                        >
                          <span className="w-7 flex-shrink-0 text-center font-mono text-sm text-[var(--muted)]">
                            {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={(event) => handleToggleDone(question.id, event)}
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                              done
                                ? "border-[#3DBF82] bg-[#3DBF82] text-[#08140d]"
                                : "border-[var(--muted)] bg-transparent text-transparent hover:border-[#3DBF82]"
                            }`}
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>

                          <div className="min-w-0 flex-1">
                            <div
                              className={`truncate text-[15px] font-medium ${
                                done ? "text-[rgba(245,240,232,0.58)] line-through" : "text-[#F5F0E8]"
                              }`}
                            >
                              {question.title}
                            </div>
                            <div className="mt-1 text-xs uppercase tracking-[0.08em] text-[var(--muted)]">
                              {topic?.name}
                            </div>
                          </div>

                          <span
                            className={`hidden rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] sm:block ${difficultyTone[question.difficulty]}`}
                          >
                            {question.difficulty}
                          </span>

                          <svg
                            className="h-4 w-4 flex-shrink-0 text-[var(--muted)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                )}

                  </div>
                </div>
                )}

                <div className="ir-login-note">
                  {topicsInSession.map((topic) => topic.name).join(" • ")}
                </div>
              </div>
            </section>
          </div>
        </main>

        <footer className="ir-login-footer">
          <span className="ir-login-footer-copy">© 2026 InterviewReady</span>
          <div className="ir-login-footer-links">
            <Link href="/" className="ir-login-footer-link">
              Privacy
            </Link>
            <Link href="/" className="ir-login-footer-link">
              Terms
            </Link>
            <Link href="/" className="ir-login-footer-link">
              Support
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
