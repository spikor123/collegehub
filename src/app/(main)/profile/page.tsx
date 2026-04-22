"use client";

import {
  User,
  Mail,
  BookOpen,
  Code,
  GraduationCap,
  Edit,
  Settings,
  Bell,
  Shield,
  Megaphone,
  ShoppingBag,
  FileText,
  BarChart3,
  LogOut,
  Calendar,
  Award,
  TrendingUp,
  Heart,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useTheme } from "next-themes";
import { NotificationService } from "@/lib/notifications";
import { useEffect, useState } from "react";

const profileData = {
  name: "Anirban Das",
  username: "@anirban_cse",
  bio: "CSE undergrad | Full-stack dev | Open source enthusiast | Building cool stuff 🚀",
  email: "anirban.das@college.edu.in",
  branch: "Computer Science & Engineering",
  semester: "6th Semester",
  section: "CSE-A",
  marketplaceId: "@stud8a3f2c",
  joinedDate: "Aug 2023",
  avatar: "AD",
};

const stats = [
  { label: "Notices Read", value: "47", icon: Megaphone, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Items Listed", value: "3", icon: ShoppingBag, color: "text-orange-400", bg: "bg-orange-500/10" },
  { label: "Notes Shared", value: "5", icon: FileText, color: "text-teal-400", bg: "bg-teal-500/10" },
  { label: "Polls Voted", value: "12", icon: BarChart3, color: "text-purple-400", bg: "bg-purple-500/10" },
];

const achievements = [
  { label: "Early Adopter", description: "Joined in the first month", icon: "🌟" },
  { label: "Note Master", description: "Shared 5+ study materials", icon: "📚" },
  { label: "Market Maven", description: "Listed 3+ items for sale", icon: "🛒" },
  { label: "Active Voter", description: "Voted in 10+ polls", icon: "🗳️" },
];

const recentActivity = [
  { action: "Voted on", target: "Wi-Fi Infrastructure poll", time: "2 hours ago", icon: BarChart3 },
  { action: "Downloaded", target: "DSA Complete Notes", time: "5 hours ago", icon: FileText },
  { action: "Viewed", target: "Mid-Semester Exam Schedule", time: "1 day ago", icon: Megaphone },
  { action: "Listed", target: "Engineering Maths textbook", time: "2 days ago", icon: ShoppingBag },
  { action: "Submitted", target: "OS Lab Assignment", time: "3 days ago", icon: GraduationCap },
];

export default function ProfilePage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Check initial permission on mount
    if (NotificationService.getPermission() === "granted") {
      setNotificationsEnabled(true);
    }
  }, []);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="border-border/50 overflow-hidden">
        {/* Banner */}
        <div className="relative h-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-500/25 to-pink-500/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.3),transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <CardContent className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-14 mb-4 flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-card bg-gradient-to-br from-primary/80 to-purple-600/80 text-2xl font-bold text-white shadow-xl shadow-primary/20">
            {profileData.avatar}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-sm text-primary font-medium">{profileData.username}</p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {profileData.bio}
              </p>
              <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Joined {profileData.joinedDate}
              </p>
            </div>
          </div>

          {/* Info grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Branch", value: profileData.branch, icon: GraduationCap },
              { label: "Semester", value: profileData.semester, icon: BookOpen },
              { label: "Email", value: profileData.email, icon: Mail },
              { label: "Marketplace ID", value: profileData.marketplaceId, icon: Code },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border/50 p-3 transition-colors hover:bg-accent/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <item.icon className="h-3 w-3" />
                  {item.label}
                </div>
                <p className="mt-1 text-sm font-medium truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <Card
            key={stat.label}
            className="border-border/50 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5"
            style={{
              animationDelay: `${idx * 80}ms`,
              animation: "animate-in 0.4s ease-out both",
            }}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Achievements */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4 text-amber-400" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {achievements.map((ach) => (
              <div
                key={ach.label}
                className="flex items-center gap-3 rounded-xl border border-border/50 p-3 transition-colors hover:bg-accent/30"
              >
                <span className="text-2xl">{ach.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{ach.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{ach.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentActivity.map((act, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/30"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/50">
                  <act.icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs">
                    <span className="text-muted-foreground">{act.action}</span>{" "}
                    <span className="font-medium">{act.target}</span>
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">{act.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Settings Section */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4 text-muted-foreground" />
            Quick Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {[
            {
              label: "Dark Mode",
              description: "Toggle dark/light appearance",
              icon: resolvedTheme === "dark" ? Moon : Sun,
              action: (
                <button
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    resolvedTheme === "dark" ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      resolvedTheme === "dark" ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              ),
            },
            {
              label: "Push Notifications",
              description: "Get notified about important updates",
              icon: Bell,
              action: (
                <button
                  onClick={async () => {
                    if (notificationsEnabled) {
                      setNotificationsEnabled(false);
                    } else {
                      const permission = await NotificationService.requestPermission();
                      if (permission === "granted") {
                        setNotificationsEnabled(true);
                        NotificationService.sendWelcome();
                      }
                    }
                  }}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    notificationsEnabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      notificationsEnabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              ),
            },
            {
              label: "Privacy",
              description: "Manage your data & visibility",
              icon: Shield,
              action: <Button variant="ghost" size="sm" className="h-7 text-xs">Manage</Button>,
            },
          ].map((setting) => (
            <div
              key={setting.label}
              className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-accent/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/50">
                  <setting.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{setting.label}</p>
                  <p className="text-[11px] text-muted-foreground">{setting.description}</p>
                </div>
              </div>
              {setting.action}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
