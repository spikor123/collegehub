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
  Plus,
  Loader2,
  CheckCircle2,
  User,
  Globe,
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
  location?: string;
  color: string;
  bgColor: string;
  isPublic: boolean;
  date: string;
}

const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Data Structures Lab",
    time: "9:00 AM – 11:00 AM",
    type: "class",
    location: "Lab 3",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    isPublic: true,
    date: "2026-04-15",
  },
  {
    id: "3",
    title: "Assignment Submission — OS",
    time: "11:59 PM",
    type: "deadline",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    isPublic: true,
    date: "2026-04-17",
  },
  {
    id: "4",
    title: "Hackathon 2026",
    time: "9:00 AM – Apr 21",
    type: "event",
    location: "Main Auditorium",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    isPublic: true,
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
  const { role } = useAuthStore();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(3); // April = 3
  const [selectedDate, setSelectedDate] = useState<string | null>("2026-04-15");
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  // New Event Form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM");
  const [newType, setNewType] = useState<CalendarEvent["type"]>("personal");
  const [newIsPublic, setNewIsPublic] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedEvents = events.filter(e => e.date === selectedDate);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    
    setIsAdding(true);
    await new Promise(r => setTimeout(r, 800));

    const colorMap = {
      class: { color: "text-blue-400", bg: "bg-blue-500/10" },
      exam: { color: "text-red-400", bg: "bg-red-500/10" },
      event: { color: "text-purple-400", bg: "bg-purple-500/10" },
      deadline: { color: "text-orange-400", bg: "bg-orange-500/10" },
      holiday: { color: "text-green-400", bg: "bg-green-500/10" },
      personal: { color: "text-indigo-400", bg: "bg-indigo-500/10" },
    };

    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      time: newTime,
      type: newType,
      isPublic: role === "student" ? false : newIsPublic,
      date: selectedDate,
      ...colorMap[newType],
    };

    setEvents([...events, newEvent]);
    setIsAdding(false);
    setIsDialogOpen(false);
    setNewTitle("");
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6 animate-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Academic Calendar</h1>
          <p className="text-sm text-muted-foreground">
             Manage your personal schedule and campus events.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
             <Button size="sm" className="gap-2 active-scale shadow-lg shadow-primary/20">
               <Plus className="h-4 w-4" /> Add to {selectedDate ? new Date(selectedDate + "T00:00:00").getDate() : ""} {monthNames[currentMonth].slice(0,3)}
             </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>New Calendar Item</DialogTitle>
              <DialogDescription>
                Add an event for {selectedDate}. {role === "student" ? "Personal events are only visible to you." : "Teachers can set public events."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEvent} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Event Title</Label>
                <Input placeholder="e.g. Study with Group" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
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
                       <option value="personal">Personal</option>
                       <option value="class">Class</option>
                       <option value="deadline">Deadline</option>
                       <option value="event">Campus Event</option>
                    </select>
                 </div>
              </div>
              
              {(role === "teacher" || role === "admin") && (
                <div className="flex items-center gap-2 py-2">
                   <input 
                      type="checkbox" 
                      id="isPub" 
                      className="h-4 w-4 rounded border-gray-300 text-primary" 
                      checked={newIsPublic}
                      onChange={(e) => setNewIsPublic(e.target.checked)}
                   />
                   <Label htmlFor="isPub">Visible to all students (Public)</Label>
                </div>
              )}

              <DialogFooter className="pt-4">
                 <Button type="submit" className="w-full h-11" disabled={isAdding}>
                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    Confirm Event
                 </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <Card className="border-border/50 lg:col-span-2 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl font-bold">
              {monthNames[currentMonth]} {currentYear}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={prevMonth} className="h-9 w-9">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={nextMonth} className="h-9 w-9">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="py-2 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-px rounded-xl overflow-hidden border border-border/30 bg-border/20">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 lg:h-20 bg-background/40" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = formatDateKey(currentYear, currentMonth, day);
                const dayEvents = events.filter(e => e.date === dateKey);
                const isSelected = selectedDate === dateKey;
                const isToday = dateKey === todayKey;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`relative flex h-16 lg:h-20 flex-col items-start px-2 py-1 transition-all duration-200 hover:bg-primary/5 bg-background/80 ${
                      isSelected ? "bg-primary/[0.07] ring-1 ring-inset ring-primary/30 z-10" : ""
                    }`}
                  >
                    <span className={`text-xs font-bold ${
                      isToday ? "bg-primary text-primary-foreground h-6 w-6 flex items-center justify-center rounded-full" : 
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {day}
                    </span>
                    {/* Compact event list for grid */}
                    <div className="mt-1 w-full space-y-0.5 overflow-hidden">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`h-1.5 lg:h-4 w-full rounded-md ${ev.bgColor} px-1 truncate flex items-center`}
                        >
                           <span className={`hidden lg:block text-[9px] font-bold ${ev.color} truncate`}>{ev.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[8px] font-bold text-muted-foreground/60 text-center">+ {dayEvents.length - 2}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Details / Upcoming */}
        <div className="space-y-4">
          <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
            {selectedDate ? (
              <>
                <CardHeader className="pb-3 border-b border-border/30">
                  <CardTitle className="text-sm font-bold flex flex-col">
                    <span className="text-primary uppercase tracking-widest text-[10px]">Agenda for</span>
                    <span className="text-lg">
                      {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", {
                        day: "numeric", month: "long"
                      })}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {selectedEvents.length > 0 ? (
                    selectedEvents.map((ev) => {
                      const Icon = typeIcons[ev.type];
                      return (
                        <div
                          key={ev.id}
                          className={`group relative rounded-2xl border border-border/50 p-4 transition-all hover:shadow-lg hover:shadow-primary/5 ${ev.bgColor} border-l-4 ${ev.color.replace('text', 'border')}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ev.bgColor} border border-white/10`}>
                              <Icon className={`h-5 w-5 ${ev.color}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold leading-tight">{ev.title}</p>
                              <div className="mt-2 flex items-center gap-3 text-[10px] uppercase font-bold text-muted-foreground/70">
                                <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {ev.time}</span>
                                {ev.isPublic ? (
                                  <span className="flex items-center gap-1 text-emerald-400"><Globe className="h-3 w-3" /> Public</span>
                                ) : (
                                  <span className="flex items-center gap-1 text-indigo-400"><User className="h-3 w-3" /> Personal</span>
                                )}
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => deleteEvent(ev.id)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive transition-all"
                            >
                               <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-10 text-center">
                       <p className="text-sm font-bold text-muted-foreground/40">FREE DAY</p>
                       <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mt-1 tracking-widest">No activities scheduled</p>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
               <CardContent className="py-20 text-center">
                  <CalendarDays className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-xs font-bold text-muted-foreground/60">SELECT A DATE</p>
               </CardContent>
            )}
          </Card>

          {/* This Month's Summary */}
          <Card className="border-border/50 bg-primary/5 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Monthly Pulse</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex justify-around items-center py-2">
                  <div className="text-center">
                     <p className="text-xl font-bold">{events.filter(e => e.isPublic).length}</p>
                     <p className="text-[9px] font-bold text-muted-foreground uppercase">Campus</p>
                  </div>
                  <div className="h-8 w-px bg-border/50" />
                  <div className="text-center">
                     <p className="text-xl font-bold text-indigo-400">{events.filter(e => !e.isPublic).length}</p>
                     <p className="text-[9px] font-bold text-muted-foreground uppercase">Personal</p>
                  </div>
                  <div className="h-8 w-px bg-border/50" />
                  <div className="text-center">
                     <p className="text-xl font-bold text-rose-400">{events.filter(e => e.type === 'exam' || e.type === 'deadline').length}</p>
                     <p className="text-[9px] font-bold text-muted-foreground uppercase">Criticial</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
