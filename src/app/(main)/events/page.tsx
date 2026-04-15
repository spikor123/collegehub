"use client";

import { useState } from "react";
import {
  CalendarDays,
  Plus,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  Ticket,
  Star,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  day: string;
  month: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxCapacity: number;
  category: string;
  color: string;
  bgColor: string;
  featured: boolean;
}

const demoEvents: Event[] = [
  {
    id: "1",
    title: "Hackathon 2026 — Code For Change",
    description:
      "36-hour national-level hackathon. Build innovative solutions for real-world problems. Prizes worth ₹2,00,000. Teams of 2–4 from any branch welcome.",
    date: "20",
    day: "Sunday",
    month: "Apr",
    time: "9:00 AM – Apr 21, 9:00 PM",
    location: "Main Auditorium & CS Labs",
    organizer: "Coding Club",
    attendees: 186,
    maxCapacity: 200,
    category: "Tech",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    featured: true,
  },
  {
    id: "2",
    title: "Cultural Fest — Rhythm 2026",
    description:
      "Annual cultural extravaganza featuring dance, music, drama, art and fashion competitions. Celebrity night with DJ performances.",
    date: "25",
    day: "Friday",
    month: "Apr",
    time: "10:00 AM – 10:00 PM",
    location: "Open Air Theatre & Campus Ground",
    organizer: "Cultural Committee",
    attendees: 520,
    maxCapacity: 1000,
    category: "Cultural",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    featured: true,
  },
  {
    id: "3",
    title: "Campus Placement Prep — Mock Interviews",
    description:
      "Practice your interview skills with alumni from top companies. Slots for technical, HR, and group discussions.",
    date: "22",
    day: "Tuesday",
    month: "Apr",
    time: "2:00 PM – 5:00 PM",
    location: "Training & Placement Block",
    organizer: "T&P Cell",
    attendees: 89,
    maxCapacity: 120,
    category: "Career",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    featured: false,
  },
  {
    id: "4",
    title: "TEDxCampus — Ideas Worth Sharing",
    description:
      "Inspiring talks from entrepreneurs, researchers, and thought leaders. This year's theme: 'Breaking Boundaries'.",
    date: "28",
    day: "Monday",
    month: "Apr",
    time: "11:00 AM – 4:00 PM",
    location: "Seminar Hall 1",
    organizer: "TEDx Committee",
    attendees: 145,
    maxCapacity: 200,
    category: "Talk",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    featured: true,
  },
  {
    id: "5",
    title: "Intra-College Cricket Tournament",
    description:
      "T20 tournament between departments. Register your team of 11+4 players. Exciting prizes for the winning team and best individual performances.",
    date: "1",
    day: "Thursday",
    month: "May",
    time: "7:00 AM – 6:00 PM",
    location: "College Cricket Ground",
    organizer: "Sports Committee",
    attendees: 220,
    maxCapacity: 300,
    category: "Sports",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    featured: false,
  },
  {
    id: "6",
    title: "Cloud Computing Workshop by AWS",
    description:
      "Hands-on workshop on AWS services — EC2, S3, Lambda, and DynamoDB. Get your AWS certification voucher on completion.",
    date: "3",
    day: "Saturday",
    month: "May",
    time: "10:00 AM – 4:00 PM",
    location: "Computer Lab 3",
    organizer: "AWS Student Club",
    attendees: 56,
    maxCapacity: 60,
    category: "Tech",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    featured: false,
  },
];

const categories = ["All", "Tech", "Cultural", "Career", "Sports", "Talk"];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? demoEvents
      : demoEvents.filter((e) => e.category === activeCategory);

  const featured = filtered.filter((e) => e.featured);
  const upcoming = filtered.filter((e) => !e.featured);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground">
            Discover what&apos;s happening on campus
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeCategory === cat
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Events */}
      {featured.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            Featured
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((event, idx) => (
              <Card
                key={event.id}
                className={`group border-border/50 overflow-hidden transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5`}
                style={{
                  animationDelay: `${idx * 80}ms`,
                  animation: "animate-in 0.4s ease-out both",
                }}
              >
                {/* Gradient top bar */}
                <div
                  className={`h-1.5 ${event.bgColor}`}
                  style={{
                    background: `linear-gradient(90deg, hsl(var(--primary)), hsl(280 90% 65%))`,
                  }}
                />
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    {/* Date card */}
                    <div
                      className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl ${event.bgColor} transition-transform duration-200 group-hover:scale-105`}
                    >
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${event.color}`}
                      >
                        {event.month}
                      </span>
                      <span className={`text-2xl font-bold leading-none ${event.color}`}>
                        {event.date}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full border ${event.bgColor} ${event.color} px-2 py-0.5 text-[10px] font-semibold`}
                        >
                          {event.category}
                        </span>
                      </div>

                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>
                            {event.attendees}/{event.maxCapacity} registered
                          </span>
                          {/* Progress bar */}
                          <div className="ml-1 h-1.5 w-16 overflow-hidden rounded-full bg-accent">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-500"
                              style={{
                                width: `${
                                  (event.attendees / event.maxCapacity) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 gap-1 text-xs"
                        >
                          <Ticket className="h-3 w-3" />
                          Register
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Upcoming
          </h2>
          <div className="space-y-3">
            {upcoming.map((event, idx) => (
              <Card
                key={event.id}
                className="group border-border/50 transition-all duration-300 hover:border-border"
                style={{
                  animationDelay: `${(featured.length + idx) * 80}ms`,
                  animation: "animate-in 0.4s ease-out both",
                }}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Date */}
                  <div
                    className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl ${event.bgColor} transition-transform duration-200 group-hover:scale-105`}
                  >
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider ${event.color}`}
                    >
                      {event.month}
                    </span>
                    <span className={`text-xl font-bold leading-none ${event.color}`}>
                      {event.date}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full ${event.bgColor} ${event.color} px-2 py-0.5 text-[10px] font-semibold`}
                      >
                        {event.category}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.attendees}/{event.maxCapacity}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="hidden sm:flex h-8 gap-1 text-xs"
                  >
                    <Ticket className="h-3 w-3" />
                    Register
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
