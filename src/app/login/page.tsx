import { CodeIcon } from "@/components/icons";
import { LoginForm } from "@/components/auth/login-form";
import { TextScramble } from "@/components/ui/text-scramble";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const highlights = ["500+ Problems", "System Design", "Always Free"];

export default async function LoginPage() {
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

          <div className="ir-login-nav-badge">
            <div className="ir-login-pulse" />
            <TextScramble
              as="span"
              speed={0.02}
              duration={1}
              className="inline-block"
            >
              100% Free Forever
            </TextScramble>
          </div>
        </header>

        <main className="ir-login-center">
          <div className="ir-login-layout">
            <section className="ir-login-copy">
              <div className="ir-login-copy-tag">
                <div className="ir-login-copy-tag-square" />
                Interview Prep Platform
              </div>

              <h1 className="ir-login-copy-title">
                Land your <em>dream role.</em>
              </h1>

              <p className="ir-login-copy-body">
                500+ handpicked problems, deep system design breakdowns, and structured tracks -
                built by engineers who&apos;ve cracked FAANG.
              </p>

              <div className="ir-login-rule" />

              <div className="ir-login-pills">
                {highlights.map((item) => (
                  <div key={item} className="ir-login-pill">
                    <div className="ir-login-pill-icon">
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M2 5l2.2 2.2L8 3"
                          stroke="#3DBF82"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <div className="ir-login-proof">
                <div className="ir-login-avatars">
                  <div className="ir-login-avatar ir-login-avatar-1">AK</div>
                  <div className="ir-login-avatar ir-login-avatar-2">SR</div>
                  <div className="ir-login-avatar ir-login-avatar-3">MV</div>
                  <div className="ir-login-avatar ir-login-avatar-4">PN</div>
                </div>
                <p className="ir-login-proof-text">
                  <strong>4,200+ engineers</strong> prepped here
                  <br />
                  this month alone
                </p>
              </div>
            </section>

            <section className="ir-login-card">
              <div className="ir-login-card-bar" />
              <div className="ir-login-card-inner">
                <p className="ir-login-card-label">Welcome back</p>
                <h2 className="ir-login-card-title">
                  Sign in &amp; keep
                  <br />
                  your <em>streak</em> alive.
                </h2>
                <p className="ir-login-card-sub">
                  One click. No password. Just pick your provider.
                </p>

                <LoginForm />

                <div className="ir-login-note">
                  By signing in you agree to our <Link href="/">Terms</Link> &amp;{" "}
                  <Link href="/">Privacy Policy</Link>.
                  <br />
                  No account yet? One is created on first sign-in.
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
