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

// ——— SVG Components ———
function CircularGauge({ value, size = 56, strokeWidth = 5 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 85 ? "stroke-emerald-400" : value >= 75 ? "stroke-amber-400" : "stroke-rose-400";
  const textColor = value >= 85 ? "text-emerald-400" : value >= 75 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-accent/40" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} className={`${color} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-sm font-black ${textColor}`}>{value}%</span>
      </div>
    </div>
  );
}

// ——— Student Analytics View ———
interface SubjectAttendance {
  code: string; name: string; totalClasses: number; attended: number;
  percentage: number; trend: "up" | "down" | "stable"; lastWeek: number[];
  monthlyData: number[]; faculty: string;
}

const studentAttendance: SubjectAttendance[] = [
  { code: "CS301", name: "Data Structures & Algorithms", totalClasses: 42, attended: 38, percentage: 90, trend: "up", lastWeek: [1, 1, 0, 1, 1], monthlyData: [85, 82, 88, 90], faculty: "Dr. Rajesh Kumar" },
  { code: "CS302", name: "Database Management Systems", totalClasses: 38, attended: 29, percentage: 76, trend: "down", lastWeek: [1, 0, 1, 0, 1], monthlyData: [82, 80, 78, 76], faculty: "Prof. Sunita Verma" },
  { code: "CS303", name: "Operating Systems", totalClasses: 40, attended: 26, percentage: 65, trend: "down", lastWeek: [0, 1, 0, 0, 1], monthlyData: [74, 72, 68, 65], faculty: "Dr. Amit Patel" },
  { code: "CS304", name: "Computer Networks", totalClasses: 36, attended: 34, percentage: 94, trend: "up", lastWeek: [1, 1, 1, 1, 1], monthlyData: [88, 90, 92, 94], faculty: "Dr. Neha Gupta" },
  { code: "MA401", name: "Engineering Mathematics IV", totalClasses: 44, attended: 33, percentage: 75, trend: "stable", lastWeek: [1, 0, 1, 1, 0], monthlyData: [76, 75, 75, 75], faculty: "Prof. Deepak Joshi" },
  { code: "CS305", name: "Software Engineering", totalClasses: 34, attended: 30, percentage: 88, trend: "up", lastWeek: [1, 1, 1, 0, 1], monthlyData: [80, 83, 86, 88], faculty: "Dr. Meena Gupta" },
];

function classesNeeded(sub: SubjectAttendance): number {
  if (sub.percentage >= 75) return 0;
  return Math.max(Math.ceil((0.75 * sub.totalClasses - sub.attended) / (1 - 0.75)), 0);
}

