"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Session, AVAILABLE_TOPICS } from "@/lib/types";
import { getActiveSession, getSessions } from "@/lib/session-store";
import { getQuestionsByTopic, getTopicQuestionCount } from "@/lib/questions";

const DONE_KEY = "interview-prep-done";

function getDoneIds(user: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(`${DONE_KEY}-${user}`) || "[]"));
  } catch {
    return new Set();
  }
}

interface DashboardContentProps {
  userName: string;
  userEmail: string;
}

export function DashboardContent({ userName, userEmail }: DashboardContentProps) {
  const [state, setState] = useState<{
    activeSession: Session | null;
    sessionsCount: number;
    doneIds: Set<string>;
    isLoading: boolean;
  }>({
    activeSession: null,
    sessionsCount: 0,
    doneIds: new Set(),
    isLoading: true,
  });

  useEffect(() => {
    // Client-only hydration from localStorage/session state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({
      activeSession: getActiveSession(userEmail),
      sessionsCount: getSessions(userEmail).length,
      doneIds: getDoneIds(userEmail),
      isLoading: false,
    });
  }, [userEmail]);

  if (state.isLoading) {
    return (
      <div className="ir-login-card-inner flex min-h-[420px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E8A140] border-t-transparent" />
      </div>
    );
  }

  if (!state.activeSession) {
    return (
      <div className="ir-login-card-inner">
        <p className="ir-login-card-label">Welcome back</p>
        <h2 className="ir-login-card-title">
          Build your next
          <br />
          <em>prep track</em>.
        </h2>
        <p className="ir-login-card-sub">
          Create one focused session for the interview you&apos;re preparing for.
        </p>

        <Link
          href="/session/new"
          className="relative mb-[10px] flex h-[52px] w-full items-center justify-center overflow-hidden rounded-[13px] border border-[#E8A140] bg-[#E8A140] px-[18px] text-[14px] font-medium tracking-[0.01em] text-[#0C0A00] shadow-[0_0_24px_rgba(232,161,64,0.25),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(232,161,64,0.35),0_8px_20px_rgba(0,0,0,0.35)]"
        >
          Create Your First Session
        </Link>

        <div className="ir-login-divider">
          <span className="ir-login-divider-line" />
          <span className="ir-login-divider-text">next</span>
          <span className="ir-login-divider-line" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            "Pick the topics you expect in your interview",
            "Track progress question by question",
            "Return to the same workspace every day",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--off)]"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="ir-login-note">
          No active session yet for {userName}. Create one and this dashboard will become your
          daily control room.
        </div>
      </div>
    );
  }

  let solved = 0;
  let total = 0;

  state.activeSession.topics.forEach((topicId) => {
    const topicQuestions = getQuestionsByTopic(topicId);
    total += topicQuestions.length || getTopicQuestionCount(topicId);
    solved += topicQuestions.filter((question) => state.doneIds.has(question.id)).length;
  });

  const progress = total > 0 ? Math.round((solved / total) * 100) : 0;
  const daysUntilTarget = state.activeSession.targetDate
    ? Math.ceil(
        (new Date(state.activeSession.targetDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="ir-login-card-inner">
      <p className="ir-login-card-label">Welcome back</p>
      <h2 className="ir-login-card-title">
        Keep your
        <br />
        <em>streak</em> alive.
      </h2>
      <p className="ir-login-card-sub">
        Your active session is ready. Review the numbers and jump back into practice.
      </p>

      <div className="mb-4 rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-3">
        <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
          Active session
        </div>
        <div className="text-base font-medium text-[var(--white)]">{state.activeSession.name}</div>
        <div className="mt-1 text-sm text-[var(--off)]">
          {state.activeSession.topics.length} topics • {solved}/{total} complete
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { value: `${progress}%`, label: "Progress" },
          { value: `${state.sessionsCount}`, label: "Sessions" },
          { value: `${solved}`, label: "Solved" },
          {
            value:
              daysUntilTarget === null ? "Open" : daysUntilTarget > 0 ? `${daysUntilTarget}d` : "Today",
            label: "Target",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-3"
          >
            <div className="font-editorial text-[28px] leading-none text-[#F5F0E8]">{item.value}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 h-[8px] overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#E8A140_0%,#C4832A_100%)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid gap-[10px] md:grid-cols-3">
        <Link
          href="/practice"
          className="relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-[13px] border border-[#E8A140] bg-[#E8A140] px-[18px] text-[14px] font-medium tracking-[0.01em] text-[#0C0A00] shadow-[0_0_24px_rgba(232,161,64,0.25),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(232,161,64,0.35),0_8px_20px_rgba(0,0,0,0.35)]"
        >
          Continue Practice
        </Link>

        <Link
          href="/session"
          className="flex h-[52px] w-full items-center justify-center rounded-[13px] border border-[#F5F0E8] bg-transparent px-[18px] text-[14px] font-medium tracking-[0.01em] text-[#F5F0E8] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[rgba(245,240,232,0.06)]"
        >
          Manage Sessions
        </Link>

        <Link
          href="/session/new"
          className="flex h-[52px] w-full items-center justify-center rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-[18px] text-[14px] font-medium tracking-[0.01em] text-[#F5F0E8] shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#2A2520]"
        >
          Create New Session
        </Link>
      </div>

      <div className="ir-login-note">
        {state.activeSession.topics
          .map((topicId) => AVAILABLE_TOPICS.find((topic) => topic.id === topicId)?.name)
          .filter(Boolean)
          .join(" • ")}
      </div>
    </div>
  );
}
