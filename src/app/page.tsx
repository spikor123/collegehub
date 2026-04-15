import Link from "next/link";
import {
  GraduationCap,
  Megaphone,
  CalendarDays,
  BookOpen,
  ShoppingBag,
  BarChart3,
  Shield,
  Smartphone,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Megaphone,
    title: "Notice Board",
    description:
      "Real-time announcements with priority levels, search, and instant push notifications.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: CalendarDays,
    title: "Events & Calendar",
    description:
      "Discover campus events, register for hackathons, and sync your timetable.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: BookOpen,
    title: "Study Notes",
    description:
      "Browse, download, and share study material organized by department and semester.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description:
      "Buy & sell books, gadgets, and notes anonymously within your campus community.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: BarChart3,
    title: "Anonymous Polls",
    description:
      "Voice your opinion on campus matters with completely anonymous voting.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Role-based access, row-level security, and end-to-end encryption for your data.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

const stats = [
  { value: "10+", label: "Colleges" },
  { value: "5,000+", label: "Students" },
  { value: "1,200+", label: "Notes Shared" },
  { value: "99.9%", label: "Uptime" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/15 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[150px] animate-pulse" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/8 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Navbar */}
      <header className="relative z-20 border-b border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              College<span className="text-primary">Hub</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 text-center lg:px-8 lg:pt-32">
          {/* Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Zap className="h-3 w-3" />
            Built for Indian Universities
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight lg:text-6xl">
            Your Campus,{" "}
            <span className="gradient-text">Connected</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
            The complete digital ecosystem for your college. Notices, events,
            notes, marketplace, and polls — all in one beautiful, secure
            platform.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border px-8 text-base font-medium text-foreground transition-all hover:bg-accent sm:w-auto"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/50 bg-card/30 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-foreground lg:text-3xl">{stat.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 border-t border-border/30">
        <div className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Everything your campus needs
            </h2>
            <p className="mt-3 text-muted-foreground">
              Powerful features designed for the modern Indian university.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/60 hover:shadow-xl hover:shadow-primary/5"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} transition-transform duration-200 group-hover:scale-110`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-border/30">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center lg:px-8">
          <div className="mx-auto max-w-2xl rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/5 p-10 backdrop-blur-sm">
            <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
              Ready to connect your campus?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join thousands of students already using CollegeHub.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flex justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Free for students
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                No credit card
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Setup in 5 minutes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 bg-card/20 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-bold">
                College<span className="text-primary">Hub</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 CollegeHub. Built with ❤️ for Indian universities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
