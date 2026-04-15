"use client";

import { useState } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Pin,
  AlertTriangle,
  Sparkles,
  Clock,
  User,
  ChevronDown,
  Eye,
  MessageSquare,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type Priority = "urgent" | "important" | "normal";

interface Notice {
  id: string;
  title: string;
  body: string;
  priority: Priority;
  is_pinned: boolean;
  author: string;
  department: string;
  created_at: string;
  views: number;
  comments: number;
  tags: string[];
}

const demoNotices: Notice[] = [
  {
    id: "1",
    title: "Mid-Semester Examination Schedule — April 2026",
    body: "The mid-semester examinations for all branches will commence from April 28, 2026. Students are advised to collect their hall tickets from the examination cell by April 25. Seating arrangement will be published on the notice board by April 26.",
    priority: "urgent",
    is_pinned: true,
    author: "Dr. Priya Sharma",
    department: "Examination Cell",
    created_at: "2 hours ago",
    views: 847,
    comments: 23,
    tags: ["Exams", "Important"],
  },
  {
    id: "2",
    title: "Workshop on AI/ML & Generative AI — Registration Open",
    body: "The Department of Computer Science is organizing a 3-day workshop on Artificial Intelligence, Machine Learning, and Generative AI from May 5–7, 2026. Industry experts from Google and Microsoft will be conducting sessions. Limited seats available — register now.",
    priority: "important",
    is_pinned: true,
    author: "Prof. Rahul Verma",
    department: "CSE Department",
    created_at: "5 hours ago",
    views: 612,
    comments: 45,
    tags: ["Workshop", "CSE", "AI/ML"],
  },
  {
    id: "3",
    title: "Library Timings Extended During Examination Period",
    body: "The central library will remain open from 7:00 AM to 11:00 PM during the examination period (April 28 – May 15). Students are requested to maintain silence and carry their ID cards.",
    priority: "normal",
    is_pinned: false,
    author: "Mr. Anil Kumar",
    department: "Library",
    created_at: "1 day ago",
    views: 324,
    comments: 8,
    tags: ["Library", "Exams"],
  },
  {
    id: "4",
    title: "Campus Placement Drive — Infosys & TCS",
    body: "Infosys and TCS will be visiting our campus for placements on May 10, 2026. Eligible students (CGPA ≥ 7.0, no active backlogs) must register on the placement portal before May 5. Pre-placement talk on May 9.",
    priority: "important",
    is_pinned: false,
    author: "Dr. Meena Gupta",
    department: "Training & Placement",
    created_at: "2 days ago",
    views: 1203,
    comments: 67,
    tags: ["Placements", "Career"],
  },
  {
    id: "5",
    title: "Annual Sports Meet 2026 — Team Registrations",
    body: "Registrations are open for the Annual Sports Meet scheduled from May 20–22. Events include cricket, football, badminton, athletics, and chess. Team registrations close on May 12.",
    priority: "normal",
    is_pinned: false,
    author: "Mr. Vikram Singh",
    department: "Sports Committee",
    created_at: "3 days ago",
    views: 456,
    comments: 19,
    tags: ["Sports", "Events"],
  },
  {
    id: "6",
    title: "Fee Payment Deadline Extended to April 20",
    body: "The last date for payment of tuition fees for the current semester has been extended to April 20, 2026. Late fee of ₹500 will apply after this date. Pay via the online portal or at the accounts office.",
    priority: "urgent",
    is_pinned: false,
    author: "Accounts Office",
    department: "Administration",
    created_at: "3 days ago",
    views: 987,
    comments: 34,
    tags: ["Fees", "Deadline"],
  },
  {
    id: "7",
    title: "Guest Lecture — Blockchain in Financial Systems",
    body: "A guest lecture on 'Blockchain Technology in Modern Financial Systems' will be delivered by Mr. Arjun Patel, CTO of FinBlock Solutions, on April 22 at 11 AM in Seminar Hall 2.",
    priority: "normal",
    is_pinned: false,
    author: "Prof. Deepak Joshi",
    department: "ECE Department",
    created_at: "4 days ago",
    views: 198,
    comments: 12,
    tags: ["Guest Lecture", "Blockchain"],
  },
];

const priorityConfig = {
  urgent: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
    icon: AlertTriangle,
    label: "Urgent",
  },
  important: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    icon: Sparkles,
    label: "Important",
  },
  normal: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    icon: Megaphone,
    label: "General",
  },
};

const filters = ["All", "Urgent", "Important", "General", "Pinned"];

export default function NoticesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredNotices = demoNotices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Pinned") return notice.is_pinned && matchesSearch;
    if (activeFilter === "Urgent")
      return notice.priority === "urgent" && matchesSearch;
    if (activeFilter === "Important")
      return notice.priority === "important" && matchesSearch;
    if (activeFilter === "General")
      return notice.priority === "normal" && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notice Board</h1>
          <p className="text-sm text-muted-foreground">
            Stay updated with {demoNotices.length} college announcements
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Post Notice
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notices, tags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeFilter === f
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {f}
              {f === "Pinned" && (
                <Pin className="ml-1 inline h-3 w-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {filteredNotices.map((notice, idx) => {
          const config = priorityConfig[notice.priority];
          const isExpanded = expandedId === notice.id;

          return (
            <Card
              key={notice.id}
              className={`border-border/50 overflow-hidden transition-all duration-300 hover:border-border ${config.border}`}
              style={{
                animationDelay: `${idx * 60}ms`,
                animation: "animate-in 0.4s ease-out both",
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Priority indicator */}
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bg}`}
                  >
                    {notice.is_pinned ? (
                      <Pin className={`h-4 w-4 ${config.color}`} />
                    ) : (
                      <config.icon className={`h-4 w-4 ${config.color}`} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : notice.id)
                          }
                          className="text-left"
                        >
                          <h3 className="text-sm font-semibold leading-snug hover:text-primary transition-colors">
                            {notice.title}
                          </h3>
                        </button>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {notice.is_pinned && (
                          <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            <Pin className="h-2.5 w-2.5" />
                            Pinned
                          </span>
                        )}
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${config.badge}`}
                        >
                          {config.label}
                        </span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {notice.author}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{notice.department}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notice.created_at}
                      </span>
                    </div>

                    {/* Body (expandable) */}
                    <div
                      className={`mt-2.5 overflow-hidden transition-all duration-300 ${
                        isExpanded ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {notice.body}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {notice.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-accent/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {notice.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {notice.comments}
                        </span>
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : notice.id)
                          }
                          className="flex items-center gap-0.5 text-primary hover:underline"
                        >
                          {isExpanded ? "Less" : "Read more"}
                          <ChevronDown
                            className={`h-3 w-3 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredNotices.length === 0 && (
          <Card className="border-border/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No notices found</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try adjusting your search or filter to find what you&apos;re
                looking for.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
