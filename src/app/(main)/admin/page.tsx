"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Users,
  Database,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  Building2,
  Image as ImageIcon,
  Type,
  MapPin,
  Save,
  Eye,
  Fingerprint,
  Lock,
  Trash2,
  Clock,
  FileText,
  Shield,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore, useCollegeStore } from "@/lib/store";
import { useAuditStore, type AuditEntry, type AuditSeverity } from "@/lib/audit-store";

const severityConfig: Record<AuditSeverity, { color: string; bg: string; icon: typeof AlertTriangle }> = {
  critical: { color: "text-rose-400", bg: "bg-rose-500/10", icon: AlertTriangle },
  warning: { color: "text-amber-400", bg: "bg-amber-500/10", icon: Shield },
  success: { color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  info: { color: "text-blue-400", bg: "bg-blue-500/10", icon: Server },
};

export default function AdminPage() {
  const { role } = useAuthStore();
  const college = useCollegeStore();
  const { entries: auditEntries, log: logAudit, clearOlderThan } = useAuditStore();

  const [clgName, setClgName] = useState(college.name);
  const [clgShort, setClgShort] = useState(college.shortName);
  const [clgTag, setClgTag] = useState(college.tagline);
  const [clgLogo, setClgLogo] = useState(college.logo);
  const [clgBanner, setClgBanner] = useState(college.banner);
  const [clgLoc, setClgLoc] = useState(college.location);
  const [auditFilter, setAuditFilter] = useState<AuditSeverity | "all">("all");

  if (role !== "admin") {
    // Log unauthorized access attempt
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-8 text-center animate-in">
        <div className="rounded-2xl bg-destructive/10 p-6 text-destructive mb-6">
          <ShieldCheck className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold">Admin Only</h2>
        <p className="mt-2 text-muted-foreground">You need administrator privileges to view this page.</p>
      </div>
    );
  }

  const handleUpdate = () => {
    college.updateDetails({
      name: clgName,
      shortName: clgShort,
      tagline: clgTag,
      logo: clgLogo,
      banner: clgBanner,
      location: clgLoc,
    });
    logAudit({
      action: "BRANDING_UPDATED",
      severity: "warning",
      actor: "admin@college.edu",
      role: "admin",
      target: "Institution Settings",
      details: `Name: ${clgName}, Short: ${clgShort}`,
    });
  };

  const filteredAudit = auditFilter === "all"
    ? auditEntries
    : auditEntries.filter((e) => e.severity === auditFilter);

  function formatTimestamp(ts: string) {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="space-y-6 animate-in pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Command Center</h1>
        <p className="text-sm text-muted-foreground">Full system control, security monitoring, and institution branding.</p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Users", value: "4,281", change: "+12%", icon: Users, color: "text-primary", bg: "bg-primary/10" },
          { title: "System Status", value: "Online", change: "All services OK", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { title: "Security Events", value: String(auditEntries.filter(e => e.severity === "critical" || e.severity === "warning").length), change: "Needs review", icon: Shield, color: "text-amber-400", bg: "bg-amber-500/10" },
          { title: "Storage", value: "42.5 GB", change: "of 100 GB", icon: Database, color: "text-blue-400", bg: "bg-blue-500/10" },
        ].map((m) => (
          <Card key={m.title} className="border-border/50">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 ${m.bg} rounded-2xl shrink-0`}>
                <m.icon className={`h-5 w-5 ${m.color}`} />
              </div>
              <div>
                <p className="text-xl font-black">{m.value}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{m.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* College Customization */}
      <Card className="border-border/50 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Institution Customization
          </CardTitle>
          <CardDescription>Update your college branding. All changes are tracked in the audit log.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" /> Full Name</Label>
                <Input value={clgName} onChange={(e) => setClgName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Type className="h-3.5 w-3.5" /> Short Name</Label>
                <Input value={clgShort} onChange={(e) => setClgShort(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> Tagline</Label>
                <Input value={clgTag} onChange={(e) => setClgTag(e.target.value)} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><ImageIcon className="h-3.5 w-3.5" /> Logo URL</Label>
                <Input value={clgLogo} onChange={(e) => setClgLogo(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><ImageIcon className="h-3.5 w-3.5" /> Banner URL</Label>
                <Input value={clgBanner} onChange={(e) => setClgBanner(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Location</Label>
                <Input value={clgLoc} onChange={(e) => setClgLoc(e.target.value)} />
              </div>
              <div className="pt-6">
                <Button className="w-full gap-2 active-scale" onClick={handleUpdate}>
                  <Save className="h-4 w-4" /> Save & Log Changes
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ——— AUDIT LOG ——— */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5 text-primary" />
                Security Audit Log
              </CardTitle>
              <CardDescription>{auditEntries.length} events recorded · Device fingerprinting enabled</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {(["all", "critical", "warning", "success", "info"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setAuditFilter(s)}
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                      auditFilter === s
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logAudit({
                    action: "SETTINGS_CHANGED",
                    severity: "info",
                    actor: "admin@college.edu",
                    role: "admin",
                    target: "Seed Data",
                    details: "Test event logged",
                  });
                }}
                className="text-xs"
              >
                + Test Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAudit.length === 0 ? (
              <div className="py-16 text-center">
                <Fingerprint className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-sm font-bold text-muted-foreground/40">NO EVENTS RECORDED</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Click "Test Event" above to seed an entry.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {filteredAudit.slice(0, 50).map((entry) => {
                  const config = severityConfig[entry.severity];
                  const Icon = config.icon;
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border border-border/30 transition-colors hover:bg-accent/20 ${config.bg} bg-opacity-30`}
                    >
                      <div className={`p-2 rounded-lg ${config.bg} shrink-0 mt-0.5`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold">{entry.action.replace(/_/g, " ")}</p>
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                            entry.severity === "critical"
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : entry.severity === "warning"
                              ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                              : entry.severity === "success"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                          }`}>
                            {entry.severity}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-[10px] text-muted-foreground font-semibold">
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {entry.actor}</span>
                          <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> {entry.role}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTimestamp(entry.timestamp)}</span>
                          {entry.target && (
                            <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {entry.target}</span>
                          )}
                        </div>
                        {entry.details && (
                          <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono truncate">{entry.details}</p>
                        )}
                        <p className="text-[9px] text-muted-foreground/40 mt-1 font-mono flex items-center gap-1">
                          <Fingerprint className="h-2.5 w-2.5" /> {entry.ipFingerprint}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Role Management */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Role-Based Access Control</CardTitle>
          <CardDescription>Enforce permission boundaries. Role spoofing is tracked by the audit system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Administrator", desc: "Full system access, branding, audit logs.", icon: ShieldCheck, color: "bg-rose-500/10", iconColor: "text-rose-400", perms: ["Create/Delete Users", "View Audit Logs", "Change Institution", "Manage Roles"] },
              { name: "Faculty / Teacher", desc: "Post notices, upload resources, mark attendance.", icon: Users, color: "bg-teal-500/10", iconColor: "text-teal-400", perms: ["Post Notices", "Upload PDFs", "Mark Attendance", "Create Assignments"] },
              { name: "Student", desc: "Read-only campus access, personal calendar, marketplace.", icon: Users, color: "bg-primary/10", iconColor: "text-primary", perms: ["View Notices", "Download Notes", "Submit Assignments", "Personal Calendar"] },
            ].map((r) => (
              <div key={r.name} className="flex items-start gap-4 border border-border/30 rounded-xl p-4">
                <div className={`p-2.5 ${r.color} rounded-2xl shrink-0`}>
                  <r.icon className={`h-5 w-5 ${r.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{r.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {r.perms.map((p) => (
                      <span key={p} className="text-[9px] font-bold text-muted-foreground bg-accent/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
