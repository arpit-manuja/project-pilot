"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { useState } from "react";

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
    <div className="flex flex-col gap-4">
      <Button
        variant="github"
        size="lg"
        onClick={() => handleSignIn("github")}
        disabled={isLoading !== null}
        className="w-full"
      >
        {isLoading === "github" ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <GitHubIcon className="h-5 w-5" />
        )}
        Continue with GitHub
      </Button>

      <Button
        variant="google"
        size="lg"
        onClick={() => handleSignIn("google")}
        disabled={isLoading !== null}
        className="w-full"
      >
        {isLoading === "google" ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        ) : (
          <GoogleIcon className="h-5 w-5" />
        )}
        Continue with Google
      </Button>
    </div>
  );
}
