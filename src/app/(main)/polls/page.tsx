"use client";

import { useState } from "react";
import {
  BarChart3,
  Plus,
  Clock,
  Users,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Share2,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  description?: string;
  options: PollOption[];
  totalVotes: number;
  deadline: string;
  timeLeft: string;
  author: string;
  department: string;
  category: string;
  isActive: boolean;
  hasVoted: boolean;
  votedOption?: string;
  comments: number;
}

const demoPolls: Poll[] = [
  {
    id: "1",
    question: "Which canteen food item should be added to the menu?",
    description: "The campus canteen is expanding its menu. Vote for your favorite option!",
    options: [
      { id: "1a", text: "Chole Bhature", votes: 67 },
      { id: "1b", text: "Pav Bhaji", votes: 43 },
      { id: "1c", text: "Veg Biryani", votes: 89 },
      { id: "1d", text: "Pasta & Garlic Bread", votes: 52 },
    ],
    totalVotes: 251,
    deadline: "Apr 18, 2026",
    timeLeft: "3 days left",
    author: "Student Council",
    department: "General",
    category: "Campus Life",
    isActive: true,
    hasVoted: true,
    votedOption: "1c",
    comments: 34,
  },
  {
    id: "2",
    question: "Preferred timing for the upcoming AI/ML workshop?",
    options: [
      { id: "2a", text: "Weekday mornings (9 AM – 12 PM)", votes: 78 },
      { id: "2b", text: "Weekday afternoons (2 PM – 5 PM)", votes: 45 },
      { id: "2c", text: "Saturday full day (10 AM – 4 PM)", votes: 112 },
    ],
    totalVotes: 235,
    deadline: "Apr 16, 2026",
    timeLeft: "1 day left",
    author: "CSE Department",
    department: "CSE",
    category: "Academic",
    isActive: true,
    hasVoted: false,
    comments: 18,
  },
  {
    id: "3",
    question: "Should the library adopt a 24/7 schedule during exams?",
    options: [
      { id: "3a", text: "Yes, 24/7 access", votes: 203 },
      { id: "3b", text: "Extended till midnight", votes: 87 },
      { id: "3c", text: "Current timing is fine", votes: 24 },
    ],
    totalVotes: 314,
    deadline: "Apr 14, 2026",
    timeLeft: "Ended",
    author: "Library Committee",
    department: "Administration",
    category: "Facilities",
    isActive: false,
    hasVoted: true,
    votedOption: "3a",
    comments: 56,
  },
  {
    id: "4",
    question: "Rate the new Wi-Fi infrastructure upgrade",
    options: [
      { id: "4a", text: "⭐ Excellent — much faster", votes: 34 },
      { id: "4b", text: "👍 Good improvement", votes: 89 },
      { id: "4c", text: "😐 No difference noticed", votes: 156 },
      { id: "4d", text: "👎 Still poor", votes: 201 },
    ],
    totalVotes: 480,
    deadline: "Apr 12, 2026",
    timeLeft: "Ended",
    author: "IT Department",
    department: "IT",
    category: "Facilities",
    isActive: false,
    hasVoted: true,
    votedOption: "4c",
    comments: 89,
  },
];

const categoryColors: Record<string, string> = {
  "Campus Life": "text-pink-400 bg-pink-500/10",
  Academic: "text-blue-400 bg-blue-500/10",
  Facilities: "text-emerald-400 bg-emerald-500/10",
};

export default function PollsPage() {
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "active" | "ended">("all");

  const filteredPolls = demoPolls.filter((p) => {
    if (filter === "active") return p.isActive;
    if (filter === "ended") return !p.isActive;
    return true;
  });

  const handleVote = (pollId: string, optionId: string) => {
    setSelectedVotes((prev) => ({ ...prev, [pollId]: optionId }));
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Polls</h1>
          <p className="text-sm text-muted-foreground">
            Voice your opinion · {demoPolls.filter((p) => p.isActive).length} active polls
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Create Poll
        </Button>
      </div>

      {/* Anonymous badge */}
      <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5">
        <Shield className="h-4 w-4 text-primary" />
        <p className="text-xs text-muted-foreground">
          All votes are <strong className="text-foreground">completely anonymous</strong>. Your identity is never revealed.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "active", "ended"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-all duration-200 ${
              filter === f
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Polls list */}
      <div className="space-y-4">
        {filteredPolls.map((poll, idx) => {
          const userVote = selectedVotes[poll.id] || poll.votedOption;
          const showResults = poll.hasVoted || !!selectedVotes[poll.id] || !poll.isActive;
          const catStyle = categoryColors[poll.category] || "text-gray-400 bg-gray-500/10";

          return (
            <Card
              key={poll.id}
              className={`border-border/50 overflow-hidden transition-all duration-300 hover:border-border ${
                !poll.isActive ? "opacity-75" : ""
              }`}
              style={{
                animationDelay: `${idx * 80}ms`,
                animation: "animate-in 0.4s ease-out both",
              }}
            >
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-semibold leading-snug">{poll.question}</h3>
                    {poll.description && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {poll.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{poll.author}</span>
                      <span>·</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${catStyle}`}>
                        {poll.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        poll.isActive
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {poll.isActive ? "Active" : "Ended"}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {poll.timeLeft}
                    </span>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {poll.options.map((option) => {
                    const percentage =
                      poll.totalVotes > 0
                        ? Math.round((option.votes / poll.totalVotes) * 100)
                        : 0;
                    const isVoted = userVote === option.id;
                    const isWinner =
                      !poll.isActive &&
                      option.votes ===
                        Math.max(...poll.options.map((o) => o.votes));

                    return (
                      <button
                        key={option.id}
                        onClick={() =>
                          poll.isActive &&
                          !poll.hasVoted &&
                          handleVote(poll.id, option.id)
                        }
                        disabled={!poll.isActive || poll.hasVoted}
                        className={`relative w-full overflow-hidden rounded-xl border p-3 text-left transition-all duration-200 ${
                          isVoted
                            ? "border-primary/40 bg-primary/5"
                            : "border-border/50 hover:border-border hover:bg-accent/30"
                        } ${
                          !poll.isActive && !poll.hasVoted
                            ? "cursor-default"
                            : poll.isActive && !poll.hasVoted
                            ? "cursor-pointer"
                            : "cursor-default"
                        }`}
                      >
                        {/* Background progress bar */}
                        {showResults && (
                          <div
                            className={`absolute inset-0 transition-all duration-700 ease-out ${
                              isVoted
                                ? "bg-primary/10"
                                : isWinner
                                ? "bg-emerald-500/8"
                                : "bg-accent/30"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        )}

                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isVoted && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                            <span
                              className={`text-sm ${
                                isVoted ? "font-semibold" : "font-medium"
                              }`}
                            >
                              {option.text}
                            </span>
                          </div>
                          {showResults && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">
                                {option.votes} votes
                              </span>
                              <span
                                className={`font-bold ${
                                  isVoted
                                    ? "text-primary"
                                    : isWinner
                                    ? "text-emerald-400"
                                    : "text-foreground"
                                }`}
                              >
                                {percentage}%
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {poll.totalVotes} votes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {poll.comments} comments
                    </span>
                  </div>
                  <button className="flex items-center gap-1 transition-colors hover:text-primary">
                    <Share2 className="h-3 w-3" />
                    Share
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
