"use client";

import React, { useMemo, useState } from "react";
import { Crown, Lock, Sparkles, Play, Plus } from "lucide-react";

type VideoItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string; // original URL kept, but not embedded
};

const ALL_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Intro to HTML & CSS",
    description:
      "Start your web journey with the building blocks of the web—HTML tags, CSS selectors, and layouts.",
    category: "Web Dev",
    url: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
  },
  {
    id: "v2",
    title: "JavaScript Basics Crash Course",
    description:
      "Variables, functions, loops, and DOM intro to kickstart your JS fundamentals.",
    category: "Web Dev",
    url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
  },
  {
    id: "v3",
    title: "React in 100 Minutes",
    description:
      "Modern React concepts: hooks, components, props/state, and mental models.",
    category: "Frontend",
    url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
  },
  {
    id: "v4",
    title: "Next.js App Router Guide",
    description:
      "Routing, layouts, server vs client components—see how Next.js 13+ levels up DX.",
    category: "Frontend",
    url: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA",
  },
  {
    id: "v5",
    title: "Tailwind CSS Mastery",
    description:
      "From utility-first basics to responsive design and glassmorphism with Tailwind.",
    category: "Design",
    url: "https://www.youtube.com/watch?v=mr15Xzb1Ook",
  },
];

export default function Page() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [myClassroom, setMyClassroom] = useState<string[]>([]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(ALL_VIDEOS.map((v) => v.category)))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_VIDEOS.filter((v) => {
      const matchesCategory = category === "All" || v.category === category;
      const matchesQuery =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  function handleAddToClassroom(id: string) {
    setMyClassroom((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-slate-900 bg-white/40 backdrop-blur-2xl">
      {/* Top Bar (kept your colors and glass look) */}
      <div className="mx-auto max-w-7xl px-4 pt-10 mb-16">
        <div className="rounded-3xl flex px-8 py-4 md:py-6 bg-white/40 backdrop-blur-2xl ring-1 ring-white/50 shadow-[0_20px_120px_rgba(168,85,247,0.35)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40" />
            <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              Premium Classroom
              <Crown className="h-5 w-5 text-violet-500" />
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 rounded-2xl px-3 py-2 backdrop-blur-xl bg-white/50 shadow-[0_8px_40px_rgba(0,0,0,0.08)] ring-1 ring-white/40 border border-black/10">
              <svg
                aria-hidden
                className="h-5 w-5 opacity-70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.1-4.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z"
                />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search premium courses…"
                className="bg-transparent outline-none placeholder:text-slate-600/70 w-72"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl px-3 py-2 backdrop-blur-xl bg-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-black/10 ring-1 ring-white/40"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="hidden sm:block rounded-xl px-3 py-2 backdrop-blur-xl bg-white/60 border border-black/10 ring-1 ring-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
              <span className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                My Classroom: {myClassroom.length}
              </span>
            </div>
          </div>
        </div>
      </div>

    
      {/* Grid of premium cards with placeholder (no embeds) */}
      <main className="mx-auto max-w-7xl px-4 pb-20">
        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl p-8 text-center bg-white/60 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_12px_80px_rgba(0,0,0,0.08)]">
            <p className="text-slate-700">
              No courses matched your search. Try another keyword or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 mt-8">
            {filtered.map((v) => {
              const isAdded = myClassroom.includes(v.id);

              return (
                <article
                  key={v.id}
                  className="group rounded-3xl overflow-hidden ring-1 ring-white/50 backdrop-blur-2xl bg-white/50 shadow-[0_24px_120px_rgba(236,72,153,0.25)] hover:shadow-[0_28px_140px_rgba(168,85,247,0.35)] transition-shadow"
                >
                  {/* VIDEO PLACEHOLDER (kept your colors) */}
                  <div className="relative">
                    <div className="aspect-video w-full overflow-hidden">
                      <div className="h-full w-full relative bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-500/20">
                        {/* Faux thumbnail shimmer */}
                        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.45),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.30),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.25),transparent_45%)]" />
                        {/* Center Play button */}
                        <button
                          type="button"
                          className="absolute inset-0 m-auto h-16 w-16 grid place-items-center rounded-full bg-white/70 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:bg-white transition"
                          title="Preview locked"
                          disabled
                        >
                          <Play className="h-7 w-7 text-indigo-600" />
                        </button>
                        {/* Lock badge */}
                        <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-200/70 ring-1 ring-indigo-300/60">
                          <Lock className="h-3.5 w-3.5" />
                          Premium
                        </div>
                        {/* Glow edge */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/0 via-transparent to-white/10" />
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5 md:p-6">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-200/60 ring-1 ring-indigo-300/60">
                      {v.category}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold leading-snug">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm md:text-[15px] text-slate-700">
                      {v.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <button
                        onClick={() => handleAddToClassroom(v.id)}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 shadow-[0_12px_48px_rgba(168,85,247,0.55)] hover:shadow-[0_12px_48px_rgba(168,85,247,0.65)] active:scale-[0.98] transition"
                      >
                        {isAdded ? (
                          <span className="inline-flex items-center gap-2">
                            Added <Sparkles className="h-4 w-4" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add to Classroom
                          </span>
                        )}
                      </button>

                      <a
                        href={v.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-indigo-500 hover:underline"
                        title="Open original video"
                      >
                        Open Video →
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}