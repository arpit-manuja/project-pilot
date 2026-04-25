"use client";

import { Session, TopicId } from "./types";

const SESSIONS_BASE = "interview-prep-sessions";
const ACTIVE_SESSION_BASE = "interview-prep-active-session";

// Key generators
const getSessionsKey = (user: string) => `${SESSIONS_BASE}-${user}`;
const getActiveKey = (user: string) => `${ACTIVE_SESSION_BASE}-${user}`;

// Generate a unique ID
function generateId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get all sessions from localStorage
export function getSessions(user = "guest"): Session[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(getSessionsKey(user));
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save sessions to localStorage
function saveSessions(sessions: Session[], user = "guest"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getSessionsKey(user), JSON.stringify(sessions));
}

// Get active session ID
export function getActiveSessionId(user = "guest"): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(getActiveKey(user));
}

// Set active session
export function setActiveSession(sessionId: string, user = "guest"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getActiveKey(user), sessionId);
}

// Get active session
export function getActiveSession(user = "guest"): Session | null {
  const sessions = getSessions(user);
  const activeId = getActiveSessionId(user);
  if (!activeId) return null;
  return sessions.find((s) => s.id === activeId) || null;
}

// Create a new session
export function createSession(name: string, topics: string[], targetDate?: string, user = "guest"): Session {
  const sessions = getSessions(user);

  const newSession: Session = {
    id: generateId(),
    name,
    topics,
    createdAt: new Date().toISOString(),
    targetDate: targetDate || undefined,
  };

  sessions.push(newSession);
  saveSessions(sessions, user);
  setActiveSession(newSession.id, user);

  return newSession;
}

// Delete a session
export function deleteSession(sessionId: string, user = "guest"): void {
  let sessions = getSessions(user);
  sessions = sessions.filter((s) => s.id !== sessionId);
  saveSessions(sessions, user);

  // If deleted session was active, clear active
  if (getActiveSessionId(user) === sessionId) {
    localStorage.removeItem(getActiveKey(user));
  }
}

// Mark session as completed
export function markSessionCompleted(
  sessionId: string,
  feedback?: { rating: number; review: string },
  user = "guest"
): void {
  const sessions = getSessions(user);
  const sessionIndex = sessions.findIndex((s) => s.id === sessionId);

  if (sessionIndex !== -1) {
    sessions[sessionIndex].isCompleted = true;
    if (feedback) {
      sessions[sessionIndex].feedback = feedback;
    }
    saveSessions(sessions, user);

    // If completed session was active, clear active
    if (getActiveSessionId(user) === sessionId) {
      localStorage.removeItem(getActiveKey(user));
    }
  }
}

// Get session by ID
export function getSessionById(sessionId: string, user = "guest"): Session | null {
  const sessions = getSessions(user);
  return sessions.find((s) => s.id === sessionId) || null;
}
