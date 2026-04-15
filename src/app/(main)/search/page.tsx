"use client";

import { useState, useMemo } from "react";
import { Search as SearchIcon, Megaphone, CalendarDays, BookOpen, ShoppingBag, User, ChevronRight, X, Frown } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

// Mock global database across domains
const searchDatabase = [
  // Notices
  { id: "n1", title: "Mid-Semester Exam Schedule Released", type: "Notices", link: "/notices", icon: Megaphone, subtitle: "Academic · Important", color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "n2", title: "Workshop on AI/ML Registration", type: "Notices", link: "/notices", icon: Megaphone, subtitle: "CSE · Urgent", color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "n3", title: "Library timings extended during exams", type: "Notices", link: "/notices", icon: Megaphone, subtitle: "General", color: "text-blue-400", bg: "bg-blue-500/10" },
  
  // Events
  { id: "e1", title: "Hackathon 2026", type: "Events", link: "/events", icon: CalendarDays, subtitle: "Main Auditorium · Apr 20", color: "text-green-400", bg: "bg-green-500/10" },
  { id: "e2", title: "Cultural Fest — Rhythm", type: "Events", link: "/events", icon: CalendarDays, subtitle: "Open Ground · Apr 25", color: "text-green-400", bg: "bg-green-500/10" },
  { id: "e3", title: "TEDxCampus", type: "Events", link: "/events", icon: CalendarDays, subtitle: "Seminar Hall 1 · Apr 28", color: "text-green-400", bg: "bg-green-500/10" },
  
  // Notes
  { id: "nt1", title: "Complete DSA Notes — All Modules", type: "Notes", link: "/notes", icon: BookOpen, subtitle: "CS301 · 86 pages", color: "text-teal-400", bg: "bg-teal-500/10" },
  { id: "nt2", title: "Operating Systems — Galvin Summary", type: "Notes", link: "/notes", icon: BookOpen, subtitle: "CS303 · 52 pages", color: "text-teal-400", bg: "bg-teal-500/10" },
  { id: "nt3", title: "DBMS Handwritten Notes + PYQs", type: "Notes", link: "/notes", icon: BookOpen, subtitle: "CS302 · 124 pages", color: "text-teal-400", bg: "bg-teal-500/10" },
  { id: "nt4", title: "Engineering Mathematics IV — Series", type: "Notes", link: "/notes", icon: BookOpen, subtitle: "MA401 · 94 pages", color: "text-teal-400", bg: "bg-teal-500/10" },

  // Marketplace
  { id: "m1", title: "Engineering Mathematics Textbook", type: "Marketplace", link: "/marketplace", icon: ShoppingBag, subtitle: "₹250 · Like New", color: "text-orange-400", bg: "bg-orange-500/10" },
  { id: "m2", title: "HP Laptop Charger (65W)", type: "Marketplace", link: "/marketplace", icon: ShoppingBag, subtitle: "₹400 · Good Condition", color: "text-orange-400", bg: "bg-orange-500/10" },
  { id: "m3", title: "Casio fx-991EX Calculator", type: "Marketplace", link: "/marketplace", icon: ShoppingBag, subtitle: "₹800 · Poor Condition", color: "text-orange-400", bg: "bg-orange-500/10" },

  // People
  { id: "p1", title: "Dr. Rajesh Kumar", type: "People", link: "/students", icon: User, subtitle: "Faculty · CSE Department", color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: "p2", title: "Anirban Das", type: "People", link: "/students", icon: User, subtitle: "Student · CSE Sem 6", color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: "p3", title: "Priya Sharma", type: "People", link: "/students", icon: User, subtitle: "Student · CSE Sem 6", color: "text-purple-400", bg: "bg-purple-500/10" },
];

const categories = ["All", "Notices", "Events", "Notes", "Marketplace", "People"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const results = useMemo(() => {
    if (!query.trim() && activeCategory === "All") return []; // empty state

    let filtered = searchDatabase;

    if (activeCategory !== "All") {
      filtered = filtered.filter(item => item.type === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(q) || 
          item.subtitle.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [query, activeCategory]);

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <p className="text-sm text-muted-foreground">Find notices, events, notes, people &amp; more seamlessly.</p>
      </div>
      
      {/* Search Bar */}
      <div className="relative group">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Type to search across everything..."
          className="h-14 pl-12 text-base rounded-2xl border-border/60 bg-card/50 backdrop-blur-sm shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-all"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveCategory(tag)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeCategory === tag 
                ? "bg-primary/15 text-primary border-primary/30" 
                : "border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results Area */}
      <div className="pt-2">
        {!query && activeCategory === "All" ? (
          <div className="py-16 text-center animate-in fade-in">
            <div className="h-16 w-16 bg-accent/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">
              Start typing to search across your entire campus ecosystem...
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {results.length} result{results.length === 1 ? "" : "s"} found
            </p>
            {results.map((result, idx) => (
              <Link key={result.id} href={result.link}>
                <Card 
                  className="border-border/50 hover:bg-accent/30 transition-all duration-200 group cursor-pointer"
                  style={{
                    animationDelay: `${idx * 40}ms`,
                    animation: "animate-in 0.3s ease-out both",
                  }}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${result.bg}`}>
                      <result.icon className={`h-5 w-5 ${result.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                        {result.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {result.subtitle}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border border-transparent ${result.bg} ${result.color}`}>
                        {result.type}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center animate-in fade-in">
             <div className="h-16 w-16 bg-accent/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Frown className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">No results found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
              We couldn&apos;t find anything matching &quot;<strong className="text-foreground">{query}</strong>&quot; in {activeCategory}. 
              Try a different keyword or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
