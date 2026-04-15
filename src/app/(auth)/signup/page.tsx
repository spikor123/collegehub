"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Loader2, Mail, Lock, User, BookOpen, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/lib/store";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | "admin">("student");
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock Login: Bypass actual auth since Supabase is not configured yet
    login(selectedRole);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="glass animate-in border-border/50 max-w-md w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <GraduationCap className="h-7 w-7 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Join <span className="gradient-text">CollegeHub</span>
        </CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
      </CardHeader>

      <form onSubmit={handleSignup}>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Register As</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole("student")}
                className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-xs transition-colors ${
                  selectedRole === "student"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 hover:bg-accent/50 text-muted-foreground"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("teacher")}
                className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-xs transition-colors ${
                  selectedRole === "teacher"
                    ? "border-teal-400 bg-teal-500/10 text-teal-400"
                    : "border-border/50 hover:bg-accent/50 text-muted-foreground"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Teacher
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-xs transition-colors ${
                  selectedRole === "admin"
                    ? "border-rose-400 bg-rose-500/10 text-rose-400"
                    : "border-border/50 hover:bg-accent/50 text-muted-foreground"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">College Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@college.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              `Sign Up as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`
            )}
          </Button>

          <div className="rounded-lg bg-orange-500/10 p-3 text-[11px] text-orange-400 text-center border border-orange-500/20">
            <strong>Demo Mode:</strong> You can type anything and instantly try out the dashboard!
          </div>
        </CardContent>
      </form>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
