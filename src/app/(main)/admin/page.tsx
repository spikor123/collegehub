"use client";

import {
  ShieldCheck,
  Users,
  Settings,
  Database,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";

export default function AdminPage() {
  const { role } = useAuthStore();

  if (role !== "admin") {
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

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">System overview, metrics, and configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,281</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-bold">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
            <Activity className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">Online</div>
            <p className="text-xs text-muted-foreground mt-1">
              All services running normally
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Storage Uses</CardTitle>
            <Database className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.5 GB</div>
            <p className="text-xs text-muted-foreground mt-1">
              of 100 GB allocated
            </p>
            <div className="w-full bg-accent h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full w-[42.5%]"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Recent Audit Logs</CardTitle>
            <CardDescription>System events tracked over the last 24 hours.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 1, action: "User Role Updated", user: "admin@college.edu", time: "10 mins ago", type: "info" },
              { id: 2, action: "Failed DB Backup", user: "system", time: "1 hour ago", type: "error" },
              { id: 3, action: "Notice Pinned", user: "principal@college.edu", time: "2 hours ago", type: "success" },
              { id: 4, action: "New Semester Created", user: "admin@college.edu", time: "5 hours ago", type: "info" },
            ].map(log => (
              <div key={log.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md ${
                    log.type === "error" ? "bg-rose-500/10 text-rose-400" :
                    log.type === "success" ? "bg-emerald-500/10 text-emerald-400" :
                    "bg-blue-500/10 text-blue-400"
                  }`}>
                    {log.type === "error" ? <AlertTriangle className="h-4 w-4" /> : 
                     log.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : 
                     <Server className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">by {log.user}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{log.time}</span>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">View All Logs</Button>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Role Management</CardTitle>
            <CardDescription>Manage application role permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/10 rounded-full"><ShieldCheck className="h-4 w-4 text-rose-400" /></div>
                  <div>
                    <h4 className="text-sm font-semibold">Administrator</h4>
                    <p className="text-xs text-muted-foreground">Full system access and configuration.</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>

              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-500/10 rounded-full"><Users className="h-4 w-4 text-teal-400" /></div>
                  <div>
                    <h4 className="text-sm font-semibold">Faculty / Teacher</h4>
                    <p className="text-xs text-muted-foreground">Can post notices, mark attendance, view data.</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full"><Users className="h-4 w-4 text-primary" /></div>
                  <div>
                    <h4 className="text-sm font-semibold">Student</h4>
                    <p className="text-xs text-muted-foreground">Read-only system access, can post in marketplace.</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>
            <Button className="w-full mt-6" variant="secondary">Create Custom Role</Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
