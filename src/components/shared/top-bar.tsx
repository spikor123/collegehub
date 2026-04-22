"use client";

import { GraduationCap, Bell, Search, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useCollegeStore } from "@/lib/store";

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const { banner } = useCollegeStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:px-6">
      {/* Mobile logo */}
      <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
          <GraduationCap className="h-4 w-4 text-primary" />
        </div>
        <span className="text-base font-bold">
          College<span className="text-primary">Hub</span>
        </span>
      </Link>

      {/* Dynamic College Banner Section */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-8 h-full">
        <div className="relative w-full max-w-2xl h-10 overflow-hidden rounded-xl border border-border/50 bg-accent/5 group transition-all hover:bg-accent/10">
          <img 
            src={banner} 
            alt="College Banner" 
            className="w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
          {/* Subtle vignette/fade for professional look */}
          <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-card pointer-events-none opacity-40" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" asChild className="lg:hidden">
          <Link href="/search">
            <Search className="h-[18px] w-[18px]" />
          </Link>
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
