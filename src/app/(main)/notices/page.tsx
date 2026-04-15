"use client";

import { useState } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Pin,
  AlertTriangle,
  Sparkles,
  Clock,
  User,
  ChevronDown,
  Eye,
  MessageSquare,
  X,
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type Priority = "urgent" | "important" | "normal";

interface Notice {
  id: string;
  title: string;
  body: string;
  priority: Priority;
  is_pinned: boolean;
  author: string;
  department: string;
  created_at: string;
  views: number;
  comments: number;
  tags: string[];
  attachmentUrl?: string;
  attachmentName?: string;
}

const initialNotices: Notice[] = [
  {
    id: "1",
    title: "Mid-Semester Examination Schedule — April 2026",
    body: "The mid-semester examinations for all branches will commence from April 28, 2026. Students are advised to collect their hall tickets from the examination cell by April 25. Seating arrangement will be published on the notice board by April 26.",
    priority: "urgent",
    is_pinned: true,
    author: "Dr. Priya Sharma",
    department: "Examination Cell",
    created_at: "2 hours ago",
    views: 847,
    comments: 23,
    tags: ["Exams", "Important"],
    attachmentName: "Exam_Schedule_Final.pdf",
    attachmentUrl: "#",
  },
  {
    id: "2",
    title: "Workshop on AI/ML & Generative AI — Registration Open",
    body: "The Department of Computer Science is organizing a 3-day workshop on Artificial Intelligence, Machine Learning, and Generative AI from May 5–7, 2026. Industry experts from Google and Microsoft will be conducting sessions. Limited seats available — register now.",
    priority: "important",
    is_pinned: true,
    author: "Prof. Rahul Verma",
    department: "CSE Department",
    created_at: "5 hours ago",
    views: 612,
    comments: 45,
    tags: ["Workshop", "CSE", "AI/ML"],
  },
];

const priorityConfig = {
  urgent: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
    icon: AlertTriangle,
    label: "Urgent",
  },
  important: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    icon: Sparkles,
    label: "Important",
  },
  normal: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    icon: Megaphone,
    label: "General",
  },
};

const filters = ["All", "Urgent", "Important", "General", "Pinned"];

