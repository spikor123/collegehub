"use client";

import { useState } from "react";
import {
  CheckSquare,
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";

const mockStudents = [
  { id: "CS-2023-001", name: "Anirban Das", rollNo: "001", attendance: 85 },
  { id: "CS-2023-002", name: "Priya Sharma", rollNo: "002", attendance: 92 },
  { id: "CS-2023-003", name: "Rahul Verma", rollNo: "003", attendance: 76 },
  { id: "CS-2023-004", name: "Sneha Reddy", rollNo: "004", attendance: 88 },
  { id: "CS-2023-005", name: "Amit Kumar", rollNo: "005", attendance: 65 },
  { id: "CS-2023-006", name: "Deepa Gupta", rollNo: "006", attendance: 95 },
  { id: "CS-2023-007", name: "Vikram Singh", rollNo: "007", attendance: 71 },
];

export default function AttendancePage() {
  const { role } = useAuthStore();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("CS301 - Data Structures");
  const [attendanceState, setAttendanceState] = useState<Record<string, "present" | "absent" | "late" | null>>({});

  if (role !== "teacher" && role !== "admin") {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-8 text-center animate-in">
        <div className="rounded-2xl bg-destructive/10 p-6 text-destructive mb-6">
          <XCircle className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="mt-2 text-muted-foreground">You do not have permission to access the faculty attendance portal.</p>
      </div>
    );
  }

  const markAttendance = (id: string, status: "present" | "absent" | "late") => {
    setAttendanceState(prev => ({ ...prev, [id]: status }));
  };

  const markAllAs = (status: "present" | "absent") => {
    const newState: Record<string, "present" | "absent" | "late"> = {};
    mockStudents.forEach(s => {
      newState[s.id] = status;
    });
    setAttendanceState(newState);
  };

  const filtered = mockStudents.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = Object.values(attendanceState).filter(s => s === "present").length;
  const absentCount = Object.values(attendanceState).filter(s => s === "absent").length;

  return (
    <div className="space-y-6 animate-in">
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
          <Button variant="outline" size="sm" onClick={() => markAllAs("present")}>
            Mark All Present
          </Button>
          <Button size="sm" className="gap-1.5 bg-teal-600 hover:bg-teal-700 text-white">
            <Save className="h-4 w-4" />
            Save Records
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="h-5 w-5 text-blue-400"/></div>
            <div>
              <p className="text-2xl font-bold">{mockStudents.length}</p>
              <p className="text-xs text-muted-foreground">Total Enrolled</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg"><CheckCircle2 className="h-5 w-5 text-emerald-400"/></div>
            <div>
              <p className="text-2xl font-bold">{presentCount}</p>
              <p className="text-xs text-muted-foreground">Present Today</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 rounded-lg"><XCircle className="h-5 w-5 text-rose-400"/></div>
            <div>
              <p className="text-2xl font-bold">{absentCount}</p>
              <p className="text-xs text-muted-foreground">Absent Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by student name or ID..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
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
              <th className="px-6 py-4 font-semibold text-right">Today's Status</th>
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
                    }`}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => markAttendance(student.id, "present")}
                        className={`flex items-center justify-center p-2 rounded-lg transition-colors border ${
                          status === "present" 
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" 
                            : "border-border/50 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-400"
                        }`}
                        title="Present"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => markAttendance(student.id, "late")}
                        className={`flex items-center justify-center p-2 rounded-lg transition-colors border ${
                          status === "late" 
                            ? "bg-amber-500/20 border-amber-500/50 text-amber-400" 
                            : "border-border/50 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-400"
                        }`}
                        title="Late"
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => markAttendance(student.id, "absent")}
                        className={`flex items-center justify-center p-2 rounded-lg transition-colors border ${
                          status === "absent" 
                            ? "bg-rose-500/20 border-rose-500/50 text-rose-400" 
                            : "border-border/50 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400"
                        }`}
                        title="Absent"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
