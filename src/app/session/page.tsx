"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeIcon } from "@/components/icons";
import { Session, AVAILABLE_TOPICS } from "@/lib/types";
import { getSessions, setActiveSession, deleteSession, getActiveSessionId } from "@/lib/session-store";

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setSessions(getSessions());
    setActiveId(getActiveSessionId());
  }, []);

  const handleSelectSession = (sessionId: string) => {
    setActiveSession(sessionId);
    router.push("/dashboard");
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this session?")) {
      deleteSession(sessionId);
      setSessions(getSessions());
      setActiveId(getActiveSessionId());
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <CodeIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              InterviewReady
            </span>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Prep Sessions 📚
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your interview preparation sessions
            </p>
          </div>
          <Link href="/session/new">
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Session
            </Button>
          </Link>
        </div>

        {sessions.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No sessions yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Create your first interview prep session to get started
              </p>
              <Link href="/session/new">
                <Button>Create Your First Session</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => {
              const progress = getTotalProgress(session);
              const isActive = session.id === activeId;
              
              return (
                <Card
                  key={session.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isActive ? "ring-2 ring-blue-500 border-blue-500" : ""
                  }`}
                  onClick={() => handleSelectSession(session.id)}
                >
                  <CardContent className="py-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {session.name}
                          </h3>
                          {isActive && (
                            <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          {getTopicNames(session)}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {progress.solved}/{progress.total} ({progress.percentage}%)
                          </span>
                        </div>

                        {session.targetDate && (
                          <p className="text-xs text-gray-400 mt-3">
                            Target: {new Date(session.targetDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
