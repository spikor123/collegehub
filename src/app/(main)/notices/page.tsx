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
import { cn } from "@/lib/utils";

type Priority = "urgent" | "important" | "normal";
type NoticeCategory = "official" | "activity" | "club" | "market";

interface Notice {
  id: string;
  title: string;
  body: string;
  priority: Priority;
  category: NoticeCategory;
  is_pinned: boolean;
  author: string;
  department: string;
  created_at: string;
  views: number;
  comments: number;
  tags: string[];
  attachmentUrl?: string;
  attachmentName?: string;
  // Design features for "one-page" student notices
  design?: {
    background?: string; // Hex or gradient
    backgroundImage?: string;
    textColor?: string;
    textAlign?: "left" | "center" | "right";
  };
}

const initialNotices: Notice[] = [
  {
    id: "1",
    title: "Mid-Semester Examination Schedule — April 2026",
    body: "The mid-semester examinations for all branches will commence from April 28, 2026. Students are advised to collect their hall tickets from the examination cell by April 25. Seating arrangement will be published on the notice board by April 26.",
    priority: "urgent",
    category: "official",
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
    id: "flyer-1",
    title: "🚀 HACKATHON 2026: Code for the Future",
    body: "Ready to build the next big thing? Join us for 48 hours of non-stop innovation, energy, and caffeine! \n\n• Location: Main Auditorium\n• Prizes: ₹50,000 pool\n• Registration: Ends Friday\n\nOpen to all branches. Team of 3 members required.",
    priority: "important",
    category: "activity",
    is_pinned: false,
    author: "@tech_club",
    department: "Tech Club",
    created_at: "1 hour ago",
    views: 1240,
    comments: 12,
    tags: ["Hackathon", "Coding"],
    design: {
      background: "bg-gradient-to-br from-indigo-500/15 to-purple-500/15",
      textAlign: "center",
    }
  },
  {
    id: "flyer-2",
    title: "🎨 RHYTHM 2026: Cultural Extravaganza",
    body: "Experience the magic of art, dance, and music! Registration forms for the annual cultural fest are now available at the Student Union office.\n\nDon't miss out on the biggest event of the year!",
    priority: "normal",
    category: "activity",
    is_pinned: false,
    author: "@cultural_comm",
    department: "Cultural Committee",
    created_at: "3 hours ago",
    views: 3105,
    comments: 89,
    tags: ["Fest", "Cultural"],
    design: {
      background: "bg-gradient-to-br from-rose-500/15 to-orange-500/15",
      textAlign: "center",
    }
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

const filters = ["All", "Official", "Activities", "Clubs", "Pinned"];

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
  const [newCategory, setNewCategory] = useState<NoticeCategory>("activity");
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);

  // Design State
  const [designBg, setDesignBg] = useState("bg-card");
  const [designAlign, setDesignAlign] = useState<"left" | "center" | "right">("left");
  const [showDesignPanel, setShowDesignPanel] = useState(false);

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Pinned") return notice.is_pinned && matchesSearch;
    if (activeFilter === "Official") return notice.category === "official" && matchesSearch;
    if (activeFilter === "Activities") return notice.category === "activity" && matchesSearch;
    if (activeFilter === "Clubs") return notice.category === "club" && matchesSearch;
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
      priority: role === "student" ? "normal" : newPriority,
      category: role === "student" ? "activity" : newCategory,
      is_pinned: false,
      author: role === "student" ? "@student_user" : "Faculty Admin",
      department: role === "student" ? "Student Activity" : "Official",
      created_at: "Just now",
      views: 0,
      comments: 0,
      tags: role === "student" ? ["StudentActivity"] : ["Official"],
      attachmentName: selectedPdf?.name,
      attachmentUrl: selectedPdf ? "#" : undefined,
      design: {
        background: designBg,
        textAlign: designAlign,
      }
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

        {/* Post Notice available to all roles (context-aware labels) */}
        {(role === "student" || role === "teacher" || role === "admin") && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 active-scale">
              <Plus className="h-4 w-4" />
              {role === "student" ? "Design Notice" : "Post Notice"}
            </Button>
          </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{role === "student" ? "Create Student Activity Notice" : "Broadcast Official Notice"}</DialogTitle>
                <DialogDescription>
                  {role === "student" 
                    ? "Design a vibrant flyer for your club or activity. This will be visible in the Activities section."
                    : "This announcement will be pinned to the dashboard and sent via push notifications."}
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
                
                {/* Design Section (Always available for Students, Optional for Faculty) */}
                <div className="rounded-xl border border-border/50 bg-accent/5 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 font-bold"><Sparkles className="h-3.5 w-3.5 text-primary" /> Visual Design</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowDesignPanel(!showDesignPanel)}
                      className="h-7 text-[10px] uppercase font-bold tracking-wider"
                      type="button"
                    >
                      {showDesignPanel ? "Hide Designing" : "Start Designing"}
                    </Button>
                  </div>
                  
                  {showDesignPanel && (
                    <div className="grid grid-cols-1 gap-4 animate-in">
                      <div className="space-y-2">
                         <Label className="text-xs">Background Style</Label>
                         <div className="flex flex-wrap gap-2">
                           {[
                             { id: "bg-card", label: "Clean" },
                             { id: "bg-gradient-to-br from-indigo-500/10 to-purple-500/10", label: "Indigo" },
                             { id: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10", label: "Teal" },
                             { id: "bg-gradient-to-br from-rose-500/10 to-orange-500/10", label: "Sunset" },
                             { id: "bg-gradient-to-br from-amber-500/10 to-yellow-500/10", label: "Warm" },
                           ].map((bg) => (
                             <button
                               key={bg.id}
                               type="button"
                               onClick={() => setDesignBg(bg.id)}
                               className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                                 designBg === bg.id ? "border-primary bg-primary/20 text-primary" : "border-border hover:bg-accent"
                               }`}
                             >
                               {bg.label}
                             </button>
                           ))}
                         </div>
                      </div>
                      <div className="space-y-2">
                         <Label className="text-xs">Text Alignment</Label>
                         <div className="flex gap-2">
                           {(["left", "center", "right"] as const).map((a) => (
                             <button
                               key={a}
                               type="button"
                               onClick={() => setDesignAlign(a)}
                               className={`px-4 py-1.5 rounded-lg border text-[10px] font-bold capitalize transition-all ${
                                 designAlign === a ? "border-primary bg-primary/20 text-primary" : "border-border hover:bg-accent"
                               }`}
                             >
                               {a}
                             </button>
                           ))}
                         </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {role !== "student" && (
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
                  )}
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <Label>Attachment (PDF)</Label>
                    <div className="relative group">
                       <Input 
                        type="file" 
                        accept=".pdf" 
                        className="opacity-0 absolute inset-0 cursor-pointer z-10"
                        onChange={(e) => setSelectedPdf(e.target.files?.[0] || null)}
                       />
                       <Button variant="outline" type="button" className="w-full h-10 gap-2 text-xs">
                          {selectedPdf ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Upload className="h-3.5 w-3.5" />}
                          {selectedPdf ? selectedPdf.name : "Choose File"}
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
              className={cn(
                "border-border/50 overflow-hidden transition-all duration-300 hover:border-border hover:shadow-xl hover:shadow-primary/5",
                config.border,
                notice.design?.background || "bg-card/60"
              )}
              style={{
                animationDelay: `${idx * 60}ms`,
                animation: "animate-in 0.4s ease-out both",
              }}
            >
              <CardContent className="p-0">
                <div className="flex items-start">
                   {/* Left priority accent — only for official notices */}
                   {notice.category === "official" && (
                    <div className={`w-1 self-stretch ${config.bg.replace('/10', '')}`} />
                   )}
                   
                   <div className={cn(
                     "flex-1 p-4",
                     notice.design?.textAlign === "center" && "text-center",
                     notice.design?.textAlign === "right" && "text-right"
                   )}>
                    <div className={cn(
                      "flex items-start gap-4",
                      notice.design?.textAlign === "center" && "flex-col items-center text-center",
                      notice.design?.textAlign === "right" && "flex-row-reverse"
                    )}>
                      {/* Icon */}
                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-all",
                        config.bg,
                        `border-${config.color.replace('text-', '')}/20`
                      )}>
                        {notice.is_pinned ? (
                          <Pin className={`h-5 w-5 ${config.color}`} />
                        ) : (
                          <config.icon className={`h-5 w-5 ${config.color}`} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className={cn(
                          "flex items-start justify-between gap-4",
                          notice.design?.textAlign === "center" && "flex-col items-center"
                        )}>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : notice.id)}
                            className="text-left group"
                          >
                            <h3 className={cn(
                               "text-base font-bold leading-snug group-hover:text-primary transition-colors",
                               notice.design?.textAlign === "center" && "text-center"
                            )}>
                              {notice.title}
                            </h3>
                          </button>
                          
                          <div className="flex shrink-0 items-center gap-2">
                             <span className={cn(
                                "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                config.badge
                             )}>
                               {notice.category === "official" ? config.label : notice.category.toUpperCase()}
                             </span>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className={cn(
                          "mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground font-semibold",
                          notice.design?.textAlign === "center" && "justify-center"
                        )}>
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
                          <div className={cn(
                            "p-4 bg-accent/20 rounded-xl border border-border/50",
                            notice.design?.textAlign === "center" && "text-center",
                            notice.design?.textAlign === "right" && "text-right"
                          )}>
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
