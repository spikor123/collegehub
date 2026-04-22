"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  GraduationCap,
  Trophy,
  Megaphone,
  User,
  Plus,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: "class" | "exam" | "event" | "deadline" | "holiday" | "personal";
  color: string;
  bgColor: string;
  date: string;
}

const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Data Structures Lab",
    time: "9:00 AM – 11:00 AM",
    type: "class",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    date: "2026-04-15",
  },
  {
    id: "3",
    title: "Assignment Submission — OS",
    time: "11:59 PM",
    type: "deadline",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    date: "2026-04-17",
  },
  {
    id: "4",
    title: "Hackathon 2026",
    time: "9:00 AM – Apr 21",
    type: "event",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    date: "2026-04-20",
  },
];

const typeIcons = {
  class: BookOpen,
  exam: GraduationCap,
  event: Trophy,
  deadline: Megaphone,
  holiday: CalendarDays,
  personal: User,
};

const typeLabels = {
  class: "Class",
  exam: "Exam",
  event: "Event",
  deadline: "Deadline",
  holiday: "Holiday",
  personal: "Personal",
};

const typeColors = {
    class: "bg-blue-400",
    exam: "bg-red-400",
    event: "bg-purple-400",
    deadline: "bg-orange-400",
    holiday: "bg-green-400",
    personal: "bg-indigo-400",
};

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
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
  const [currentMonth, setCurrentMonth] = useState(3); // April
  const [selectedDate, setSelectedDate] = useState<string | null>("2026-04-10");
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("collegehub-calendar-v3-events");
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("collegehub-calendar-v3-events", JSON.stringify(events));
  }, [events]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM");
  const [newType, setNewType] = useState<CalendarEvent["type"]>("class");
  const [isAdding, setIsAdding] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const goToToday = () => {
    const d = new Date();
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
    setSelectedDate(formatDateKey(d.getFullYear(), d.getMonth(), d.getDate()));
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    setIsAdding(true);
    await new Promise(r => setTimeout(r, 500));

    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      time: newTime,
      type: newType,
      date: selectedDate,
      color: "text-primary",
      bgColor: "bg-primary/10",
    };

    setEvents([...events, newEvent]);
    setIsAdding(false);
    setIsDialogOpen(false);
    setNewTitle("");
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const selectedEvents = events.filter(e => e.date === selectedDate);
  const monthlyEvents = events
    .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground text-sm">College calendar, timetable & deadlines</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20 h-11 px-6 font-bold active-scale">
              <Plus className="h-5 w-5" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>
                {selectedDate ? `Adding for ${new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { day: 'numeric', month: 'long' })}` : "Select a date first"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEvent} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required placeholder="Event name..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Time</Label>
                    <Input value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Type</Label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as any)}
                    >
                        {Object.entries(typeLabels).map(([val, lab]) => (
                            <option key={val} value={val}>{lab}</option>
                        ))}
                    </select>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 font-bold mt-2" disabled={isAdding || !selectedDate}>
                {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Event"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Calendar Grid */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card rounded-2xl overflow-hidden shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <CardTitle className="text-xl font-bold">
                {monthNames[currentMonth]} {currentYear}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-lg">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm" onClick={goToToday} className="h-8 px-4 rounded-lg font-medium">
                  Today
                </Button>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-lg">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 mb-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-[10px] font-bold text-muted-foreground tracking-widest">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateKey = formatDateKey(currentYear, currentMonth, day);
                  const hasEvents = events.some(e => e.date === dateKey);
                  const isSelected = selectedDate === dateKey;
                  const isToday = dateKey === formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateKey)}
                      className={`relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                        isSelected 
                          ? "bg-primary/20 text-primary border-2 border-primary shadow-inner" 
                          : "hover:bg-muted/50 border border-transparent"
                      }`}
                    >
                      <span className={`text-sm font-semibold ${isToday && !isSelected ? "text-primary underline underline-offset-4 decoration-2" : ""}`}>
                        {day}
                      </span>
                      {hasEvents && (
                        <div className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-10 pt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-4">
                    {Object.entries(typeLabels).slice(0, 4).map(([type, label]) => (
                        <div key={type} className="flex items-center gap-2">
                            <div className={`h-2.5 w-2.5 rounded-full ${typeColors[type as keyof typeof typeColors]}`} />
                            <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
                        </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details & List */}
        <div className="space-y-6">
          {/* Selected Date Card */}
          <Card className="border-border/50 bg-card rounded-2xl shadow-md">
            <CardHeader className="pb-4">
               <CardTitle className="text-sm font-bold flex items-center gap-2">
                 <CalendarDays className="h-4 w-4 text-primary" />
                 {selectedDate ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", {
                    weekday: 'long', day: 'numeric', month: 'long'
                 }) : "Select a date"}
               </CardTitle>
            </CardHeader>
            <CardContent>
               {selectedEvents.length > 0 ? (
                 <div className="space-y-3">
                    {selectedEvents.map(ev => {
                        const Icon = typeIcons[ev.type];
                        return (
                            <div key={ev.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-lg ${ev.bgColor} flex items-center justify-center border border-white/5`}>
                                        <Icon className={`h-4 w-4 ${ev.color}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate">{ev.title}</p>
                                        <p className="text-[10px] text-muted-foreground">{ev.time}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteEvent(ev.id)}>
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                            </div>
                        )
                    })}
                 </div>
               ) : (
                 <p className="text-sm text-muted-foreground text-center py-4">No events on this day</p>
               )}
            </CardContent>
          </Card>

          {/* Monthly List Card */}
          <Card className="border-border/50 bg-card rounded-2xl shadow-md flex-1">
             <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold">All This Month</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {monthlyEvents.length > 0 ? (
                  monthlyEvents.map(ev => {
                    const Icon = typeIcons[ev.type];
                    return (
                        <div key={ev.id} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`h-8 w-8 rounded-lg ${ev.bgColor} flex items-center justify-center shrink-0`}>
                                    <Icon className={`h-4 w-4 ${ev.color}`} />
                                </div>
                                <p className="text-sm font-medium truncate">{ev.title}</p>
                            </div>
                            <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
                                {new Date(ev.date + "T00:00:00").toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-8">No events scheduled this month</p>
                )}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
