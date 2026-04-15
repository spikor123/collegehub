"use client";

import { useState } from "react";
import {
  ClipboardList,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  FileText,
  Calendar,
  User,
  Filter,
  BookOpen,
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

interface Assignment {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  description: string;
  deadline: string;
  deadlineDate: string;
  status: "pending" | "submitted" | "overdue" | "graded";
  professor: string;
  maxMarks: number;
  obtainedMarks?: number;
  submissionType: string;
  attachments: number;
  priority: "high" | "medium" | "low";
}

const initialAssignments: Assignment[] = [
  {
    id: "1",
    title: "Implement Binary Search Tree Operations",
    subject: "Data Structures & Algorithms",
    subjectCode: "CS301",
    description: "Implement insertion, deletion, and traversal (inorder, preorder, postorder) operations in BST using C++. Include time complexity analysis.",
    deadline: "Tomorrow, 11:59 PM",
    deadlineDate: "Apr 16, 2026",
    status: "pending",
    professor: "Dr. Rajesh Kumar",
    maxMarks: 25,
    submissionType: "Code + Report (PDF)",
    attachments: 1,
    priority: "high",
  },
  {
    id: "2",
    title: "ER Diagram for Hospital Management System",
    subject: "Database Management Systems",
    subjectCode: "CS302",
    description: "Design a complete ER diagram for a hospital management system. Include entities, relationships, cardinality, and participation constraints.",
    deadline: "Apr 18, 11:59 PM",
    deadlineDate: "Apr 18, 2026",
    status: "pending",
    professor: "Prof. Sunita Verma",
    maxMarks: 20,
    submissionType: "PDF Document",
    attachments: 0,
    priority: "medium",
  },
  {
    id: "3",
    title: "Linux Shell Commands Lab Report",
    subject: "Operating Systems",
    subjectCode: "CS303",
    description: "Complete the 15 shell scripting exercises from Lab 5 and prepare a detailed report with screenshots.",
    deadline: "Apr 20, 5:00 PM",
    deadlineDate: "Apr 20, 2026",
    status: "pending",
    professor: "Dr. Amit Patel",
    maxMarks: 15,
    submissionType: "Report (PDF)",
    attachments: 2,
    priority: "medium",
  },
  {
    id: "4",
    title: "Research Paper Review — Cloud Computing",
    subject: "Computer Networks",
    subjectCode: "CS304",
    description: "Review the assigned IEEE paper on edge computing and write a 1500-word critical analysis.",
    deadline: "Submitted",
    deadlineDate: "Apr 12, 2026",
    status: "submitted",
    professor: "Dr. Neha Gupta",
    maxMarks: 30,
    submissionType: "PDF + Presentation",
    attachments: 1,
    priority: "low",
  },
];

const statusConfig = {
  pending: {
    label: "Pending",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: Clock,
  },
  submitted: {
    label: "Submitted",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: CheckCircle2,
  },
  overdue: {
    label: "Overdue",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: AlertCircle,
  },
  graded: {
    label: "Graded",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: CheckCircle2,
  },
};

const priorityColors = {
  high: "bg-red-500/15 text-red-400",
  medium: "bg-amber-500/15 text-amber-400",
  low: "bg-blue-500/15 text-blue-400",
};

export default function AssignmentsPage() {
  const { role } = useAuthStore();
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New assignment form state
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newMarks, setNewMarks] = useState("20");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");

  const pendingCount = assignments.filter((a) => a.status === "pending").length;
  const overdueCount = assignments.filter((a) => a.status === "overdue").length;
  const submittedCount = assignments.filter((a) => a.status === "submitted" || a.status === "graded").length;

  const filtered =
    statusFilter === "all"
      ? assignments
      : assignments.filter((a) => a.status === statusFilter);

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAssignment: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      subject: newSubject,
      subjectCode: newCode,
      description: newDesc,
      deadline: newDeadline,
      deadlineDate: new Date().toLocaleDateString(),
      status: "pending",
      professor: "You (Teacher)",
      maxMarks: parseInt(newMarks) || 20,
      submissionType: "Document Upload",
      attachments: 0,
      priority: newPriority,
    };

    setAssignments([newAssignment, ...assignments]);
    setIsDialogOpen(false);
    
    // Reset form
    setNewTitle("");
    setNewSubject("");
    setNewCode("");
    setNewDesc("");
    setNewDeadline("");
    setNewMarks("20");
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
          <p className="text-sm text-muted-foreground">
            Track your assignments &amp; deadlines
          </p>
        </div>
        
        {/* Only show Add Assignment button for faculty/admin */}
        {(role === "teacher" || role === "admin") && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
                <DialogDescription>
                  Post a new assignment to the student portal. Students will be notified immediately.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAssignment} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Lab 5 Report" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Name</Label>
                    <Input 
                      id="subject" 
                      placeholder="Operating Systems" 
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Subject Code</Label>
                    <Input 
                      id="code" 
                      placeholder="CS303" 
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Input 
                    id="desc" 
                    placeholder="Detailed instructions..." 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input 
                      id="deadline" 
                      placeholder="e.g. Tomorrow, 5 PM" 
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marks">Max Marks</Label>
                    <Input 
                      id="marks" 
                      type="number" 
                      value={newMarks}
                      onChange={(e) => setNewMarks(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="flex gap-2">
                    {(["low", "medium", "high"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`flex-1 rounded-md border py-1.5 text-xs font-medium capitalize transition-colors ${
                          newPriority === p
                            ? `bg-primary/10 text-primary border-primary/50`
                            : "border-border text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Publish Assignment</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overdueCount}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{submittedCount}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "overdue", label: "Overdue" },
          { key: "submitted", label: "Submitted" },
          { key: "graded", label: "Graded" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              statusFilter === f.key
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Assignments list */}
      <div className="space-y-3">
        {filtered.map((assignment, idx) => {
          const config = statusConfig[assignment.status];
          const isExpanded = expandedId === assignment.id;

          return (
            <Card
              key={assignment.id}
              className={`border-border/50 overflow-hidden transition-all duration-300 hover:border-border ${config.border}`}
              style={{
                animationDelay: `${idx * 60}ms`,
                animation: "animate-in 0.4s ease-out both",
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Status icon */}
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bg}`}
                  >
                    <config.icon className={`h-4 w-4 ${config.color}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
                          className="text-left"
                        >
                          <h3 className="text-sm font-semibold leading-snug hover:text-primary transition-colors">
                            {assignment.title}
                          </h3>
                        </button>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/80">{assignment.subjectCode}</span>
                          {" · "}
                          {assignment.subject}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityColors[assignment.priority]}`}>
                          {assignment.priority}
                        </span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${config.bg} ${config.color} ${config.border}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {assignment.deadline}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {assignment.professor}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {assignment.submissionType}
                      </span>
                    </div>

                    {/* Expanded details */}
                    <div
                      className={`mt-2.5 overflow-hidden transition-all duration-300 ${
                        isExpanded ? "max-h-48" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {assignment.description}
                      </p>
                      <div className="mt-3 flex gap-6 text-xs">
                        <span>Max Marks: <strong className="text-foreground">{assignment.maxMarks}</strong></span>
                        {assignment.obtainedMarks !== undefined && (
                          <span>Obtained: <strong className="text-emerald-400">{assignment.obtainedMarks}/{assignment.maxMarks}</strong></span>
                        )}
                        {assignment.attachments > 0 && (
                          <span>{assignment.attachments} attachment(s)</span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-2 flex items-center justify-between">
                      {assignment.status === "graded" && assignment.obtainedMarks !== undefined ? (
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-accent">
                            <div
                              className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                              style={{ width: `${(assignment.obtainedMarks / assignment.maxMarks) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-emerald-400">
                            {Math.round((assignment.obtainedMarks / assignment.maxMarks) * 100)}%
                          </span>
                        </div>
                      ) : (
                        <div />
                      )}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
                        className="flex items-center gap-0.5 text-xs text-primary hover:underline"
                      >
                        {isExpanded ? "Less" : "Details"}
                        <ChevronDown
                          className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
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
