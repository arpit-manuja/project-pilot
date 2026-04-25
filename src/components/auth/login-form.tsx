"use client";

import { signIn } from "next-auth/react";
import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { useState } from "react";

function Spinner({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`h-[18px] w-[18px] animate-spin rounded-full border-2 ${
        dark ? "border-[#8c8479] border-t-transparent" : "border-[#0C0A00] border-t-transparent"
      }`}
    />
  );
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => handleSignIn("github")}
        disabled={isLoading !== null}
        className="relative mb-[10px] flex h-[52px] w-full items-center overflow-hidden rounded-[13px] border border-[#E8A140] bg-[#E8A140] px-[18px] text-[14px] font-medium tracking-[0.01em] text-[#0C0A00] shadow-[0_0_24px_rgba(232,161,64,0.25),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(232,161,64,0.35),0_8px_20px_rgba(0,0,0,0.35)] disabled:pointer-events-none disabled:opacity-60"
      >
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,transparent_60%)]" />
        <span className="relative flex w-[26px] flex-shrink-0 items-center">
          {isLoading === "github" ? <Spinner /> : <GitHubIcon className="h-[18px] w-[18px]" />}
        </span>
        <span className="relative flex-1 pr-[26px] text-center">Continue with GitHub</span>
      </button>

      <div className="ir-login-divider">
        <span className="ir-login-divider-line" />
        <span className="ir-login-divider-text">or</span>
        <span className="ir-login-divider-line" />
      </div>

      <button
        type="button"
        onClick={() => handleSignIn("google")}
        disabled={isLoading !== null}
        className="flex h-[52px] w-full items-center rounded-[13px] border border-[#2E2820] bg-[#231F1B] px-[18px] text-[14px] font-medium tracking-[0.01em] text-[#F5F0E8] shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#3A342C] hover:bg-[#2A2520] hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] disabled:pointer-events-none disabled:opacity-60"
      >
        <span className="flex w-[26px] flex-shrink-0 items-center">
          {isLoading === "google" ? <Spinner dark /> : <GoogleIcon className="h-[18px] w-[18px]" />}
        </span>
        <span className="flex-1 pr-[26px] text-center">Continue with Google</span>
      </button>

      <div className="ir-login-divider">
        <span className="ir-login-divider-line" />
        <span className="ir-login-divider-text">demo</span>
        <span className="ir-login-divider-line" />
      </div>

      <button
        type="button"
        onClick={() => handleSignIn("credentials")}
        disabled={isLoading !== null}
        className="flex h-[52px] w-full items-center rounded-[13px] border border-[#2E2820] bg-[#231F1B] px-[18px] text-[14px] font-medium tracking-[0.01em] text-[#F5F0E8] shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#3A342C] hover:bg-[#2A2520] hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] disabled:pointer-events-none disabled:opacity-60"
      >
        <span className="flex w-[26px] flex-shrink-0 items-center justify-center">
          {isLoading === "credentials" ? <Spinner dark /> : (
            <svg className="h-[18px] w-[18px] text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </span>
        <span className="flex-1 pr-[26px] text-center">Continue as Guest</span>
      </button>
    </div>
  );
}
