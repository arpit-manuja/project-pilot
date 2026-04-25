"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CodeIcon } from "@/components/icons";
import { useSession } from "next-auth/react";
import { AVAILABLE_TOPICS, TopicId } from "@/lib/types";
import { createSession } from "@/lib/session-store";

const topicIcons: Record<string, React.ReactNode> = {
  code: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  cpu: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M13 7h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2z" />
    </svg>
  ),
  server: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
    </svg>
  ),
  users: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  layout: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  database: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
  ),
  table: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  monitor: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  globe: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const PRESETS = [
  {
    name: "Fresher / Entry Level",
    description: "DSA + CS Fundamentals + Behavioral",
    topics: ["dsa", "cs-fundamentals", "behavioral"] as TopicId[],
  },
  {
    name: "Frontend Developer",
    description: "Frontend + DSA + Behavioral",
    topics: ["frontend", "dsa", "behavioral"] as TopicId[],
  },
  {
    name: "Backend Developer",
    description: "Backend + System Design + Database + DSA",
    topics: ["backend", "system-design", "database", "dsa"] as TopicId[],
  },
  {
    name: "Full Stack Developer",
    description: "Frontend + Backend + Database + DSA",
    topics: ["frontend", "backend", "database", "dsa", "behavioral"] as TopicId[],
  },
  {
    name: "FAANG Preparation",
    description: "DSA + System Design + Behavioral + Fundamentals",
    topics: ["dsa", "system-design", "behavioral", "cs-fundamentals"] as TopicId[],
  },
];

function amberButtonClass(disabled?: boolean) {
  return `relative flex h-[52px] items-center justify-center overflow-hidden rounded-[13px] border px-[18px] text-[14px] font-medium tracking-[0.01em] transition-all duration-150 ${
    disabled
      ? "cursor-not-allowed border-[#8a6a36] bg-[#8a6a36] text-[#1a1205] opacity-50"
      : "border-[#E8A140] bg-[#E8A140] text-[#0C0A00] shadow-[0_0_24px_rgba(232,161,64,0.25),0_4px_12px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:border-[#C4832A] hover:bg-[#C4832A] hover:shadow-[0_0_36px_rgba(232,161,64,0.35),0_8px_20px_rgba(0,0,0,0.35)]"
  }`;
}

