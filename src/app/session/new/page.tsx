"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeIcon } from "@/components/icons";
import { AVAILABLE_TOPICS, TopicId } from "@/lib/types";
import { createSession } from "@/lib/session-store";

const topicIcons: Record<string, React.ReactNode> = {
  code: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  cpu: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M13 7h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2z" />
    </svg>
  ),
  server: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
    </svg>
  ),
  users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  layout: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  database: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
  ),
  table: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  monitor: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  globe: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const colorClasses: Record<string, string> = {
  blue: "from-blue-500 to-blue-600 border-blue-200 dark:border-blue-800",
  purple: "from-purple-500 to-purple-600 border-purple-200 dark:border-purple-800",
  indigo: "from-indigo-500 to-indigo-600 border-indigo-200 dark:border-indigo-800",
  green: "from-green-500 to-green-600 border-green-200 dark:border-green-800",
  pink: "from-pink-500 to-pink-600 border-pink-200 dark:border-pink-800",
  orange: "from-orange-500 to-orange-600 border-orange-200 dark:border-orange-800",
  cyan: "from-cyan-500 to-cyan-600 border-cyan-200 dark:border-cyan-800",
  red: "from-red-500 to-red-600 border-red-200 dark:border-red-800",
  teal: "from-teal-500 to-teal-600 border-teal-200 dark:border-teal-800",
};

const selectedBorderClasses: Record<string, string> = {
  blue: "ring-2 ring-blue-500 border-blue-500",
  purple: "ring-2 ring-purple-500 border-purple-500",
  indigo: "ring-2 ring-indigo-500 border-indigo-500",
  green: "ring-2 ring-green-500 border-green-500",
  pink: "ring-2 ring-pink-500 border-pink-500",
  orange: "ring-2 ring-orange-500 border-orange-500",
  cyan: "ring-2 ring-cyan-500 border-cyan-500",
  red: "ring-2 ring-red-500 border-red-500",
  teal: "ring-2 ring-teal-500 border-teal-500",
};

// Preset templates
const PRESETS = [
  {
    name: "Fresher / Entry Level",
    description: "DSA + CS Fundamentals + Basic Behavioral",
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
    description: "Complete preparation for top tech companies",
    topics: ["dsa", "system-design", "behavioral", "cs-fundamentals"] as TopicId[],
  },
];

export default function NewSessionPage() {
  const router = useRouter();
  const [sessionName, setSessionName] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<TopicId[]>([]);
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState("");

  const toggleTopic = (topicId: TopicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((t) => t !== topicId)
        : [...prev, topicId]
    );
  };

  const applyPreset = (topics: TopicId[]) => {
    setSelectedTopics(topics);
  };

  const handleCreateSession = () => {
    if (!sessionName.trim()) {
      setError("Please enter a session name");
      return;
    }
    if (selectedTopics.length === 0) {
      setError("Please select at least one topic");
      return;
    }

    const session = createSession(
      sessionName.trim(),
      selectedTopics,
      targetDate ? new Date(targetDate) : undefined
    );

    router.push("/dashboard");
  };

  const totalQuestions = selectedTopics.reduce((sum, topicId) => {
    const topic = AVAILABLE_TOPICS.find((t) => t.id === topicId);
    return sum + (topic?.totalQuestions || 0);
  }, 0);

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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Interview Prep Session 🎯
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select the topics you expect in your interview. We&apos;ll track your progress for these specific areas.
          </p>
        </div>

        {/* Session Name Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Session Details</CardTitle>
            <CardDescription>Give your prep session a memorable name</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Session Name *
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => {
                  setSessionName(e.target.value);
                  setError("");
                }}
                placeholder="e.g., Google Interview Prep, Fresher DSA Practice"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Interview Date (Optional)
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Presets */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Presets</CardTitle>
            <CardDescription>Choose a preset based on your interview type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset.topics)}
                  className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-gray-900 text-left transition-all hover:shadow-md"
                >
                  <div className="font-medium text-gray-900 dark:text-white mb-1">
                    {preset.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Topic Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Select Topics</CardTitle>
            <CardDescription>
              Choose the topics you want to focus on ({selectedTopics.length} selected)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_TOPICS.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-lg ${
                      isSelected
                        ? selectedBorderClasses[topic.color]
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    } bg-white dark:bg-gray-900`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[topic.color]} flex items-center justify-center text-white flex-shrink-0`}
                      >
                        {topicIcons[topic.icon]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {topic.name}
                          </div>
                          {isSelected && (
                            <svg
                              className="w-5 h-5 text-green-500 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {topic.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          {topic.totalQuestions} questions
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary & Create Button */}
        <Card>
          <CardContent className="py-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Selected: <span className="font-medium text-gray-900 dark:text-white">{selectedTopics.length} topics</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Questions: <span className="font-medium text-gray-900 dark:text-white">{totalQuestions}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link href="/dashboard">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button onClick={handleCreateSession} disabled={selectedTopics.length === 0}>
                  Create Session
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
