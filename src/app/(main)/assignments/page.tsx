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
  Upload,
  Loader2,
  X,
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
  
  // Faculty form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newMarks, setNewMarks] = useState("20");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");

  // Student submission form
  const [submitDialogOpen, setSubmitDialogOpen] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    setNewTitle("");
    setNewSubject("");
    setNewCode("");
    setNewDesc("");
    setNewDeadline("");
    setNewMarks("20");
  };

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSubmitting(true);
    setSubmitProgress(0);

    for (let i = 0; i <= 100; i += 25) {
      setSubmitProgress(i);
      await new Promise(r => setTimeout(r, 400));
    }

    setAssignments(assignments.map(a => 
      a.id === submitDialogOpen ? { ...a, status: "submitted" as const, attachments: a.attachments + 1 } : a
    ));

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitDialogOpen(null);
      setSelectedFile(null);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
          <p className="text-sm text-muted-foreground">
            Track your assignments &amp; deadlines
          </p>
        </div>
        
        {(role === "teacher" || role === "admin") && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 active-scale">
                <Plus className="h-4 w-4" />
                Add Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
                <DialogDescription>
                  Post a new assignment to the student portal.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAssignment} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input value={newCode} onChange={(e) => setNewCode(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full">Publish Assignment</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending", value: pendingCount, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Overdue", value: overdueCount, icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Completed", value: submittedCount, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground truncate">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-1.5">
        {["all", "pending", "overdue", "submitted", "graded"].map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-all duration-200 ${
              statusFilter === f
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Assignments list */}
      <div className="space-y-4">
        {filtered.map((assignment, idx) => {
          const config = statusConfig[assignment.status];
          const isExpanded = expandedId === assignment.id;

          return (
            <Card
              key={assignment.id}
              className={`border-border/50 overflow-hidden transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5 ${config.border}`}
              style={{
                animationDelay: `${idx * 60}ms`,
                animation: "animate-in 0.4s ease-out both",
              }}
            >
              <CardContent className="p-0">
                <div className="flex flex-col">
                  {/* Top Bar for status */}
                  <div className={`flex h-1 text-[10px] w-full ${config.bg.replace('/10', '')}`} />
                  
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Status icon circle */}
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${config.bg} border-2 ${config.border}`}>
                        <config.icon className={`h-5 w-5 ${config.color}`} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
                              className="text-left group"
                            >
                              <h3 className="text-base font-bold leading-snug group-hover:text-primary transition-colors">
                                {assignment.title}
                              </h3>
                              <p className="mt-0.5 text-xs text-muted-foreground font-medium">
                                <span className="text-foreground/80">{assignment.subjectCode}</span> · {assignment.subject}
                              </p>
                            </button>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1.5">
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityColors[assignment.priority]}`}>
                              {assignment.priority}
                            </span>
                          </div>
                        </div>

                        {/* Meta Grid */}
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                           <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                              <Calendar className="h-3.5 w-3.5" />
                              <span className={assignment.deadline.includes("Tomorrow") ? "text-red-400 font-bold" : ""}>{assignment.deadline}</span>
                           </div>
                           <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                              <User className="h-3.5 w-3.5" />
                              <span className="truncate">{assignment.professor}</span>
                           </div>
                           <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium col-span-2 sm:col-span-1">
                              <FileText className="h-3.5 w-3.5" />
                              <span>{assignment.submissionType}</span>
                           </div>
                        </div>

                        {/* Expanded details */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0"}`}
                        >
                          <div className="p-3 bg-accent/40 rounded-xl border border-border/50">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-2">Detailed Instructions</h4>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {assignment.description}
                            </p>
                            <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-4 text-xs font-bold">
                              <span>MAX MARKS: <span className="text-primary">{assignment.maxMarks}</span></span>
                              <span>STATUS: <span className={config.color}>{config.label.toUpperCase()}</span></span>
                              <span>ATTACHMENTS: {assignment.attachments}</span>
                            </div>
                          </div>
                          
                          {/* Student Submission Button */}
                          {role === "student" && assignment.status === "pending" && (
                            <div className="mt-4">
                               <Dialog open={submitDialogOpen === assignment.id} onOpenChange={(open) => setSubmitDialogOpen(open ? assignment.id : null)}>
                                 <DialogTrigger asChild>
                                    <Button className="w-full gap-2 active-scale" size="lg">
                                       <Upload className="h-4 w-4" /> Submit PDF Solution
                                    </Button>
                                 </DialogTrigger>
                                 <DialogContent className="sm:max-w-[400px]">
                                    <DialogHeader>
                                      <DialogTitle>Submit: {assignment.subjectCode}</DialogTitle>
                                      <DialogDescription>
                                        Upload your final PDF report for grading.
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    <form onSubmit={handleSubmission} className="space-y-6 py-4">
                                       <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:bg-accent/50 transition-colors relative group cursor-pointer">
                                          <input 
                                            type="file" 
                                            accept=".pdf" 
                                            className="absolute inset-0 opacity-0 cursor-pointer" 
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                          />
                                          <Upload className="h-10 w-10 text-primary/40 mx-auto mb-3 group-hover:text-primary/60" />
                                          <p className="text-sm font-bold">{selectedFile ? selectedFile.name : "Select PDF Assignment"}</p>
                                          <p className="text-[10px] uppercase font-bold text-muted-foreground mt-2 tracking-widest">Maximum File Size: 20MB</p>
                                       </div>

                                       {isSubmitting && (
                                         <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold">
                                              <span className="flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> Uploading...</span>
                                              <span>{submitProgress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                                               <div className="h-full bg-primary transition-all duration-500" style={{ width: `${submitProgress}%` }} />
                                            </div>
                                         </div>
                                       )}

                                       <Button type="submit" className="w-full h-12" disabled={!selectedFile || isSubmitting}>
                                          {isSubmitting ? "Processing..." : "Submit to Professor"}
                                       </Button>
                                    </form>
                                 </DialogContent>
                               </Dialog>
                            </div>
                          )}
                        </div>

                        {/* Footer Toggle */}
                        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                          <div className="flex items-center gap-2">
                             {assignment.status === "graded" && (
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                  Grade: {assignment.obtainedMarks}/{assignment.maxMarks}
                                </span>
                             )}
                          </div>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
                            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                          >
                            {isExpanded ? "Collapse" : "Open Details"}
                            <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
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
