"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Session, AVAILABLE_TOPICS } from "@/lib/types";
import { getActiveSession, getSessions } from "@/lib/session-store";
import { getQuestionsByTopic, getTopicQuestionCount } from "@/lib/questions";

const DONE_KEY = "interview-prep-done";

function getDoneIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(DONE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

const topicColors: Record<string, string> = {
  dsa: "blue",
  "cs-fundamentals": "purple",
  "system-design": "indigo",
  behavioral: "green",
  frontend: "pink",
  backend: "orange",
  database: "cyan",
  os: "red",
  networking: "teal",
};

const colorClasses: Record<string, { bg: string; text: string; bar: string }> = {
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600", bar: "from-blue-500 to-blue-600" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600", bar: "from-purple-500 to-purple-600" },
  indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600", bar: "from-indigo-500 to-indigo-600" },
  green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600", bar: "from-green-500 to-green-600" },
  pink: { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-600", bar: "from-pink-500 to-pink-600" },
  orange: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600", bar: "from-orange-500 to-orange-600" },
  cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-600", bar: "from-cyan-500 to-cyan-600" },
  red: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600", bar: "from-red-500 to-red-600" },
  teal: { bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-600", bar: "from-teal-500 to-teal-600" },
};

interface DashboardContentProps {
  userName: string;
}

export function DashboardContent({ userName }: DashboardContentProps) {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [sessionsCount, setSessionsCount] = useState<number>(0);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActiveSession(getActiveSession());
    setSessionsCount(getSessions().length);
    setDoneIds(getDoneIds());
    setIsLoading(false);
  }, []); // eslint-disable-line

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // No session exists - prompt to create one
  if (!activeSession) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Welcome, {userName}! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Let&apos;s set up your interview preparation journey.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mb-8">
              Create a prep session by selecting the topics you expect in your interview.
              We&apos;ll track your progress specifically for those areas.
            </p>
            <Link href="/session/new">
              <Button size="lg" className="px-8">
                Create Your First Session
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate session stats from real completed questions in localStorage
  const getTotalProgress = () => {
    let solved = 0;
    let total = 0;
    activeSession.topics.forEach((topicId) => {
      const topicQs = getQuestionsByTopic(topicId);
      total += topicQs.length;
      solved += topicQs.filter((q) => doneIds.has(q.id)).length;
    });
    return { solved, total, percentage: total > 0 ? Math.round((solved / total) * 100) : 0 };
  };

  const progress = getTotalProgress();
  const daysUntilTarget = activeSession.targetDate
    ? Math.ceil((new Date(activeSession.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <>
      {/* Session Info Banner */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-200 text-sm">Active Session:</span>
            <span className="font-bold">{activeSession.name}</span>
          </div>
          <div className="text-blue-100 text-sm">
            {activeSession.topics.length} topics • {progress.solved}/{progress.total} completed ({progress.percentage}%)
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/session">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
              Switch Session
            </Button>
          </Link>
          <Link href="/session/new">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
              + New
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
          <div className="text-3xl font-bold text-blue-600">{progress.solved}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Questions Done</div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
          <div className="text-3xl font-bold text-green-600">{progress.percentage}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
          <div className="text-3xl font-bold text-indigo-600">{activeSession.topics.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Topics Selected</div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg">
          <div className="text-3xl font-bold text-purple-600">
            {daysUntilTarget !== null ? (daysUntilTarget > 0 ? daysUntilTarget : "Today!") : "—"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {daysUntilTarget !== null ? "Days Left" : "No Target Set"}
          </div>
        </div>
      </div>

      {/* Topic Progress */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Topics</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {activeSession.topics.map((topicId) => {
          const topic = AVAILABLE_TOPICS.find((t) => t.id === topicId);
          if (!topic) return null;
          
          const topicQs = getQuestionsByTopic(topicId);
          const topicTotal = topicQs.length || getTopicQuestionCount(topicId);
          const topicSolved = topicQs.filter((q) => doneIds.has(q.id)).length;
          const percentage = topicTotal > 0 ? Math.round((topicSolved / topicTotal) * 100) : 0;
          const color = topicColors[topicId] || "blue";
          const colors = colorClasses[color];

          return (
            <Link key={topicId} href="/practice">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white">{topic.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{topicSolved} / {topicTotal} done</span>
                    <span className="text-blue-600">Practice →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/practice" className="block">
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Practice Coding</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Solve DSA problems</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/session" className="block">
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Manage Sessions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{sessionsCount} session{sessionsCount !== 1 ? "s" : ""} created</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/session/new" className="block">
          <Card className="hover:shadow-lg transition-shadow h-full border-dashed">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">New Session</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create another prep session</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
}
