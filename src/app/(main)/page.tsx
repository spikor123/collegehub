"use client";

import {
  Megaphone,
  CalendarDays,
  BarChart3,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Pin,
  BookOpen,
  ClipboardList,
  Users,
  FileText,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Placeholder data — will be replaced with Supabase queries
const recentNotices = [
  {
    id: "1",
    title: "Mid-Semester Exam Schedule Released",
    priority: "urgent" as const,
    is_pinned: true,
    created_at: "2 hours ago",
  },
  {
    id: "2",
    title: "Workshop on AI/ML — Registration Open",
    priority: "important" as const,
    is_pinned: false,
    created_at: "5 hours ago",
  },
  {
    id: "3",
    title: "Library timings extended during exams",
    priority: "normal" as const,
    is_pinned: false,
    created_at: "1 day ago",
  },
  {
    id: "4",
    title: "Campus Placement Drive — Infosys & TCS",
    priority: "important" as const,
    is_pinned: false,
    created_at: "2 days ago",
  },
];

const upcomingEvents = [
  {
    id: "1",
    title: "Hackathon 2026",
    start_time: "Apr 20",
    location: "Main Auditorium",
    attendees: 186,
  },
  {
    id: "2",
    title: "Cultural Fest — Rhythm",
    start_time: "Apr 25",
    location: "Open Ground",
    attendees: 520,
  },
  {
    id: "3",
    title: "TEDxCampus",
    start_time: "Apr 28",
    location: "Seminar Hall 1",
    attendees: 145,
  },
];

const activePolls = [
  {
    id: "1",
    question: "Best canteen food item?",
    votes: 251,
    deadline: "3 days left",
    options: 4,
  },
  {
    id: "2",
    question: "AI/ML Workshop timing?",
    votes: 235,
    deadline: "1 day left",
    options: 3,
  },
];

const trendingItems = [
  {
    id: "1",
    title: "Engineering Mathematics Textbook",
    price: "₹250",
    discount: "62% off",
    seller: "@stud8a3f2c",
    likes: 12,
  },
  {
    id: "2",
    title: "HP Laptop Charger (65W)",
    price: "₹400",
    discount: "67% off",
    seller: "@stud2b7e9d",
    likes: 8,
  },
  {
    id: "3",
    title: "Casio fx-991EX Calculator",
    price: "₹800",
    discount: "50% off",
    seller: "@stud5c1d4a",
    likes: 23,
  },
];

const deadlines = [
  { id: "1", title: "BST Implementation — CS301", due: "Tomorrow", status: "pending" },
  { id: "2", title: "ER Diagram — CS302", due: "Apr 18", status: "pending" },
  { id: "3", title: "OS Lab Report — CS303", due: "Apr 20", status: "pending" },
];

const priorityConfig = {
  urgent: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: AlertTriangle,
  },
  important: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: Sparkles,
  },
  normal: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: Megaphone,
  },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  return (
    <div className="space-y-6 animate-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            {getGreeting()}, Anirban 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s what&apos;s happening at your campus today.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
          <Flame className="h-3 w-3" />
          3 urgent items
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Notices", value: "7", icon: Megaphone, color: "text-blue-400", bg: "bg-blue-500/10", href: "/notices" },
          { label: "Events", value: "6", icon: CalendarDays, color: "text-green-400", bg: "bg-green-500/10", href: "/events" },
          { label: "Active Polls", value: "2", icon: BarChart3, color: "text-purple-400", bg: "bg-purple-500/10", href: "/polls" },
          { label: "Marketplace", value: "8", icon: ShoppingBag, color: "text-orange-400", bg: "bg-orange-500/10", href: "/marketplace" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="border-border/50 transition-all duration-200 hover:border-border hover:shadow-md hover:shadow-primary/5 cursor-pointer">
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Notices */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="h-4 w-4 text-primary" />
              Recent Notices
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/notices" className="text-xs">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentNotices.map((notice) => {
              const config = priorityConfig[notice.priority];
              return (
                <div
                  key={notice.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50 ${config.border}`}
                >
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                    {notice.is_pinned ? (
                      <Pin className={`h-3.5 w-3.5 ${config.color}`} />
                    ) : (
                      <config.icon className={`h-3.5 w-3.5 ${config.color}`} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{notice.title}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {notice.created_at}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-green-400" />
              Upcoming Events
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/events" className="text-xs">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                  <span className="text-[10px] font-medium uppercase leading-none">
                    {event.start_time.split(" ")[0]}
                  </span>
                  <span className="text-lg font-bold leading-none">
                    {event.start_time.split(" ")[1]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.location}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {event.attendees}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assignment Deadlines */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4 text-rose-400" />
              Upcoming Deadlines
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/assignments" className="text-xs">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {deadlines.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <Clock className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">Due: {d.due}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  d.due === "Tomorrow"
                    ? "bg-red-500/15 text-red-400"
                    : "bg-amber-500/15 text-amber-400"
                }`}>
                  {d.due === "Tomorrow" ? "Urgent" : "Upcoming"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Polls */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              Active Polls
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/polls" className="text-xs">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {activePolls.map((poll) => (
              <div
                key={poll.id}
                className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3 transition-colors hover:bg-purple-500/10"
              >
                <p className="text-sm font-medium">{poll.question}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {poll.votes} votes
                    </span>
                    <span>{poll.options} options</span>
                  </div>
                  <span className="text-purple-400 font-medium">{poll.deadline}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trending Marketplace — full width */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-orange-400" />
              Trending on Market
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/marketplace" className="text-xs">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {trendingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">by {item.seller}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5 ml-3">
                    <span className="rounded-lg bg-orange-500/10 px-2.5 py-1 text-sm font-semibold text-orange-400">
                      {item.price}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-400">
                      {item.discount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