function StudentAnalytics() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const overallAttendance = Math.round(studentAttendance.reduce((s, a) => s + a.percentage, 0) / studentAttendance.length);
  const atRisk = studentAttendance.filter(s => s.percentage < 75);
  const totalAttended = studentAttendance.reduce((s, a) => s + a.attended, 0);
  const totalClasses = studentAttendance.reduce((s, a) => s + a.totalClasses, 0);

  return (
    <div className="space-y-6 animate-in pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Attendance</h1>
        <p className="text-sm text-muted-foreground">{totalAttended}/{totalClasses} classes attended this semester</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-card to-emerald-500/5">
          <CardContent className="p-5 flex flex-col items-center gap-1">
            <CircularGauge value={overallAttendance} size={90} strokeWidth={7} />
            <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Overall</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl"><BookOpen className="h-6 w-6 text-blue-400" /></div>
            <div>
              <p className="text-2xl font-black">{studentAttendance.length}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Subjects</p>
            </div>
          </CardContent>
        </Card>
        <Card className={`border-border/50 ${atRisk.length > 0 ? "border-rose-500/30 bg-rose-500/5" : ""}`}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${atRisk.length > 0 ? "bg-rose-500/10" : "bg-emerald-500/10"}`}>
              <AlertTriangle className={`h-6 w-6 ${atRisk.length > 0 ? "text-rose-400" : "text-emerald-400"}`} />
            </div>
            <div>
              <p className="text-2xl font-black">{atRisk.length}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">At Risk</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl"><Target className="h-6 w-6 text-purple-400" /></div>
            <div>
              <p className="text-2xl font-black">{studentAttendance.filter(s => s.percentage >= 90).length}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">&gt;90%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning */}
      {atRisk.length > 0 && (
        <Card className="border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-3 bg-rose-500/20 rounded-2xl shrink-0 animate-pulse">
              <AlertTriangle className="h-6 w-6 text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-rose-400">Attendance Warning</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Below <strong className="text-foreground">75% minimum</strong> in{" "}
                <strong className="text-rose-400">{atRisk.length} subject{atRisk.length > 1 ? "s" : ""}</strong>. Risk of exam debarment.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {atRisk.map(s => (
                  <span key={s.code} className="bg-rose-500/15 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full text-[11px] font-bold">
                    {s.code}: {s.percentage}% — need {classesNeeded(s)} more
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subject Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Subject Breakdown</h2>
        {studentAttendance.map((sub, idx) => {
          const isExpanded = expanded === sub.code;
          const statusColor = sub.percentage >= 85 ? "emerald" : sub.percentage >= 75 ? "amber" : "rose";

          return (
            <Card key={sub.code} className="border-border/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              style={{ animationDelay: `${idx * 60}ms`, animation: "animate-in 0.4s ease-out both" }}>
              <CardContent className="p-0">
                <button onClick={() => setExpanded(isExpanded ? null : sub.code)} className="w-full text-left p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <CircularGauge value={sub.percentage} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm truncate">{sub.name}</h3>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                            sub.trend === "up" ? "text-emerald-400" : sub.trend === "down" ? "text-rose-400" : "text-amber-400"
                          }`}>
                            {sub.trend === "up" && <TrendingUp className="h-3 w-3" />}
                            {sub.trend === "down" && <TrendingDown className="h-3 w-3" />}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">
                          {sub.code} · {sub.attended}/{sub.totalClasses} · {sub.faculty}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex gap-1">
                        {sub.lastWeek.map((d, i) => (
                          <div key={i} className={`h-3 w-3 rounded-full ${d ? "bg-emerald-400/60" : "bg-rose-400/60"}`} />
                        ))}
                      </div>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-400 ${isExpanded ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-4 pb-4 pt-0 border-t border-border/30">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                      <div className="bg-accent/30 rounded-xl p-3 text-center">
                        <p className="text-lg font-black">{sub.attended}</p>
                        <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Present</p>
                      </div>
                      <div className="bg-accent/30 rounded-xl p-3 text-center">
                        <p className="text-lg font-black text-rose-400">{sub.totalClasses - sub.attended}</p>
                        <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Absent</p>
                      </div>
                      <div className="bg-accent/30 rounded-xl p-3 text-center">
                        <p className="text-lg font-black">{sub.lastWeek.filter(d => d).length}/5</p>
                        <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">This Week</p>
                      </div>
                      <div className={`rounded-xl p-3 text-center ${sub.percentage < 75 ? "bg-rose-500/10" : "bg-emerald-500/10"}`}>
                        <p className={`text-lg font-black ${sub.percentage < 75 ? "text-rose-400" : "text-emerald-400"}`}>
                          {sub.percentage < 75 ? classesNeeded(sub) : Math.floor(sub.attended - 0.75 * sub.totalClasses)}
                        </p>
                        <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">
                          {sub.percentage < 75 ? "Need More" : "Can Skip"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mark Attendance</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <span className="font-medium text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md text-xs border border-teal-500/20">
              {subject}
            </span>
            · CSE Semester 6
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => markAllAs("present")}>Mark All Present</Button>
          <Button size="sm" className="gap-1.5 bg-teal-600 hover:bg-teal-700 text-white active-scale">
            <Save className="h-4 w-4" /> Save Records
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Enrolled", value: mockStudents.length, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Present Today", value: presentCount, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Absent Today", value: absentCount, icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10" },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 ${s.bg} rounded-lg`}><s.icon className={`h-5 w-5 ${s.color}`} /></div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by student name or ID..." className="pl-10 h-11" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="h-11 rounded-md border border-input bg-background px-3 py-2 text-sm" value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option>CS301 - Data Structures</option>
          <option>CS302 - DBMS</option>
          <option>CS303 - Operating Systems</option>
        </select>
      </div>

      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Roll No</th>
              <th className="px-6 py-4 font-semibold">Student Details</th>
              <th className="px-6 py-4 font-semibold">Overall %</th>
              <th className="px-6 py-4 font-semibold text-right">Today&apos;s Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map((student) => {
              const status = attendanceState[student.id];
              const isLow = student.attendance < 75;
              return (
                <tr key={student.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{student.rollNo}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isLow ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>{student.attendance}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(["present", "late", "absent"] as const).map((s) => {
                        const configs = { present: { active: "bg-emerald-500/20 border-emerald-500/50 text-emerald-400", hover: "hover:bg-emerald-500/10 hover:text-emerald-400" },
                          late: { active: "bg-amber-500/20 border-amber-500/50 text-amber-400", hover: "hover:bg-amber-500/10 hover:text-amber-400" },
                          absent: { active: "bg-rose-500/20 border-rose-500/50 text-rose-400", hover: "hover:bg-rose-500/10 hover:text-rose-400" } };
                        const icons = { present: CheckCircle2, late: Clock, absent: XCircle };
                        const Icon = icons[s];
                        return (
                          <button key={s} onClick={() => markAttendance(student.id, s)} title={s}
                            className={`flex items-center justify-center p-2 rounded-lg transition-colors border ${
                              status === s ? configs[s].active : `border-border/50 text-muted-foreground ${configs[s].hover}`
                            }`}>
                            <Icon className="h-4 w-4" />
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
