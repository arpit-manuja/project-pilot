"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    >
      Sign Out
    </Button>
  );
}
