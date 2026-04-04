"use client";

import { Session, TopicId } from "./types";

const SESSIONS_KEY = "interview-prep-sessions";
const ACTIVE_SESSION_KEY = "interview-prep-active-session";

// Generate a unique ID
function generateId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get all sessions from localStorage
export function getSessions(): Session[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(SESSIONS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save sessions to localStorage
function saveSessions(sessions: Session[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

// Get active session ID
export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_SESSION_KEY);
}

// Set active session
export function setActiveSession(sessionId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
}

// Get active session
export function getActiveSession(): Session | null {
  const sessions = getSessions();
  const activeId = getActiveSessionId();
  if (!activeId) return null;
  return sessions.find((s) => s.id === activeId) || null;
}

// Create a new session
export function createSession(name: string, topics: TopicId[], targetDate?: Date): Session {
  const sessions = getSessions();
  
  const newSession: Session = {
    id: generateId(),
    name,
    topics,
    createdAt: new Date(),
    targetDate,
    progress: {},
  };

  // Initialize progress for each topic
  topics.forEach((topic) => {
    newSession.progress[topic] = {
      solved: 0,
      total: 0,
    };
  });

  sessions.push(newSession);
  saveSessions(sessions);
  setActiveSession(newSession.id);

  return newSession;
}

// Update session progress
export function updateSessionProgress(
  sessionId: string,
  topicId: TopicId,
  solved: number,
  total: number
): void {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex((s) => s.id === sessionId);
  
  if (sessionIndex !== -1) {
    sessions[sessionIndex].progress[topicId] = { solved, total };
    saveSessions(sessions);
  }
}

// Delete a session
export function deleteSession(sessionId: string): void {
  let sessions = getSessions();
  sessions = sessions.filter((s) => s.id !== sessionId);
  saveSessions(sessions);
  
  // If deleted session was active, clear active
  if (getActiveSessionId() === sessionId) {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }
}

// Get session by ID
export function getSessionById(sessionId: string): Session | null {
  const sessions = getSessions();
  return sessions.find((s) => s.id === sessionId) || null;
}
