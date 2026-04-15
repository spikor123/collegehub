"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Megaphone,
  ShoppingBag,
  BarChart3,
  Search,
} from "lucide-react";

const items = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Notices", href: "/notices", icon: Megaphone },
  { label: "Search", href: "/search", icon: Search },
  { label: "Market", href: "/marketplace", icon: ShoppingBag },
  { label: "Polls", href: "/polls", icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full border-t border-border bg-card/80 backdrop-blur-xl lg:hidden safe-p-bottom">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200",
                isActive && "bg-primary/10 scale-110"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px]", isActive && "text-primary")} />
            </div>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
