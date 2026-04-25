import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CodeIcon } from "@/components/icons";
import { LogoutButton } from "@/components/auth/logout-button";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const firstName = session.user.name?.split(" ")[0] || "there";

  return (
    <div className="ir-login-page">
      <div className="ir-login-bg" />
      <div className="ir-login-grid" />
      <div className="ir-login-grain" />

      <div className="ir-login-shell">
        <header className="ir-login-nav">
          <Link href="/dashboard" className="ir-login-logo">
            <div className="ir-login-logo-icon">
              <CodeIcon className="h-[18px] w-[18px] text-[#0C0A00]" />
            </div>
            <span className="ir-login-logo-text">InterviewReady</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="ir-login-nav-badge">
              <div className="ir-login-pulse" />
              100% Free Forever
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="ir-login-center">
          <div className="w-full max-w-[860px] px-6">
            <section className="ir-login-card">
              <div className="ir-login-card-bar" />
              <DashboardContent userName={firstName} userEmail={session.user.email || "guest"} />
            </section>
          </div>
        </main>

        <footer className="ir-login-footer">
          <span className="ir-login-footer-copy">© 2026 InterviewReady</span>
          <div className="ir-login-footer-links">
            <Link href="/" className="ir-login-footer-link">
              Privacy
            </Link>
            <Link href="/" className="ir-login-footer-link">
              Terms
            </Link>
            <Link href="/" className="ir-login-footer-link">
              Support
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
