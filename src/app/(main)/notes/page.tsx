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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const demoNotes: Note[] = [
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
  {
    id: "3",
    title: "Operating Systems — Galvin Summary",
    subject: "Operating Systems",
    subjectCode: "CS303",
    department: "CSE",
    semester: 4,
    uploadedBy: "Rahul V.",
    uploadedAt: "2 weeks ago",
    fileType: "PDF",
    fileSize: "8.7 MB",
    pages: 52,
    downloads: 189,
    rating: 4.5,
    ratingCount: 28,
    modules: ["Process Mgmt", "Memory Mgmt", "File Systems", "Deadlocks"],
    featured: false,
  },
  {
    id: "4",
    title: "Engineering Mathematics IV — Integration & Series",
    subject: "Engineering Mathematics IV",
    subjectCode: "MA401",
    department: "Applied Sciences",
    semester: 4,
    uploadedBy: "Deepa K.",
    uploadedAt: "2 weeks ago",
    fileType: "PDF",
    fileSize: "15.3 MB",
    pages: 94,
    downloads: 278,
    rating: 4.6,
    ratingCount: 34,
    modules: ["Complex Variables", "Laplace Transform", "Fourier Series", "Z-Transform"],
    featured: false,
  },
  {
    id: "5",
    title: "Computer Networks — Kurose Notes",
    subject: "Computer Networks",
    subjectCode: "CS304",
    department: "CSE",
    semester: 4,
    uploadedBy: "Mohit G.",
    uploadedAt: "3 weeks ago",
    fileType: "PDF",
    fileSize: "11.2 MB",
    pages: 78,
    downloads: 203,
    rating: 4.3,
    ratingCount: 19,
    modules: ["OSI Model", "TCP/IP", "Routing", "Transport Layer"],
    featured: false,
  },
  {
    id: "6",
    title: "Software Engineering — Complete Module Notes",
    subject: "Software Engineering",
    subjectCode: "CS305",
    department: "CSE",
    semester: 5,
    uploadedBy: "Sneha R.",
    uploadedAt: "1 month ago",
    fileType: "PDF",
    fileSize: "6.8 MB",
    pages: 45,
    downloads: 156,
    rating: 4.2,
    ratingCount: 15,
    modules: ["SDLC", "UML Diagrams", "Testing", "Agile"],
    featured: false,
  },
];

const departments = ["All", "CSE", "Applied Sciences"];
const semesters = [0, 3, 4, 5]; // 0 = All

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDept, setActiveDept] = useState("All");
  const [activeSem, setActiveSem] = useState(0);

  const filtered = demoNotes.filter((note) => {
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
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Study Notes</h1>
          <p className="text-sm text-muted-foreground">
            {demoNotes.length} resources · Browse &amp; download study material
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Upload className="h-4 w-4" />
          Upload Notes
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by subject, module, code..."
            className="pl-10"
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
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dept</span>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
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
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sem</span>
          <div className="flex flex-wrap gap-2">
            {semesters.map((sem) => (
              <button
                key={sem}
                onClick={() => setActiveSem(sem)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  activeSem === sem
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {sem === 0 ? "All" : `Sem ${sem}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Notes */}
      {featuredNotes.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            Top Rated
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredNotes.map((note, idx) => (
              <Card
                key={note.id}
                className="group border-border/50 overflow-hidden transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5"
                style={{
                  animationDelay: `${idx * 80}ms`,
                  animation: "animate-in 0.4s ease-out both",
                }}
              >
                <div className="h-1" style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(280 90% 65%))" }} />
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 transition-transform duration-200 group-hover:scale-105">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-1">
                        {note.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/80">{note.subjectCode}</span> · {note.subject}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {note.modules.slice(0, 4).map((mod) => (
                          <span key={mod} className="rounded-md bg-accent/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {mod}
                          </span>
                        ))}
                        {note.modules.length > 4 && (
                          <span className="rounded-md bg-accent/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            +{note.modules.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-0.5">
                            {renderStars(note.rating)}
                            <span className="ml-1 font-semibold text-foreground">{note.rating}</span>
                            <span>({note.ratingCount})</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
                          <Download className="h-3 w-3" />
                          {note.fileSize}
                        </Button>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span>{note.pages} pages</span>
                        <span>·</span>
                        <span>{note.downloads} downloads</span>
                        <span>·</span>
                        <span>by {note.uploadedBy}</span>
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
      {regularNotes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            All Notes
          </h2>
          <div className="space-y-3">
            {regularNotes.map((note, idx) => (
              <Card
                key={note.id}
                className="group border-border/50 transition-all duration-300 hover:border-border"
                style={{
                  animationDelay: `${(featuredNotes.length + idx) * 60}ms`,
                  animation: "animate-in 0.4s ease-out both",
                }}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 transition-transform duration-200 group-hover:scale-105">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-1">
                          {note.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/80">{note.subjectCode}</span> · Sem {note.semester} · {note.department}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {renderStars(note.rating)}
                        <span className="ml-1 text-xs font-semibold">{note.rating}</span>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>{note.pages} pages</span>
                      <span>·</span>
                      <span>{note.downloads} downloads</span>
                      <span>·</span>
                      <span>{note.uploadedAt}</span>
                    </div>
                  </div>

                  <Button size="sm" variant="ghost" className="hidden sm:flex h-8 gap-1 text-xs shrink-0">
                    <Download className="h-3 w-3" />
                    {note.fileSize}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10">
              <Search className="h-8 w-8 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold">No notes found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try adjusting your search, department, or semester filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