export default function NewSessionPage() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const userEmail = sessionData?.user?.email || "guest";
  
  const formTopRef = useRef<HTMLDivElement | null>(null);
  const sessionNameInputRef = useRef<HTMLInputElement | null>(null);
  const [sessionName, setSessionName] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<TopicId[]>([]);
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState("");
  const hasSessionNameError = error.toLowerCase().includes("session name");

  const toggleTopic = (topicId: TopicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((topic) => topic !== topicId) : [...prev, topicId]
    );
  };

  const applyPreset = (topics: TopicId[]) => {
    setSelectedTopics(topics);
    setError("");
  };

  const isPresetSelected = (topics: TopicId[]) =>
    topics.length === selectedTopics.length &&
    topics.every((topic) => selectedTopics.includes(topic));

  const handleCreateSession = () => {
    if (!sessionName.trim()) {
      setError("Please enter a session name to create your session");
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        sessionNameInputRef.current?.focus();
      }, 250);
      return;
    }

    if (selectedTopics.length === 0) {
      setError("Please select at least one topic");
      return;
    }

    createSession(
      sessionName.trim(),
      selectedTopics,
      targetDate ? targetDate : undefined,
      userEmail
    );

    router.push("/dashboard");
  };

  const totalQuestions = selectedTopics.reduce((sum, topicId) => {
    const topic = AVAILABLE_TOPICS.find((entry) => entry.id === topicId);
    return sum + (topic?.totalQuestions || 0);
  }, 0);

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

          <div className="ir-login-nav-badge">
            <div className="ir-login-pulse" />
            100% Free Forever
          </div>
        </header>

        <main className="ir-login-center px-6">
          <div className="w-full max-w-[860px]">
            <section className="mb-7 text-center">
              <div className="ir-login-copy-tag">
                <div className="ir-login-copy-tag-square" />
                Session Planner
              </div>
              <h1 className="ir-login-copy-title">
                Create your next <em>prep session.</em>
              </h1>
              <p className="mx-auto mt-5 max-w-[560px] text-[15px] leading-8 text-[var(--off)]">
                Pick the interview track you&apos;re preparing for, choose the topics that matter,
                and keep everything inside one focused workspace.
              </p>
            </section>

            <section className="ir-login-card">
              <div className="ir-login-card-bar" />
              <div className="ir-login-card-inner">
                <div ref={formTopRef} />
                <p className="ir-login-card-label">Session setup</p>
                <h2 className="ir-login-card-title">
                  Build a plan with
                  <br />
                  <em>clear focus</em>.
                </h2>
                <p className="ir-login-card-sub">
                  This page uses the same visual language as login, but keeps the workflow in a
                  single, centered column.
                </p>

                {error ? (
                  <div className="mb-4 rounded-[13px] border border-[rgba(194,84,84,0.28)] bg-[rgba(115,30,30,0.22)] px-4 py-3 text-sm text-[#f0b0a7]">
                    {error}
                  </div>
                ) : null}

                <div className="grid gap-4">
                  <div>
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                      Session Name
                    </label>
                    <input
                      ref={sessionNameInputRef}
                      type="text"
                      value={sessionName}
                      onChange={(event) => {
                        setSessionName(event.target.value);
                        setError("");
                      }}
                      placeholder="e.g., Google Interview Prep"
                      aria-invalid={hasSessionNameError}
                      className={`w-full rounded-[13px] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--white)] outline-none transition-all placeholder:text-[var(--muted)] ${
                        hasSessionNameError
                          ? "border border-[#d28d84] ring-2 ring-[rgba(210,141,132,0.18)]"
                          : "border border-[var(--card-border)]"
                      } focus:border-[#E8A140] focus:ring-2 focus:ring-[rgba(232,161,64,0.18)]`}
                    />
                    {hasSessionNameError ? (
                      <p className="mt-2 text-xs text-[#f0b0a7]">
                        Session name is required before you can create the session.
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                      Target Interview Date
                    </label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(event) => setTargetDate(event.target.value)}
                      className="w-full rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--white)] outline-none transition-all focus:border-[#E8A140] focus:ring-2 focus:ring-[rgba(232,161,64,0.18)]"
                    />
                  </div>
                </div>

                <div className="ir-login-divider">
                  <span className="ir-login-divider-line" />
                  <span className="ir-login-divider-text">quick presets</span>
                  <span className="ir-login-divider-line" />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {PRESETS.map((preset) => {
                    const selected = isPresetSelected(preset.topics);

                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => applyPreset(preset.topics)}
                        className={`rounded-[13px] border px-4 py-4 text-left transition-all ${
                          selected
                            ? "border-[#E8A140] bg-[rgba(232,161,64,0.1)] shadow-[0_0_24px_rgba(232,161,64,0.08)]"
                            : "border-[var(--card-border)] bg-[var(--bg3)] hover:border-[#5d4420] hover:bg-[#2A2520]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-[var(--white)]">{preset.name}</div>
                            <div className="mt-1 text-xs leading-6 text-[var(--muted)]">
                              {preset.description}
                            </div>
                          </div>
                          {selected ? (
                            <span className="rounded-full border border-[rgba(232,161,64,0.28)] bg-[rgba(232,161,64,0.12)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E8A140]">
                              Selected
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="ir-login-divider">
                  <span className="ir-login-divider-line" />
                  <span className="ir-login-divider-text">topics</span>
                  <span className="ir-login-divider-line" />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {AVAILABLE_TOPICS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic.id);

                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => toggleTopic(topic.id)}
                        className={`rounded-[13px] border px-4 py-4 text-left transition-all ${
                          isSelected
                            ? "border-[#E8A140] bg-[rgba(232,161,64,0.1)] shadow-[0_0_24px_rgba(232,161,64,0.08)]"
                            : "border-[var(--card-border)] bg-[var(--bg3)] hover:border-[#5d4420] hover:bg-[#2A2520]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[11px] bg-[rgba(232,161,64,0.12)] text-[#E8A140]">
                            {topicIcons[topic.icon]}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="text-sm font-medium text-[var(--white)]">{topic.name}</div>
                              {isSelected ? (
                                <span className="mt-0.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#E8A140]">
                                  On
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-1 text-xs leading-6 text-[var(--muted)]">
                              {topic.description}
                            </div>
                            <div className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[var(--off)]">
                              {topic.totalQuestions} questions
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="ir-login-divider">
                  <span className="ir-login-divider-line" />
                  <span className="ir-login-divider-text">summary</span>
                  <span className="ir-login-divider-line" />
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-3">
                    <div className="font-editorial text-[28px] leading-none text-[#F5F0E8]">
                      {selectedTopics.length}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                      Topics Selected
                    </div>
                  </div>
                  <div className="rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-3">
                    <div className="font-editorial text-[28px] leading-none text-[#F5F0E8]">
                      {totalQuestions}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                      Total Questions
                    </div>
                  </div>
                </div>

                <div className="grid gap-[10px]">
                  <button
                    type="button"
                    onClick={handleCreateSession}
                    className={amberButtonClass(false)}
                  >
                    Create Session
                  </button>

                  <Link
                    href="/dashboard"
                    className="flex h-[52px] w-full items-center justify-center rounded-[13px] border border-[#F5F0E8] bg-transparent px-[18px] text-[14px] font-medium tracking-[0.01em] text-[#F5F0E8] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[rgba(245,240,232,0.06)]"
                  >
                    Cancel
                  </Link>
                </div>

                <div className="ir-login-note">
                  Your session will open in the same dashboard workspace once it&apos;s created.
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
