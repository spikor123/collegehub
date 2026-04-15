"use client";

import { useState } from "react";
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Eye,
  Star,
  FileText,
  Upload,
  ChevronRight,
  X,
  Heart,
  GraduationCap,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Note {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  department: string;
  semester: number;
  uploadedBy: string;
  uploadedAt: string;
  fileType: string;
  fileSize: string;
  pages: number;
  downloads: number;
  rating: number;
  ratingCount: number;
  modules: string[];
  featured: boolean;
}

const initialNotes: Note[] = [
  {
    id: "1",
    title: "Complete DSA Notes — All Modules",
    subject: "Data Structures & Algorithms",
    subjectCode: "CS301",
    department: "CSE",
    semester: 3,
    uploadedBy: "Ankit S.",
    uploadedAt: "3 days ago",
    fileType: "PDF",
    fileSize: "12.4 MB",
    pages: 86,
    downloads: 342,
    rating: 4.8,
    ratingCount: 45,
    modules: ["Arrays", "Trees", "Graphs", "DP", "Sorting"],
    featured: true,
  },
  {
    id: "2",
    title: "DBMS Handwritten Notes + PYQs",
    subject: "Database Management Systems",
    subjectCode: "CS302",
    department: "CSE",
    semester: 3,
    uploadedBy: "Priya M.",
    uploadedAt: "1 week ago",
    fileType: "PDF",
    fileSize: "23.1 MB",
    pages: 124,
    downloads: 567,
    rating: 4.9,
    ratingCount: 72,
    modules: ["ER Model", "Normalization", "SQL", "Transactions", "PYQs 2022-25"],
    featured: true,
  },
];

const departments = ["All", "CSE", "Applied Sciences"];
const semesters = [0, 3, 4, 5]; // 0 = All

export default function NotesPage() {
  const { role } = useAuthStore();
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDept, setActiveDept] = useState("All");
  const [activeSem, setActiveSem] = useState(0);

  // Upload Form State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadDone, setIsUploadDone] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteSubject, setNewNoteSubject] = useState("");
  const [newNoteCode, setNewNoteCode] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filtered = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.modules.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = activeDept === "All" || note.department === activeDept;
    const matchesSem = activeSem === 0 || note.semester === activeSem;
    return matchesSearch && matchesDept && matchesSem;
  });

  const featuredNotes = filtered.filter((n) => n.featured);
  const regularNotes = filtered.filter((n) => !n.featured);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 20) {
      setUploadProgress(i);
      await new Promise(r => setTimeout(r, 300));
    }

    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: newNoteTitle,
      subject: newNoteSubject,
      subjectCode: newNoteCode,
      department: "CSE",
      semester: 3,
      uploadedBy: "You (Student)",
      uploadedAt: "Just now",
      fileType: "PDF",
      fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      pages: 42,
      downloads: 0,
      rating: 0,
      ratingCount: 0,
      modules: ["Module 1", "Module 2"],
      featured: false,
    };

    setIsUploadDone(true);
    setTimeout(() => {
      setNotes([newNote, ...notes]);
      setIsUploading(false);
      setIsUploadDone(false);
      setNewNoteTitle("");
      setNewNoteSubject("");
      setNewNoteCode("");
      setSelectedFile(null);
    }, 1000);
  };

  function renderStars(rating: number) {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground/30"
        }`}
      />
    ));
  }

  return (
    <div className="space-y-6 animate-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Study Notes</h1>
          <p className="text-sm text-muted-foreground">
            {notes.length} resources · Browse &amp; download study material
          </p>
        </div>

        {/* Only Faculty/Admin can upload study resources */}
        {(role === "teacher" || role === "admin") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 active-scale">
                <Upload className="h-4 w-4" />
                Upload PDF
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Upload Study Notes</DialogTitle>
              <DialogDescription>
                Share your handwritten or typed notes with the campus community. Only PDFs are allowed.
              </DialogDescription>
            </DialogHeader>
            {!isUploadDone ? (
              <form onSubmit={handleFileUpload} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Note Title</Label>
                  <Input 
                    placeholder="e.g. Unit 3 Handwritten Notes" 
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input 
                      placeholder="e.g. DBMS" 
                      value={newNoteSubject}
                      onChange={(e) => setNewNoteSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input 
                      placeholder="e.g. CS302" 
                      value={newNoteCode}
                      onChange={(e) => setNewNoteCode(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Choose PDF File</Label>
                  <div className="relative border-2 border-dashed border-border rounded-xl p-8 hover:bg-accent/50 transition-colors text-center cursor-pointer group">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">{selectedFile ? selectedFile.name : "Click to select or drag and drop"}</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF File (Max 50MB)</p>
                    </div>
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                         <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                      </span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                       <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full" disabled={isUploading || !selectedFile}>
                    {isUploading ? "Uploading..." : "Start Upload"}
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center animate-in">
                 <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                   <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                 </div>
                 <h3 className="text-xl font-bold">Successfully Shared!</h3>
                 <p className="text-sm text-muted-foreground mt-2">Your notes are now live and visible to all students in your department.</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by subject, module, code..."
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest min-w-[32px]">Dept</span>
          <div className="flex flex-wrap gap-1.5">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                  activeDept === dept
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest min-w-[32px]">Sem</span>
          <div className="flex flex-wrap gap-1.5">
            {semesters.map((sem) => (
              <button
                key={sem}
                onClick={() => setActiveSem(sem)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                  activeSem === sem
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {sem === 0 ? "All Sem" : `Sem ${sem}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Notes */}
      {featuredNotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            Featured Resources
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredNotes.map((note, idx) => (
              <Card
                key={note.id}
                className="group border-border/50 overflow-hidden transition-all duration-300 hover:border-border hover:shadow-xl hover:shadow-primary/5"
                style={{
                  animationDelay: `${idx * 80}ms`,
                  animation: "animate-in 0.4s ease-out both",
                }}
              >
                <div className="h-1" style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(280 90% 65%))" }} />
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 transition-transform duration-200 group-hover:scale-105">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
                        {note.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground/80">{note.subjectCode}</span> · {note.subject}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {note.modules.slice(0, 4).map((mod) => (
                          <span key={mod} className="rounded-md bg-accent/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            {mod}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs">
                          {renderStars(note.rating)}
                          <span className="ml-1 font-bold">{note.rating}</span>
                        </div>
                        <Button size="sm" variant="secondary" className="h-8 gap-1.5 text-xs active-scale">
                          <Download className="h-3.5 w-3.5" />
                          {note.fileSize}
                        </Button>
                      </div>

                      <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                         <span>{note.downloads} Downloads</span>
                         <span className="h-1 w-1 rounded-full bg-border" />
                         <span>{note.uploadedBy}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Notes */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          All Collections
        </h2>
        <div className="space-y-3">
          {regularNotes.map((note, idx) => (
            <Card
              key={note.id}
              className="group border-border/50 transition-all duration-300 hover:border-border hover:bg-accent/10"
              style={{
                animationDelay: `${(featuredNotes.length + idx) * 60}ms`,
                animation: "animate-in 0.4s ease-out both",
              }}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105 border border-primary/20">
                  <FileText className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-1">
                        {note.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        <span className="font-bold text-foreground/80">{note.subjectCode}</span> · Sem {note.semester} · {note.department}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0 opacity-80">
                      {renderStars(note.rating)}
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground font-semibold">
                    <span>{note.pages} Pages</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{note.downloads} Downloads</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{note.uploadedAt}</span>
                  </div>
                </div>

                <Button variant="ghost" size="icon" className="active-scale text-muted-foreground hover:text-primary">
                  <Download className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
