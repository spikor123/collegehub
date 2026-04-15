"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Heart,
  MessageCircle,
  Tag,
  IndianRupee,
  BookOpen,
  Laptop,
  Headphones,
  Shirt,
  Home,
  MoreHorizontal,
  X,
  Grid3X3,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface MarketItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair";
  seller: string;
  postedAt: string;
  likes: number;
  messages: number;
  image: string;
  sold: boolean;
}

const demoItems: MarketItem[] = [
  {
    id: "1",
    title: "Engineering Mathematics — B.S. Grewal (4th Ed)",
    description: "Well-maintained textbook. No marks or highlights. Covers all modules for 1st and 2nd year.",
    price: 250,
    originalPrice: 650,
    category: "Books",
    condition: "Good",
    seller: "@stud8a3f2c",
    postedAt: "2 hours ago",
    likes: 12,
    messages: 4,
    image: "📘",
    sold: false,
  },
  {
    id: "2",
    title: "HP Laptop Charger 65W Type-C",
    description: "Original HP charger, works with HP Pavilion and Envy series. 6 months old, in perfect condition.",
    price: 400,
    originalPrice: 1200,
    category: "Electronics",
    condition: "Like New",
    seller: "@stud2b7e9d",
    postedAt: "5 hours ago",
    likes: 8,
    messages: 6,
    image: "🔌",
    sold: false,
  },
  {
    id: "3",
    title: "Scientific Calculator — Casio fx-991EX",
    description: "Barely used Casio calculator. Perfect for engineering exams. Comes with original cover.",
    price: 800,
    originalPrice: 1600,
    category: "Electronics",
    condition: "Like New",
    seller: "@stud5c1d4a",
    postedAt: "1 day ago",
    likes: 23,
    messages: 9,
    image: "🔢",
    sold: false,
  },
  {
    id: "4",
    title: "JBL Tune 510BT Wireless Headphones",
    description: "Blue color, 40h battery life. Light scratches on band but works perfectly. Includes charging cable.",
    price: 1200,
    originalPrice: 3500,
    category: "Electronics",
    condition: "Good",
    seller: "@stud9e8f3b",
    postedAt: "1 day ago",
    likes: 34,
    messages: 15,
    image: "🎧",
    sold: false,
  },
  {
    id: "5",
    title: "Data Structures & Algorithms Notes — Full Semester",
    description: "Handwritten notes covering all topics. Includes solved previous year questions from 2022-2025.",
    price: 150,
    category: "Notes",
    condition: "Good",
    seller: "@stud3a7b1e",
    postedAt: "2 days ago",
    likes: 45,
    messages: 22,
    image: "📝",
    sold: false,
  },
  {
    id: "6",
    title: "College Hoodie — CSE Department (Size L)",
    description: "Official CSE department hoodie from 2025 batch. Navy blue, worn twice. Size Large.",
    price: 500,
    originalPrice: 1200,
    category: "Clothing",
    condition: "Like New",
    seller: "@stud6d2c8f",
    postedAt: "3 days ago",
    likes: 19,
    messages: 7,
    image: "👕",
    sold: false,
  },
  {
    id: "7",
    title: "Room Desk Lamp — LED with USB Port",
    description: "Adjustable LED desk lamp with USB charging port. 3 brightness levels. Great for late-night study.",
    price: 350,
    originalPrice: 800,
    category: "Hostel",
    condition: "Good",
    seller: "@stud1f4a9c",
    postedAt: "3 days ago",
    likes: 11,
    messages: 3,
    image: "💡",
    sold: false,
  },
  {
    id: "8",
    title: "Operating Systems — Galvin (9th Edition)",
    description: "Standard OS textbook. Some highlighting in chapters 1-5. All pages intact.",
    price: 200,
    originalPrice: 550,
    category: "Books",
    condition: "Fair",
    seller: "@stud4b6e2d",
    postedAt: "4 days ago",
    likes: 7,
    messages: 2,
    image: "📗",
    sold: true,
  },
];

const categories = [
  { label: "All", icon: ShoppingBag },
  { label: "Books", icon: BookOpen },
  { label: "Electronics", icon: Laptop },
  { label: "Notes", icon: Tag },
  { label: "Clothing", icon: Shirt },
  { label: "Hostel", icon: Home },
];

const conditionColors: Record<string, string> = {
  New: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Like New": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Good: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Fair: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredItems = demoItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-sm text-muted-foreground">
            {demoItems.filter((i) => !i.sold).length} items available · Buy &amp; sell within campus
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Sell Item
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search books, gadgets, notes..."
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
        <div className="flex rounded-lg border border-border">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex h-9 w-9 items-center justify-center rounded-l-lg transition-colors ${
              viewMode === "grid"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex h-9 w-9 items-center justify-center rounded-r-lg border-l border-border transition-colors ${
              viewMode === "list"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(cat.label)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeCategory === cat.label
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <cat.icon className="h-3 w-3" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items Grid / List */}
      <div
        className={
          viewMode === "grid"
            ? "grid gap-4 grid-cols-1 sm:grid-cols-2"
            : "space-y-3"
        }
      >
        {filteredItems.map((item, idx) => (
          <Card
            key={item.id}
            className={`group border-border/50 overflow-hidden transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5 ${
              item.sold ? "opacity-60" : ""
            }`}
            style={{
              animationDelay: `${idx * 60}ms`,
              animation: "animate-in 0.4s ease-out both",
            }}
          >
            <CardContent
              className={
                viewMode === "list" ? "flex items-center gap-4 p-4" : "p-4"
              }
            >
              {/* Emoji image area */}
              <div
                className={`${
                  viewMode === "grid"
                    ? "mb-3 flex h-28 items-center justify-center rounded-xl bg-accent/50"
                    : "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/50"
                } text-3xl transition-transform duration-200 group-hover:scale-[1.02]`}
              >
                {item.image}
                {item.sold && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80">
                    <span className="rounded-full bg-destructive/20 px-3 py-1 text-xs font-bold text-destructive">
                      SOLD
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={`${
                      viewMode === "grid" ? "text-sm" : "text-sm"
                    } font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-1`}
                  >
                    {item.title}
                  </h3>
                  {viewMode === "grid" && (
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                        conditionColors[item.condition]
                      }`}
                    >
                      {item.condition}
                    </span>
                  )}
                </div>

                {viewMode === "grid" && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center text-base font-bold text-primary">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                    {item.originalPrice && (
                      <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        {Math.round(
                          ((item.originalPrice - item.price) /
                            item.originalPrice) *
                            100
                        )}
                        % off
                      </span>
                    )}
                  </div>
                  {viewMode === "list" && (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                        conditionColors[item.condition]
                      }`}
                    >
                      {item.condition}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span>{item.seller}</span>
                    <span>·</span>
                    <span>{item.postedAt}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button className="flex items-center gap-1 transition-colors hover:text-red-400">
                      <Heart className="h-3 w-3" />
                      {item.likes}
                    </button>
                    <button className="flex items-center gap-1 transition-colors hover:text-primary">
                      <MessageCircle className="h-3 w-3" />
                      {item.messages}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10">
              <Search className="h-8 w-8 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold">No items found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try adjusting your search or category filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
