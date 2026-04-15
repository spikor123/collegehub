"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  BookOpen,
  GraduationCap,
  Trophy,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: "class" | "exam" | "event" | "deadline" | "holiday";
  location?: string;
  color: string;
  bgColor: string;
}

type EventMap = Record<string, CalendarEvent[]>;

// Current month demo data (April 2026)
const monthEvents: EventMap = {
  "2026-04-15": [
    {
      id: "1",
      title: "Data Structures Lab",
      time: "9:00 AM – 11:00 AM",
      type: "class",
      location: "Lab 3",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "2",
      title: "DBMS Lecture",
      time: "2:00 PM – 3:30 PM",
      type: "class",
      location: "Room 204",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
  ],
  "2026-04-17": [
    {
      id: "3",
      title: "Assignment Submission — OS",
      time: "11:59 PM",
      type: "deadline",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
  ],
  "2026-04-20": [
    {
      id: "4",
      title: "Hackathon 2026",
      time: "9:00 AM – Apr 21",
      type: "event",
      location: "Main Auditorium",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ],
  "2026-04-22": [
    {
      id: "5",
      title: "Mock Placement Interviews",
      time: "2:00 PM – 5:00 PM",
      type: "event",
      location: "T&P Block",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      id: "6",
      title: "Guest Lecture — Blockchain",
      time: "11:00 AM – 12:30 PM",
      type: "event",
      location: "Seminar Hall 2",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ],
  "2026-04-25": [
    {
      id: "7",
      title: "Cultural Fest — Rhythm",
      time: "All Day",
      type: "event",
      location: "Campus Ground",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
  ],
  "2026-04-28": [
    {
      id: "8",
      title: "Mid-Sem Exams Begin",
      time: "9:00 AM",
      type: "exam",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
  ],
  "2026-04-30": [
    {
      id: "9",
      title: "DBMS Mid-Sem Exam",
      time: "9:00 AM – 12:00 PM",
      type: "exam",
      location: "Exam Hall A",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
  ],
};

const typeIcons = {
  class: BookOpen,
  exam: GraduationCap,
  event: Trophy,
  deadline: Megaphone,
  holiday: CalendarDays,
};

const typeLabels = {
  class: "Class",
  exam: "Exam",
  event: "Event",
  deadline: "Deadline",
  holiday: "Holiday",
};

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(3); // April = 3 (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string | null>("2026-04-15");

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedEvents = selectedDate ? monthEvents[selectedDate] || [] : [];

  // Upcoming events for sidebar
  const allUpcoming = Object.entries(monthEvents)
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([date, events]) =>
      events.map((e) => ({ ...e, date }))
    );

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground">
          College calendar, timetable &amp; deadlines
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">
              {monthNames[currentMonth]} {currentYear}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setCurrentMonth(today.getMonth());
                  setCurrentYear(today.getFullYear());
                  setSelectedDate(todayKey);
                }}
              >
                Today
              </Button>
              <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7">
              {/* Empty cells for days before the 1st */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-14 border-t border-border/30" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = formatDateKey(currentYear, currentMonth, day);
                const dayEvents = monthEvents[dateKey] || [];
                const isToday = dateKey === "2026-04-15"; // simulated today
                const isSelected = selectedDate === dateKey;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`relative flex h-14 flex-col items-center rounded-lg border-t border-border/30 pt-1 transition-all duration-200 hover:bg-accent/50 ${
                      isSelected
                        ? "bg-primary/10 ring-1 ring-primary/30"
                        : ""
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                        isToday
                          ? "bg-primary font-bold text-primary-foreground"
                          : isSelected
                          ? "font-semibold text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {day}
                    </span>
                    {/* Event dots */}
                    {dayEvents.length > 0 && (
                      <div className="mt-0.5 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((ev) => (
                          <div
                            key={ev.id}
                            className={`h-1.5 w-1.5 rounded-full ${ev.bgColor.replace("/10", "/60")}`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 border-t border-border/30 pt-3">
              {(
                [
                  { label: "Class", color: "bg-blue-400" },
                  { label: "Exam", color: "bg-red-400" },
                  { label: "Event", color: "bg-purple-400" },
                  { label: "Deadline", color: "bg-orange-400" },
                ] as const
              ).map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                >
                  <div className={`h-2 w-2 rounded-full ${item.color}`} />
                  {item.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Details / Upcoming */}
        <div className="space-y-4">
          {selectedDate && (
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedEvents.length > 0 ? (
                  selectedEvents.map((ev) => {
                    const Icon = typeIcons[ev.type];
                    return (
                      <div
                        key={ev.id}
                        className={`rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent/30 ${ev.bgColor}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${ev.bgColor}`}
                          >
                            <Icon className={`h-3.5 w-3.5 ${ev.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{ev.title}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-0.5">
                                <Clock className="h-2.5 w-2.5" />
                                {ev.time}
                              </span>
                              {ev.location && (
                                <span className="flex items-center gap-0.5">
                                  <MapPin className="h-2.5 w-2.5" />
                                  {ev.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${ev.color} ${ev.bgColor}`}
                          >
                            {typeLabels[ev.type]}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No events on this day
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Upcoming events list */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">All This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {allUpcoming.map((ev) => {
                const Icon = typeIcons[ev.type];
                const dateStr = new Date(ev.date + "T00:00:00").toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                });
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedDate(ev.date)}
                    className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-accent/50"
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${ev.bgColor}`}
                    >
                      <Icon className={`h-3 w-3 ${ev.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{ev.title}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {dateStr}
                    </span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
