"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="border-[var(--card-border)] bg-[var(--bg3)] text-[var(--off)] hover:bg-[#2A2520] hover:text-[var(--white)]"
    >
      Sign Out
    </Button>
  );
}
