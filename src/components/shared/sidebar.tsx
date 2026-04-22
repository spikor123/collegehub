"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Megaphone,
  CalendarDays,
  BookOpen,
  ShoppingBag,
  BarChart3,
  FileText,
  ClipboardList,
  Search,
  GraduationCap,
  LogOut,
  User,
  Users,
  CheckSquare,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { useAuthStore, useCollegeStore } from "@/lib/store";
import { useRouter } from "next/navigation";

const baseNav = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Notices", href: "/notices", icon: Megaphone },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Assignments", href: "/assignments", icon: ClipboardList },
  { label: "Notes", href: "/notes", icon: BookOpen },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Polls", href: "/polls", icon: BarChart3 },
];

const secondaryNav = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Search", href: "/search", icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Use mock auth state
  const { role, logout } = useAuthStore();
  const { name, shortName } = useCollegeStore();

  function handleLogout() {
    logout();
    router.push("/login");
    router.refresh();
  }

  // Define role specific navigation
  const roleNav = [];
  if (role === "student") {
    roleNav.push({ label: "My Attendance", href: "/attendance", icon: CheckSquare });
  }
  if (role === "teacher" || role === "admin") {
    roleNav.push({ label: "Attendance", href: "/attendance", icon: CheckSquare });
    roleNav.push({ label: "Student Data", href: "/students", icon: Users });
  }
  if (role === "admin") {
    roleNav.push({ label: "Admin Panel", href: "/admin", icon: ShieldCheck });
  }

  return (
    <aside className="hidden lg:flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <GraduationCap className="h-5 w-5 text-primary" />
        </div>
        <span className="text-lg font-bold tracking-tight">
          {shortName}<span className="text-primary">Hub</span>
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex justify-between items-center">
          Main Menu
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
            role === "admin" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
            role === "teacher" ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" :
            "bg-primary/10 text-primary border border-primary/20"
          }`}>
            {role.toUpperCase()}
          </span>
        </p>
        
        {baseNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px]", isActive && "text-primary")} />
              {item.label}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}

        {/* Role Specific Navigation */}
        {roleNav.length > 0 && (
          <>
            <div className="my-4 border-t border-border" />
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {role === "admin" ? "Management" : "Faculty Tools"}
            </p>
            {roleNav.map((item) => {
              const isActive = pathname === item.href;
              const themeColor = role === "admin" ? "text-rose-400" : "text-teal-400";
              const themeBg = role === "admin" ? "bg-rose-500/10" : "bg-teal-500/10";
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? `${themeBg} ${themeColor}`
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-[18px] w-[18px]", isActive ? themeColor : "")} />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}

        <div className="my-4 border-t border-border" />

        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Account
        </p>
        {secondaryNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-border p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
