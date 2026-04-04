import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { CodeIcon } from "@/components/icons";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
            <CodeIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            InterviewReady
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-950/80">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base">
                Sign in to continue your interview preparation journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
              
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-950 px-2 text-gray-500">
                    New to InterviewReady?
                  </span>
                </div>
              </div>

              {/* Sign up link */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Create an account by signing in with your preferred provider above.
                <br />
                <span className="text-gray-500">It&apos;s completely free!</span>
              </p>
            </CardContent>
          </Card>

          {/* Features preview */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Coding Problems</div>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
              <div className="text-2xl font-bold text-indigo-600">50+</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">System Design</div>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Free Forever</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-sm text-gray-500">
        <p>© 2026 InterviewReady. Ace your next tech interview.</p>
      </footer>
    </div>
  );
}
