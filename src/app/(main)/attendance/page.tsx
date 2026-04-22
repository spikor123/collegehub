"use client";

import { useState } from "react";
import {
  CheckSquare,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Target,
  BookOpen,
  ChevronDown,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";

// ——— Simple Components ———
function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full bg-accent/50 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-500 ease-out`} 
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

// ——— Student Analytics View ———
interface SubjectAttendance {
  code: string; name: string; totalClasses: number; attended: number;
  percentage: number; faculty: string;
}

const studentAttendance: SubjectAttendance[] = [
  { code: "CS301", name: "Data Structures & Algorithms", totalClasses: 42, attended: 38, percentage: 90, faculty: "Dr. Rajesh Kumar" },
  { code: "CS302", name: "Database Management Systems", totalClasses: 38, attended: 29, percentage: 76, faculty: "Prof. Sunita Verma" },
  { code: "CS303", name: "Operating Systems", totalClasses: 40, attended: 26, percentage: 65, faculty: "Dr. Amit Patel" },
  { code: "CS304", name: "Computer Networks", totalClasses: 36, attended: 34, percentage: 94, faculty: "Dr. Neha Gupta" },
  { code: "MA401", name: "Engineering Mathematics IV", totalClasses: 44, attended: 33, percentage: 75, faculty: "Prof. Deepak Joshi" },
  { code: "CS305", name: "Software Engineering", totalClasses: 34, attended: 30, percentage: 88, faculty: "Dr. Meena Gupta" },
];

function classesNeeded(sub: SubjectAttendance): number {
  if (sub.percentage >= 75) return 0;
  return Math.max(Math.ceil((0.75 * sub.totalClasses - sub.attended) / (1 - 0.75)), 0);
}

function StudentAnalytics() {
  const overallAttendance = Math.round(studentAttendance.reduce((s, a) => s + a.percentage, 0) / studentAttendance.length);
  const atRisk = studentAttendance.filter(s => s.percentage < 75);

  return (
    <div className="space-y-8 animate-in pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">Attendance</h1>
        <p className="text-muted-foreground font-medium">Your academic presence report</p>
      </div>

      {/* Main Stats Card */}
      <Card className="border-border/40 bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/30">
            <div className="p-6 flex flex-col items-center justify-center text-center space-y-2">
              <span className={`text-5xl font-black ${overallAttendance >= 75 ? "text-primary" : "text-rose-500"}`}>
                {overallAttendance}%
              </span>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">Overall Attendance</p>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-4xl font-black">{studentAttendance.length}</span>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">Active Subjects</p>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center space-y-2">
              <span className={`text-4xl font-black ${atRisk.length > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                {atRisk.length}
              </span>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">Subjects At Risk</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning Alert */}
      {atRisk.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-rose-500">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-bold">
            Attention: You need more classes in {atRisk.length} subject{atRisk.length > 1 ? "s" : ""} to meet the 75% requirement.
          </p>
        </div>
      )}

      {/* Subject List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Subject Breakdown</h2>
        </div>
        <div className="grid gap-3">
          {studentAttendance.map((sub) => {
            const isLow = sub.percentage < 75;
            const barColor = sub.percentage >= 85 ? "bg-emerald-500" : isLow ? "bg-rose-500" : "bg-primary";
            const textColor = sub.percentage >= 85 ? "text-emerald-500" : isLow ? "text-rose-500" : "text-primary";

            return (
              <Card key={sub.code} className="border-border/30 hover:border-border/60 transition-colors">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold leading-none">{sub.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium">
                        {sub.code} • {sub.faculty}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xl font-black ${textColor}`}>{sub.percentage}%</span>
                      <p className="text-[10px] text-muted-foreground font-bold">{sub.attended} / {sub.totalClasses}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <ProgressBar value={sub.percentage} color={barColor} />
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Target 75%</p>
                      {isLow ? (
                        <p className="text-[10px] font-bold text-rose-500 uppercase">Need {classesNeeded(sub)} classes</p>
                      ) : (
                        <p className="text-[10px] font-bold text-emerald-500 uppercase">Safe</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ——— Teacher Marking View ———
const mockStudents = [
  { id: "CS-2023-001", name: "Anirban Das", rollNo: "001", attendance: 85 },
  { id: "CS-2023-002", name: "Priya Sharma", rollNo: "002", attendance: 92 },
  { id: "CS-2023-003", name: "Rahul Verma", rollNo: "003", attendance: 76 },
  { id: "CS-2023-004", name: "Sneha Reddy", rollNo: "004", attendance: 88 },
  { id: "CS-2023-005", name: "Amit Kumar", rollNo: "005", attendance: 65 },
  { id: "CS-2023-006", name: "Deepa Gupta", rollNo: "006", attendance: 95 },
  { id: "CS-2023-007", name: "Vikram Singh", rollNo: "007", attendance: 71 },
];

function TeacherMarking() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("CS301 - Data Structures");
  const [attendanceState, setAttendanceState] = useState<Record<string, "present" | "absent" | "late" | null>>({});

  const markAttendance = (id: string, status: "present" | "absent" | "late") => {
    setAttendanceState(prev => ({ ...prev, [id]: status }));
  };

  const markAllAs = (status: "present" | "absent") => {
    const newState: Record<string, "present" | "absent" | "late"> = {};
    mockStudents.forEach(s => { newState[s.id] = status; });
    setAttendanceState(newState);
  };

  const filtered = mockStudents.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = Object.values(attendanceState).filter(s => s === "present").length;
  const absentCount = Object.values(attendanceState).filter(s => s === "absent").length;

  return (
    <div className="space-y-6 animate-in pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Mark Attendance</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20">{subject}</span>
            <span className="text-xs text-muted-foreground font-medium">CSE Semester 6 • Today</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => markAllAs("present")} className="h-9 font-bold text-xs">All Present</Button>
          <Button size="sm" className="h-9 px-5 gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs active-scale">
            <Save className="h-3.5 w-3.5" /> Save Records
          </Button>
        </div>
      </div>

      {/* Simplified Stats Row */}
      <div className="flex gap-4 p-4 rounded-2xl bg-accent/30 border border-border/30">
        <div className="flex-1 text-center">
          <p className="text-xl font-black">{mockStudents.length}</p>
          <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Enrolled</p>
        </div>
        <div className="w-px bg-border/30" />
        <div className="flex-1 text-center">
          <p className="text-xl font-black text-emerald-500">{presentCount}</p>
          <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Present</p>
        </div>
        <div className="w-px bg-border/30" />
        <div className="flex-1 text-center">
          <p className="text-xl font-black text-rose-500">{absentCount}</p>
          <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Absent</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search student name or ID..." className="pl-10 h-10 border-border/50 focus:border-primary/50 transition-all" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="space-y-2">
        {filtered.map((student) => {
          const status = attendanceState[student.id];
          const isLow = student.attendance < 75;
          return (
            <Card key={student.id} className="border-border/30">
              <CardContent className="p-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-black text-xs text-muted-foreground">
                    {student.rollNo}
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-none">{student.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-tighter">
                      {student.id} • <span className={isLow ? "text-rose-500" : "text-emerald-500"}>{student.attendance}% Overall</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {[
                    { id: "present", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { id: "late", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                    { id: "absent", icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" }
                  ].map((s) => {
                    const Icon = s.icon;
                    const isActive = status === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => markAttendance(student.id, s.id as any)}
                        className={`h-9 w-9 flex items-center justify-center rounded-xl transition-all border ${
                          isActive 
                            ? `${s.bg} ${s.color} border-${s.id === "present" ? "emerald" : s.id === "late" ? "amber" : "rose"}-500/30 shadow-sm` 
                            : "border-transparent text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ——— Entry Point: Role-based view ———
export default function AttendancePage() {
  const { role } = useAuthStore();

  if (role === "student") {
    return <StudentAnalytics />;
  }

  if (role === "teacher" || role === "admin") {
    return <TeacherMarking />;
  }

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-8 text-center animate-in">
      <div className="rounded-2xl bg-destructive/10 p-6 text-destructive mb-6">
        <XCircle className="h-12 w-12" />
      </div>
      <h2 className="text-2xl font-bold">Access Denied</h2>
      <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
    </div>
  );
}
