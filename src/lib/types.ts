export type TopicId = 
  | "dsa"
  | "cs-fundamentals"
  | "system-design"
  | "behavioral"
  | "frontend"
  | "backend"
  | "database"
  | "os"
  | "networking";

export interface Topic {
  id: TopicId;
  name: string;
  description: string;
  icon: string;
  color: string;
  totalQuestions: number;
}

export interface Session {
  id: string;
  name: string;
  topics: TopicId[];
  createdAt: string;
  targetDate?: string;
  isCompleted?: boolean;
  feedback?: {
    rating: number;
    review: string;
  };
  progress: {
    [key in TopicId]?: {
      solved: number;
      total: number;
    };
  };
}

export const AVAILABLE_TOPICS: Topic[] = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    description: "Arrays, Trees, Graphs, DP, Sorting, Searching",
    icon: "code",
    color: "blue",
    totalQuestions: 150,
  },
  {
    id: "cs-fundamentals",
    name: "CS Fundamentals",
    description: "OOP, Memory Management, Compilation, Runtime",
    icon: "cpu",
    color: "purple",
    totalQuestions: 50,
  },
  {
    id: "system-design",
    name: "System Design",
    description: "Scalability, Load Balancing, Caching, Databases",
    icon: "server",
    color: "indigo",
    totalQuestions: 30,
  },
  {
    id: "behavioral",
    name: "Behavioral Questions",
    description: "STAR Method, Leadership, Teamwork, Conflicts",
    icon: "users",
    color: "green",
    totalQuestions: 50,
  },
  {
    id: "frontend",
    name: "Frontend Development",
    description: "HTML, CSS, JavaScript, React, Performance",
    icon: "layout",
    color: "pink",
    totalQuestions: 40,
  },
  {
    id: "backend",
    name: "Backend Development",
    description: "APIs, Authentication, Server Architecture",
    icon: "database",
    color: "orange",
    totalQuestions: 40,
  },
  {
    id: "database",
    name: "Database & SQL",
    description: "SQL Queries, Indexing, Normalization, NoSQL",
    icon: "table",
    color: "cyan",
    totalQuestions: 35,
  },
  {
    id: "os",
    name: "Operating Systems",
    description: "Processes, Threads, Memory, Scheduling",
    icon: "monitor",
    color: "red",
    totalQuestions: 30,
  },
  {
    id: "networking",
    name: "Computer Networks",
    description: "TCP/IP, HTTP, DNS, Security, Protocols",
    icon: "globe",
    color: "teal",
    totalQuestions: 25,
  },
];
