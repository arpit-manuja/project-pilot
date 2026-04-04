export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      questions: {
        Row: {
          id: string;
          topic_id: string;
          title: string;
          description: string;
          hint: string | null;
          solution: string;
          difficulty: "easy" | "medium" | "hard";
          tags: string[];
          created_at: string;
        };
        Insert: {
          id: string;
          topic_id: string;
          title: string;
          description: string;
          hint?: string | null;
          solution: string;
          difficulty: "easy" | "medium" | "hard";
          tags?: string[];
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          hint?: string | null;
          solution?: string;
          difficulty?: "easy" | "medium" | "hard";
          tags?: string[];
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          image: string | null;
          provider: string;
          provider_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          image?: string | null;
          provider: string;
          provider_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          image?: string | null;
          provider?: string;
          provider_id?: string;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          topics: string[];
          target_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          topics: string[];
          target_date?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          topics?: string[];
          target_date?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      question_progress: {
        Row: {
          id: string;
          user_id: string;
          session_id: string;
          question_id: string;
          topic_id: string;
          status: "done" | "struggling" | "skipped";
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id: string;
          question_id: string;
          topic_id: string;
          status?: "done" | "struggling" | "skipped";
          completed_at?: string;
        };
        Update: {
          status?: "done" | "struggling" | "skipped";
          completed_at?: string;
        };
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
  };
}
