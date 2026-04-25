import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { createClient } from "@supabase/supabase-js";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend the built-in session/token types
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Guest",
      credentials: {},
      async authorize() {
        return {
          id: `guest_${Date.now()}`,
          name: "Guest User",
          email: "guest@interviewready.com",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        // Initialize Supabase server client with service role key
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          process.env.SUPABASE_SERVICE_ROLE_KEY || ""
        );

        // Upsert user data into public.users
        const { error } = await supabase
          .from("users")
          .upsert(
            {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account?.provider || "unknown",
              environment: process.env.NODE_ENV === "production" ? "production" : "local",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

        if (error) {
          console.error("Failed to upsert user to Supabase:", error);
          // Sign-in continues even if sync fails
        }
      } catch (error) {
        console.error("Error syncing user to Supabase:", error);
        // Sign-in continues even if sync fails
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
