import Link from "next/link";
import { CodeIcon } from "@/components/icons";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="ir-login-page">
      <div className="ir-login-bg" />
      <div className="ir-login-grid" />
      <div className="ir-login-grain" />

      <div className="ir-login-shell">
        <header className="ir-login-nav">
          <Link href={session ? "/dashboard" : "/"} className="ir-login-logo">
            <div className="ir-login-logo-icon">
              <CodeIcon className="h-[18px] w-[18px] text-[#0C0A00]" />
            </div>
            <span className="ir-login-logo-text">InterviewReady</span>
          </Link>

          <Link
            href="/login"
            className="ir-login-nav-badge hover:bg-[rgba(245,240,232,0.1)] transition-colors cursor-pointer text-[#F5F0E8] no-underline"
          >
            Sign In
          </Link>
        </header>

        <main className="ir-login-center px-6">
          <div className="w-full max-w-[860px]">
            <section className="mb-12 text-center flex flex-col items-center">
              <div className="ir-login-copy-tag mb-6">
                <div className="ir-login-copy-tag-square" />
                Interview Prep Platform
              </div>
              <h1 className="ir-login-copy-title">
                Ace Your Next <em>Tech Interview.</em>
              </h1>
              <p className="mt-5 max-w-[560px] text-[15px] leading-8 text-[var(--off)]">
                Master coding problems, system design, and behavioral questions. Practice with our curated collection and land your dream job at top tech companies.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="relative flex h-[52px] items-center justify-center overflow-hidden rounded-[13px] border border-[#E8A140] bg-[#E8A140] px-[24px] text-[14px] font-medium tracking-[0.01em] text-[#0C0A00] shadow-[0_0_24px_rgba(232,161,64,0.25),0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#C4832A] hover:bg-[#C4832A] hover:shadow-[0_0_36px_rgba(232,161,64,0.35),0_8px_20px_rgba(0,0,0,0.35)]"
                >
                  Start Practicing Free
                </Link>
                <Link
                  href="#features"
                  className="flex h-[52px] items-center justify-center rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-[24px] text-[14px] font-medium tracking-[0.01em] text-[#F5F0E8] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#5d4420] hover:bg-[#2A2520]"
                >
                  Explore Features
                </Link>
              </div>
            </section>

            <section id="features" className="ir-login-card mx-auto max-w-[700px]">
              <div className="ir-login-card-bar" />
              <div className="ir-login-card-inner">
                <p className="ir-login-card-label text-center">Platform Stats</p>
                <h2 className="ir-login-card-title text-center text-[24px] mb-8">
                  Everything you need to <em>succeed.</em>
                </h2>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-5 text-center">
                    <div className="font-editorial text-[32px] leading-none text-[#F5F0E8]">
                      500+
                    </div>
                    <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
                      Coding Problems
                    </div>
                  </div>
                  <div className="rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-5 text-center">
                    <div className="font-editorial text-[32px] leading-none text-[#F5F0E8]">
                      50+
                    </div>
                    <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
                      System Design
                    </div>
                  </div>
                  <div className="rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-5 text-center">
                    <div className="font-editorial text-[32px] leading-none text-[#F5F0E8]">
                      100+
                    </div>
                    <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
                      Behavioral Q&A
                    </div>
                  </div>
                  <div className="rounded-[13px] border border-[var(--card-border)] bg-[var(--bg3)] px-4 py-5 text-center">
                    <div className="font-editorial text-[32px] leading-none text-[#F5F0E8]">
                      10K+
                    </div>
                    <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
                      Users Hired
                    </div>
                  </div>
                </div>
              </div>
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
