"use client";

import { useState } from "react";
import {
  CheckSquare,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Calendar,
  BookOpen,
  Eye,
  ChevronDown,
  BarChart3,
  Clock,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";

// ——— Mock Attendance Records ———
interface SubjectAttendance {
  code: string;
  name: string;
  totalClasses: number;
  attended: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  lastWeek: number[];
  monthlyData: number[];
  faculty: string;
}

const studentAttendance: SubjectAttendance[] = [
  {
    code: "CS301",
    name: "Data Structures & Algorithms",
    totalClasses: 42,
    attended: 38,
    percentage: 90,
    trend: "up",
    lastWeek: [1, 1, 0, 1, 1],
    monthlyData: [85, 82, 88, 90],
    faculty: "Dr. Rajesh Kumar",
  },
  {
    code: "CS302",
    name: "Database Management Systems",
    totalClasses: 38,
    attended: 29,
    percentage: 76,
    trend: "down",
    lastWeek: [1, 0, 1, 0, 1],
    monthlyData: [82, 80, 78, 76],
    faculty: "Prof. Sunita Verma",
  },
  {
    code: "CS303",
    name: "Operating Systems",
    totalClasses: 40,
    attended: 26,
    percentage: 65,
    trend: "down",
    lastWeek: [0, 1, 0, 0, 1],
    monthlyData: [74, 72, 68, 65],
    faculty: "Dr. Amit Patel",
  },
  {
    code: "CS304",
    name: "Computer Networks",
    totalClasses: 36,
    attended: 34,
    percentage: 94,
    trend: "up",
    lastWeek: [1, 1, 1, 1, 1],
    monthlyData: [88, 90, 92, 94],
    faculty: "Dr. Neha Gupta",
  },
  {
    code: "MA401",
    name: "Engineering Mathematics IV",
    totalClasses: 44,
    attended: 33,
    percentage: 75,
    trend: "stable",
    lastWeek: [1, 0, 1, 1, 0],
    monthlyData: [76, 75, 75, 75],
    faculty: "Prof. Deepak Joshi",
  },
  {
    code: "CS305",
    name: "Software Engineering",
    totalClasses: 34,
    attended: 30,
    percentage: 88,
    trend: "up",
    lastWeek: [1, 1, 1, 0, 1],
    monthlyData: [80, 83, 86, 88],
    faculty: "Dr. Meena Gupta",
  },
];

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const monthLabels = ["Jan", "Feb", "Mar", "Apr"];

// ——— Pure SVG Micro-Chart Components ———
function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 100);
  const barWidth = 28;
  const gap = 6;
  const height = 48;
  const totalWidth = data.length * (barWidth + gap) - gap;

  return (
    <svg width={totalWidth} height={height + 14} className="overflow-visible">
      {data.map((val, i) => {
        const barH = (val / max) * height;
        return (
          <g key={i}>
            <rect
              x={i * (barWidth + gap)}
              y={height - barH}
              width={barWidth}
              height={barH}
              rx={4}
              className={`${color} transition-all duration-500`}
              style={{ opacity: 0.7 + (i / data.length) * 0.3 }}
            />
            <text
              x={i * (barWidth + gap) + barWidth / 2}
              y={height + 12}
              textAnchor="middle"
              className="fill-muted-foreground text-[9px] font-bold"
            >
              {monthLabels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function AttendanceDots({ data }: { data: number[] }) {
  return (
    <div className="flex items-center gap-2">
      {data.map((val, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className={`h-5 w-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center text-[8px] font-bold ${
              val === 1
                ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-400"
                : "bg-rose-500/20 border-rose-500/60 text-rose-400"
            }`}
          >
            {val === 1 ? "✓" : "×"}
          </div>
          <span className="text-[8px] font-bold text-muted-foreground/50">{dayLabels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function CircularGauge({ value, size = 120, strokeWidth = 10 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color =
    value >= 85 ? "stroke-emerald-400" : value >= 75 ? "stroke-amber-400" : "stroke-rose-400";
  const bgColor =
    value >= 85 ? "text-emerald-400" : value >= 75 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-accent/40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${color} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-black ${bgColor}`}>{value}%</span>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Overall</span>
      </div>
    </div>
  );
}

// ——— Main Page ———
export default function AttendanceAnalyticsPage() {
  const { role } = useAuthStore();
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const overallAttendance = Math.round(
    studentAttendance.reduce((s, a) => s + a.percentage, 0) / studentAttendance.length
  );
  const atRiskSubjects = studentAttendance.filter((s) => s.percentage < 75);
  const perfectSubjects = studentAttendance.filter((s) => s.percentage >= 90);
  const totalAttended = studentAttendance.reduce((s, a) => s + a.attended, 0);
  const totalClasses = studentAttendance.reduce((s, a) => s + a.totalClasses, 0);

  // Predict how many classes needed to reach 75% for at-risk subjects
  function classesNeeded(sub: SubjectAttendance): number {
    if (sub.percentage >= 75) return 0;
    // Solve: (attended + x) / (total + x) >= 0.75
    const needed = Math.ceil((0.75 * sub.totalClasses - sub.attended) / (1 - 0.75));
    return Math.max(needed, 0);
  }

  return (
    <div className="space-y-6 animate-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Semester performance insights · {totalAttended}/{totalClasses} classes attended
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-card to-emerald-500/5">
          <CardContent className="p-5 flex flex-col items-center gap-2">
            <CircularGauge value={overallAttendance} size={100} strokeWidth={8} />
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-black">{studentAttendance.length}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Subjects</p>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-border/50 ${atRiskSubjects.length > 0 ? "border-rose-500/30 bg-rose-500/5" : ""}`}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${atRiskSubjects.length > 0 ? "bg-rose-500/10" : "bg-emerald-500/10"}`}>
              <AlertTriangle className={`h-6 w-6 ${atRiskSubjects.length > 0 ? "text-rose-400" : "text-emerald-400"}`} />
            </div>
            <div>
              <p className="text-2xl font-black">{atRiskSubjects.length}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">At Risk (&lt;75%)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl">
              <Target className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-black">{perfectSubjects.length}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Above 90%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Warning Banner */}
      {atRiskSubjects.length > 0 && (
        <Card className="border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/20 rounded-2xl shrink-0 animate-pulse">
                <AlertTriangle className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-rose-400">Attendance Warning</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You are below the mandatory <strong className="text-foreground">75% minimum</strong> in{" "}
                  <strong className="text-rose-400">{atRiskSubjects.length} subject{atRiskSubjects.length > 1 ? "s" : ""}</strong>.
                  Continued absence may result in exam debarment.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {atRiskSubjects.map((s) => (
                    <span
                      key={s.code}
                      className="bg-rose-500/15 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full text-[11px] font-bold"
                    >
                      {s.code}: {s.percentage}% — need {classesNeeded(s)} more classes
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subject-wise Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Subject-wise Breakdown</h2>

        {studentAttendance.map((sub, idx) => {
          const isExpanded = expandedSubject === sub.code;
          const statusColor =
            sub.percentage >= 85
              ? "emerald"
              : sub.percentage >= 75
              ? "amber"
              : "rose";

          return (
            <Card
              key={sub.code}
              className={`border-border/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-l-4 border-l-${statusColor}-400/60`}
              style={{ animationDelay: `${idx * 60}ms`, animation: "animate-in 0.4s ease-out both" }}
            >
              <CardContent className="p-0">
                <button
                  onClick={() => setExpandedSubject(isExpanded ? null : sub.code)}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Percentage Circle */}
                      <div className="relative shrink-0">
                        <CircularGauge value={sub.percentage} size={56} strokeWidth={5} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm truncate">{sub.name}</h3>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                            sub.trend === "up" ? "text-emerald-400" :
                            sub.trend === "down" ? "text-rose-400" : "text-amber-400"
                          }`}>
                            {sub.trend === "up" && <TrendingUp className="h-3 w-3" />}
                            {sub.trend === "down" && <TrendingDown className="h-3 w-3" />}
                            {sub.trend === "up" ? "Rising" : sub.trend === "down" ? "Dropping" : "Stable"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground font-semibold">
                          <span className="text-foreground/70">{sub.code}</span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span>{sub.attended}/{sub.totalClasses} classes</span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span>{sub.faculty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Attendance bar */}
                      <div className="hidden sm:block w-32">
                        <div className="h-2 w-full rounded-full bg-accent/50 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-${statusColor}-400 transition-all duration-700`}
                            style={{ width: `${sub.percentage}%` }}
                          />
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                <div className={`overflow-hidden transition-all duration-400 ${isExpanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-5 pb-5 pt-0 space-y-5 border-t border-border/30">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5">
                      {/* Last Week */}
                      <div>
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">This Week</h4>
                        <AttendanceDots data={sub.lastWeek} />
                        <p className="text-[10px] text-muted-foreground mt-2 font-semibold">
                          {sub.lastWeek.filter((d) => d === 1).length}/5 days present
                        </p>
                      </div>

                      {/* Monthly Trend */}
                      <div>
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Monthly Trend</h4>
                        <MiniBarChart
                          data={sub.monthlyData}
                          color={`fill-${statusColor}-400`}
                        />
                      </div>

                      {/* Metrics */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recovery Info</h4>
                        {sub.percentage < 75 ? (
                          <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                            <p className="text-xs font-bold text-rose-400">
                              Attend next {classesNeeded(sub)} consecutive classes to reach 75%
                            </p>
                          </div>
                        ) : sub.percentage < 85 ? (
                          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <p className="text-xs font-bold text-amber-400">
                              {Math.ceil((0.85 * sub.totalClasses - sub.attended) / (1 - 0.85))} more classes needed for 85% (safe zone)
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <p className="text-xs font-bold text-emerald-400">
                              ✓ Safe — you can miss up to {Math.floor(sub.attended - 0.75 * sub.totalClasses)} more classes
                            </p>
                          </div>
                        )}
                        <div className="flex gap-2 text-[10px] font-bold text-muted-foreground">
                          <span className="bg-accent/50 px-2 py-1 rounded-md">Absent: {sub.totalClasses - sub.attended}</span>
                          <span className="bg-accent/50 px-2 py-1 rounded-md">Streak: {sub.lastWeek.filter(d => d === 1).length}d</span>
                        </div>
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
