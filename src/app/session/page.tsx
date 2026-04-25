"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CodeIcon } from "@/components/icons";
import { useSession } from "next-auth/react";
import { Session, AVAILABLE_TOPICS } from "@/lib/types";
import { getSessions, setActiveSession, deleteSession, getActiveSessionId, markSessionCompleted } from "@/lib/session-store";

export default function SessionsPage() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const userEmail = sessionData?.user?.email || "guest";
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Modal states
  const [completeModalSessionId, setCompleteModalSessionId] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<"ask" | "feedback">("ask");
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    if (status !== "loading") {
      setSessions(getSessions(userEmail));
      setActiveId(getActiveSessionId(userEmail));
    }
  }, [status, userEmail]);

  const handleSelectSession = (sessionId: string) => {
    setActiveSession(sessionId, userEmail);
    router.push("/dashboard");
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this session?")) {
      deleteSession(sessionId, userEmail);
      setSessions(getSessions(userEmail));
      setActiveId(getActiveSessionId(userEmail));
    }
  };

  const handleOpenCompleteModal = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompleteModalSessionId(sessionId);
    setModalStep("ask");
    setRating(0);
    setReview("");
  };

  const handleConfirmWrapUp = () => {
    if (completeModalSessionId) {
      markSessionCompleted(completeModalSessionId, undefined, userEmail);
      setSessions(getSessions(userEmail));
      setActiveId(getActiveSessionId(userEmail));
      setCompleteModalSessionId(null);
    }
  };

  const handleSubmitFeedback = () => {
    if (completeModalSessionId) {
      markSessionCompleted(completeModalSessionId, { rating, review }, userEmail);
      setSessions(getSessions(userEmail));
      setActiveId(getActiveSessionId(userEmail));
      setCompleteModalSessionId(null);
    }
  };

  const getTopicNames = (session: Session) => {
    return session.topics
      .map((topicId) => AVAILABLE_TOPICS.find((t) => t.id === topicId)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const getTotalProgress = (session: Session) => {
    let solved = 0;
    let total = 0;
    session.topics.forEach((topicId) => {
      const topic = AVAILABLE_TOPICS.find((t) => t.id === topicId);
      if (topic) {
        total += topic.totalQuestions;
        solved += session.progress[topicId]?.solved || 0;
      }
    });
    return { solved, total, percentage: total > 0 ? Math.round((solved / total) * 100) : 0 };
  };

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

          <Link
            href="/dashboard"
            className="ir-login-nav-badge hover:bg-[rgba(245,240,232,0.1)] transition-colors cursor-pointer text-[#F5F0E8] no-underline"
          >
            Dashboard
          </Link>
        </header>

        <main className="ir-login-center px-6">
          <div className="w-full max-w-[860px]">
            <section className="mb-12 text-center flex flex-col items-center">
              <div className="ir-login-copy-tag mb-6">
                <div className="ir-login-copy-tag-square" />
                Manage Sessions
              </div>
              <h1 className="ir-login-copy-title">
                Your Prep <em>Sessions.</em>
              </h1>
            </section>

            <section className="ir-login-card mx-auto max-w-[700px]">
              <div className="ir-login-card-bar" />
              <div className="ir-login-card-inner">
                
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="ir-login-card-title text-[24px] mb-0">
                      Select a <em>workspace</em>
                    </h2>
                  </div>
                  <Link
                    href="/session/new"
                    className="rounded-[10px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-2 text-xs font-medium text-[var(--white)] hover:border-[#5d4420] hover:bg-[#2A2520] transition-all"
                  >
                    + New Session
                  </Link>
                </div>

                {sessions.length === 0 ? (
                  <div className="rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] py-12 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,255,255,0.03)]">
                        <svg className="w-6 h-6 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="mb-2 text-[#F5F0E8] font-medium">No sessions yet</h3>
                    <p className="mb-6 text-sm text-[var(--muted)]">Create your first interview prep session to get started</p>
                    <Link
                      href="/session/new"
                      className="inline-flex h-[40px] items-center justify-center rounded-[10px] border border-[#E8A140] bg-[#E8A140] px-6 text-xs font-medium text-[#0C0A00] transition-all hover:bg-[#C4832A] hover:border-[#C4832A]"
                    >
                      Create Your First Session
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {sessions.map((session) => {
                      const progress = getTotalProgress(session);
                      const isActive = session.id === activeId;
                      
                      return (
                        <div
                          key={session.id}
                          className={`cursor-pointer rounded-[13px] border p-5 transition-all ${
                            isActive 
                              ? "border-[#E8A140] bg-[rgba(232,161,64,0.1)] shadow-[0_0_24px_rgba(232,161,64,0.08)]"
                              : "border-[var(--card-border)] bg-[var(--bg3)] hover:border-[#5d4420] hover:bg-[#2A2520]"
                          }`}
                          onClick={() => handleSelectSession(session.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-[#F5F0E8] truncate">{session.name}</h3>
                                {session.isCompleted ? (
                                  <span className="rounded-full border border-[rgba(61,191,130,0.28)] bg-[rgba(61,191,130,0.12)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#3DBF82]">
                                    Completed
                                  </span>
                                ) : isActive ? (
                                  <span className="rounded-full border border-[rgba(232,161,64,0.28)] bg-[rgba(232,161,64,0.12)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E8A140]">
                                    Active
                                  </span>
                                ) : null}
                              </div>
                              <p className="text-xs leading-[1.6] text-[var(--muted)] mb-4">{getTopicNames(session)}</p>
                              
                              <div className="flex items-center gap-4">
                                <div className="flex-1 h-1.5 bg-[#1a1205] rounded-full overflow-hidden border border-[#2a2520]">
                                  <div
                                    className="h-full bg-[#E8A140] rounded-full transition-all"
                                    style={{ width: `${progress.percentage}%` }}
                                  />
                                </div>
                                <span className="text-[11px] font-medium text-[var(--muted)]">
                                  {progress.solved}/{progress.total} ({progress.percentage}%)
                                </span>
                              </div>

                              {session.targetDate && (
                                <p className="text-[10px] text-[var(--muted)] mt-4 uppercase tracking-[0.05em]">
                                  Target: {new Date(session.targetDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!session.isCompleted && (
                                <button
                                  onClick={(e) => handleOpenCompleteModal(session.id, e)}
                                  className="p-2 text-[var(--muted)] hover:text-[#3DBF82] transition-colors"
                                  title="Mark Completed"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDeleteSession(session.id, e)}
                                className="p-2 text-[var(--muted)] hover:text-[#e87a7a] transition-colors"
                                title="Delete Session"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                              <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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

      {completeModalSessionId && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setCompleteModalSessionId(null)}
        >
          <div 
            className="w-full max-w-[480px] rounded-[22px] border border-[var(--card-border)] bg-[var(--card)] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {modalStep === "ask" && (
              <>
                <h3 className="mb-4 font-editorial text-3xl text-[#F5F0E8]">Session Complete</h3>
                <p className="mb-8 text-[15px] leading-relaxed text-[var(--muted)]">
                  Did you complete your interview, or are you just wrapping up your practice session?
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleConfirmWrapUp}
                    className="w-full rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-[14px] text-sm font-medium text-[var(--white)] transition-all hover:border-[#5d4420] hover:bg-[#2A2520]"
                  >
                    Just wrapping up
                  </button>
                  <button
                    onClick={() => setModalStep("feedback")}
                    className="relative flex w-full items-center justify-center overflow-hidden rounded-[13px] border border-[#E8A140] bg-[#E8A140] px-4 py-[14px] text-sm font-medium text-[#0C0A00] shadow-[0_0_24px_rgba(232,161,64,0.25)] transition-all hover:-translate-y-0.5 hover:border-[#C4832A] hover:bg-[#C4832A]"
                  >
                    I completed my interview! 🎉
                  </button>
                </div>
              </>
            )}

            {modalStep === "feedback" && (
              <>
                <h3 className="mb-2 font-editorial text-3xl text-[#F5F0E8]">How did it go?</h3>
                <p className="mb-6 text-[15px] text-[var(--muted)]">
                  We&apos;d love to hear about your interview experience.
                </p>

                <div className="mb-6 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-4xl transition-all hover:scale-110 ${
                        rating >= star ? "text-[#E8A140] drop-shadow-[0_0_12px_rgba(232,161,64,0.4)]" : "text-[var(--card-border)] hover:text-[#5d4420]"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  className="mb-8 w-full resize-none rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] p-4 text-[14px] leading-relaxed text-[var(--white)] outline-none transition-all placeholder:text-[var(--muted)] focus:border-[#E8A140] focus:ring-1 focus:ring-[#E8A140]"
                  rows={4}
                  placeholder="Can you please give your interview experience? (e.g. Any specific questions they asked or tips for others?)"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setCompleteModalSessionId(null)}
                    className="flex-1 rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-[14px] text-sm font-medium text-[var(--white)] transition-all hover:border-[#5d4420] hover:bg-[#2A2520]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={rating === 0}
                    className="flex-1 rounded-[13px] border border-[#E8A140] bg-[#E8A140] px-4 py-[14px] text-sm font-medium text-[#0C0A00] shadow-[0_0_24px_rgba(232,161,64,0.25)] transition-all hover:-translate-y-0.5 hover:border-[#C4832A] hover:bg-[#C4832A] disabled:pointer-events-none disabled:opacity-50"
                  >
                    Submit & Complete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
