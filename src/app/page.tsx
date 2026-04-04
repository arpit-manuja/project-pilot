import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CodeIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
            <CodeIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Am I Interview Ready
          </span>
        </Link>
        <Link href="/login">
          <Button variant="outline">Sign In</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            100% Free - No Credit Card Required
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Ace Your Next
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Tech Interview
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Master coding problems, system design, and behavioral questions. 
            Practice with our curated collection and land your dream job at top tech companies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-shadow">
                Start Practicing Free
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-lg">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Coding Problems</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-lg">
              <div className="text-3xl font-bold text-indigo-600">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">System Design</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-lg">
              <div className="text-3xl font-bold text-purple-600">100+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Behavioral Q&A</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-lg">
              <div className="text-3xl font-bold text-green-600">10K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Users Hired</div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Comprehensive preparation resources designed by engineers who&apos;ve been through the process.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Data Structures & Algorithms</h3>
              <p className="text-gray-600 dark:text-gray-400">
                500+ curated problems covering arrays, trees, graphs, dynamic programming, and more. With detailed solutions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">System Design</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn to design scalable systems like URL shorteners, chat apps, and distributed databases with real-world examples.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Behavioral Interviews</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Master the STAR method with 100+ common questions and sample answers. Prepare for any HR round confidently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of developers who&apos;ve successfully prepared with InterviewReady.
            </p>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100">
                Get Started - It&apos;s Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 p-8 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <CodeIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-700 dark:text-gray-300">InterviewReady</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 InterviewReady. Ace your next tech interview.</p>
        </div>
      </footer>
    </div>
  );
}