export default function NoticesPage() {
  const { role } = useAuthStore();
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Notice Creation State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("normal");
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Pinned") return notice.is_pinned && matchesSearch;
    if (activeFilter === "Urgent")
      return notice.priority === "urgent" && matchesSearch;
    if (activeFilter === "Important")
      return notice.priority === "important" && matchesSearch;
    if (activeFilter === "General")
      return notice.priority === "normal" && matchesSearch;
    return matchesSearch;
  });

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPosting(true);

    // Simulate upload delay
    await new Promise(r => setTimeout(r, 1500));

    const newNotice: Notice = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      body: newBody,
      priority: newPriority,
      is_pinned: false,
      author: "You (Dean/Faculty)",
      department: "Administration",
      created_at: "Just now",
      views: 0,
      comments: 0,
      tags: ["Official", "New"],
      attachmentName: selectedPdf?.name,
      attachmentUrl: selectedPdf ? "#" : undefined,
    };

    setNotices([newNotice, ...notices]);
    setIsPosting(false);
    setIsDialogOpen(false);
    
    // Reset
    setNewTitle("");
    setNewBody("");
    setSelectedPdf(null);
  };

  return (
    <div className="space-y-6 animate-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notice Board</h1>
          <p className="text-sm text-muted-foreground">
            {notices.length} official campus announcements
          </p>
        </div>

        {/* Post Notice restricted to Faculty/Admin */}
        {(role === "teacher" || role === "admin") && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 active-scale">
                <Plus className="h-4 w-4" />
                Post Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Broadcast New Notice</DialogTitle>
                <DialogDescription>
                  This announcement will be pinned to the dashboard and sent via push notifications to all students.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePostNotice} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Notice Title</Label>
                  <Input 
                    placeholder="e.g. Workshop Registration Deadline" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message Content</Label>
                  <Textarea 
                    placeholder="Type the detailed notice content here..." 
                    className="min-h-[120px] resize-none"
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority Level</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as Priority)}
                    >
                      <option value="normal">General</option>
                      <option value="important">Important</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Attach PDF (Optional)</Label>
                    <div className="relative group">
                       <Input 
                        type="file" 
                        accept=".pdf" 
                        className="opacity-0 absolute inset-0 cursor-pointer z-10"
                        onChange={(e) => setSelectedPdf(e.target.files?.[0] || null)}
                       />
                       <Button variant="outline" type="button" className="w-full gap-2 text-xs">
                          {selectedPdf ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Upload className="h-3.5 w-3.5" />}
                          {selectedPdf ? selectedPdf.name : "Select PDF Document"}
                       </Button>
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full h-11" disabled={isPosting}>
                    {isPosting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {isPosting ? "Broadcasting..." : "Post Notice to Board"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search official notices, keywords, tags..."
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                activeFilter === f
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {f}
              {f === "Pinned" && <Pin className="ml-1.5 inline h-3 w-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice, idx) => {
          const config = priorityConfig[notice.priority];
          const isExpanded = expandedId === notice.id;

          return (
            <Card
              key={notice.id}
              className={`border-border/50 overflow-hidden transition-all duration-300 hover:border-border hover:shadow-xl hover:shadow-primary/5 ${config.border} bg-card/60`}
              style={{
                animationDelay: `${idx * 60}ms`,
                animation: "animate-in 0.4s ease-out both",
              }}
            >
              <CardContent className="p-0">
                <div className="flex items-start">
                   {/* Left priority accent */}
                   <div className={`w-1 self-stretch ${config.bg.replace('/10', '')}`} />
                   
                   <div className="flex-1 p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${config.bg} border border-${config.color.replace('text-', '')}/20`}>
                        {notice.is_pinned ? (
                          <Pin className={`h-5 w-5 ${config.color}`} />
                        ) : (
                          <config.icon className={`h-5 w-5 ${config.color}`} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : notice.id)}
                            className="text-left group"
                          >
                            <h3 className="text-base font-bold leading-snug group-hover:text-primary transition-colors">
                              {notice.title}
                            </h3>
                          </button>
                          
                          <div className="flex shrink-0 items-center gap-2">
                            {notice.is_pinned && (
                              <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                                <Pin className="h-2.5 w-2.5" />
                                Pinned
                              </span>
                            )}
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.badge}`}>
                              {config.label}
                            </span>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground font-semibold">
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            {notice.author}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {notice.created_at}
                          </span>
                          <span className="bg-accent/40 px-1.5 py-0.5 rounded text-foreground/70 uppercase tracking-tighter">
                            {notice.department}
                          </span>
                        </div>

                        {/* Body (Expandable) */}
                        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96 mt-4 opacity-100" : "max-h-0 opacity-0"}`}>
                          <div className="p-4 bg-accent/20 rounded-xl border border-border/50">
                             <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                               {notice.body}
                             </p>
                             
                             {notice.attachmentName && (
                               <div className="mt-4 pt-4 border-t border-border/30">
                                  <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                                     <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg"><FileText className="h-5 w-5 text-primary" /></div>
                                        <div>
                                           <p className="text-xs font-bold text-foreground truncate max-w-[180px]">{notice.attachmentName}</p>
                                           <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Official PDF</p>
                                        </div>
                                     </div>
                                     <Button variant="outline" size="sm" className="h-8 gap-2 group active-scale">
                                        View PDF <ChevronDown className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
                                     </Button>
                                  </div>
                               </div>
                             )}
                          </div>
                        </div>

                        {/* Footer stats */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex gap-2">
                             {notice.tags.map(t => (
                               <span key={t} className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">#{t}</span>
                             ))}
                          </div>
                          <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground/50">
                             <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> {notice.views}</span>
                             <span className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> {notice.comments}</span>
                             <button
                               onClick={() => setExpandedId(isExpanded ? null : notice.id) }
                               className="text-primary hover:underline uppercase tracking-widest text-[10px]"
                             >
                               {isExpanded ? "Collapse" : "Read Content"}
                             </button>
                          </div>
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
