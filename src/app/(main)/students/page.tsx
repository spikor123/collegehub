"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  BookOpen,
  Mail,
  Phone,
  BarChart3,
  Download,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";

interface AssignmentStatus {
  id: string;
  title: string;
  status: "submitted" | "pending" | "overdue";
  grade?: string;
}

const mockStudentData = [
  { 
    id: "CS-2023-001", name: "Anirban Das", branch: "CSE", sem: 6, cgpa: 8.4, attendance: 85, phone: "+91 9876543210", email: "anirban@college.edu",
    assignments: [
      { id: "1", title: "DSA Lab Implementation", status: "submitted", grade: "24/25" },
      { id: "2", title: "OS Subsystem Review", status: "pending" },
      { id: "3", title: "DBMS ER Diagram", status: "submitted", grade: "19/20" },
    ] as AssignmentStatus[]
  },
  { 
    id: "CS-2023-002", name: "Priya Sharma", branch: "CSE", sem: 6, cgpa: 9.1, attendance: 92, phone: "+91 9876543211", email: "priya@college.edu",
    assignments: [
      { id: "1", title: "DSA Lab Implementation", status: "submitted", grade: "25/25" },
      { id: "2", title: "OS Subsystem Review", status: "submitted", grade: "Pending Grade" },
      { id: "3", title: "DBMS ER Diagram", status: "submitted", grade: "20/20" },
    ] as AssignmentStatus[]
  },
  { 
    id: "CS-2023-003", name: "Rahul Verma", branch: "CSE", sem: 6, cgpa: 7.2, attendance: 76, phone: "+91 9876543212", email: "rahul@college.edu",
    assignments: [
      { id: "1", title: "DSA Lab Implementation", status: "submitted", grade: "15/25" },
      { id: "2", title: "OS Subsystem Review", status: "overdue" },
      { id: "3", title: "DBMS ER Diagram", status: "pending" },
    ] as AssignmentStatus[]
  },
  { 
    id: "CS-2023-004", name: "Sneha Reddy", branch: "CSE", sem: 6, cgpa: 8.8, attendance: 88, phone: "+91 9876543213", email: "sneha@college.edu",
    assignments: [
      { id: "1", title: "DSA Lab Implementation", status: "submitted", grade: "22/25" },
      { id: "2", title: "OS Subsystem Review", status: "pending" },
      { id: "3", title: "DBMS ER Diagram", status: "submitted", grade: "18/20" },
    ] as AssignmentStatus[]
  },
  { 
    id: "CS-2023-005", name: "Amit Kumar", branch: "CSE", sem: 6, cgpa: 6.5, attendance: 65, phone: "+91 9876543214", email: "amit@college.edu",
    assignments: [
      { id: "1", title: "DSA Lab Implementation", status: "overdue" },
      { id: "2", title: "OS Subsystem Review", status: "overdue" },
      { id: "3", title: "DBMS ER Diagram", status: "pending" },
    ] as AssignmentStatus[]
  },
];

export default function StudentsPage() {
  const { role } = useAuthStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  if (role !== "teacher" && role !== "admin") {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-8 text-center animate-in">
        <div className="rounded-2xl bg-destructive/10 p-6 text-destructive mb-6">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="mt-2 text-muted-foreground">This section is restricted to Faculty and Administrators.</p>
      </div>
    );
  }

  const filteredStudents = mockStudentData.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Directory</h1>
          <p className="text-sm text-muted-foreground">View academic profiles, attendance, and assignment statuses.</p>
        </div>
        <Button size="sm" className="gap-1.5" variant="outline">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search students by name or ID..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-1.5 text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredStudents.map((student) => {
          const isExpanded = expandedId === student.id;
          const pendingCount = student.assignments.filter(a => a.status === "pending").length;
          const overdueCount = student.assignments.filter(a => a.status === "overdue").length;

          return (
            <Card key={student.id} className="border-border/50 hover:border-border transition-colors overflow-hidden">
              <CardContent className="p-0">
                <div 
                  className="p-5 flex flex-col md:flex-row items-center gap-6 cursor-pointer hover:bg-accent/20 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : student.id)}
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary border border-primary/20">
                    {student.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-bold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.id} · {student.branch} Sem {student.sem}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" /> {student.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" /> {student.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-4 md:gap-2 shrink-0">
                    <div className="flex flex-col items-center md:items-end">
                      <span className="text-sm text-muted-foreground flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> CGPA</span>
                      <span className={`text-lg font-bold ${student.cgpa >= 8.0 ? 'text-emerald-400' : student.cgpa >= 7.0 ? 'text-blue-400' : 'text-amber-400'}`}>
                        {student.cgpa.toFixed(2)}
                      </span>
                    </div>
                    <div className="hidden md:block w-px h-full bg-border" />
                    <div className="flex flex-col items-center md:items-end">
                      <span className="text-sm text-muted-foreground flex items-center gap-1"><BarChart3 className="h-3.5 w-3.5" /> Attendance</span>
                      <span className={`text-lg font-bold ${student.attendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {student.attendance}%
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:flex shrink-0 items-center justify-center pl-4">
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Expanded Assignment View */}
                <div className={`overflow-hidden transition-all duration-300 border-t border-border/50 bg-accent/10 ${isExpanded ? "max-h-96" : "max-h-0 border-transparent"}`}>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-primary" />
                        Assignment Submissions
                      </h4>
                      <div className="flex gap-2">
                        {overdueCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                            {overdueCount} Overdue
                          </span>
                        )}
                        {pendingCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                            {pendingCount} Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {student.assignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between bg-background border border-border/50 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            {assignment.status === "submitted" ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : assignment.status === "pending" ? (
                              <Clock className="h-4 w-4 text-amber-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-rose-400" />
                            )}
                            <span className="text-sm font-medium">{assignment.title}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs">
                            {assignment.status === "submitted" ? (
                              <span className="text-emerald-400 font-semibold">{assignment.grade}</span>
                            ) : assignment.status === "pending" ? (
                              <span className="text-amber-400 font-medium">Awaiting Submission</span>
                            ) : (
                              <Button variant="link" className="h-auto p-0 text-rose-400 text-xs shadow-none">Send Reminder</Button>
                            )}
                          </div>
                        </div>
                      ))}
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
