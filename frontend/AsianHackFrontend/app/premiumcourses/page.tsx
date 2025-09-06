"use client";

import React, { useMemo, useState } from "react";
import { Crown, Lock, Sparkles, Play, Plus, BookOpen, Star } from "lucide-react";

type VideoItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  url: string;
  creator: { name: string; title: string; faculty: string };
  reviews: { stars: number; count: number };
  image: string;
};

const ALL_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Intro to HTML & CSS",
    description: "Start your web journey with HTML & CSS.",
    category: "Web Dev",
    price: 199,
    url: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
    creator: { name: "Dr. Laxmi Shrestha", title: "Dr.", faculty: "Computer Science" },
    reviews: { stars: 4.5, count: 120 },
    image: "/images/html.png"
  },
  {
    id: "v2",
    title: "JavaScript Basics Crash Course",
    description: "Variables, functions, loops, and DOM intro.",
    category: "Web Dev",
    price: 299,
    url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    creator: { name: "Er. Anil KC", title: "Er.", faculty: "Software Engineering" },
    reviews: { stars: 4.7, count: 95 },
    image: "/images/js.png"
  },
  {
    id: "v3",
    title: "React in 100 Minutes",
    description: "Hooks, components, props/state, and mental models.",
    category: "Frontend",
    price: 499,
    url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
    creator: { name: "Dr. Sita Rana", title: "Dr.", faculty: "Frontend Development" },
    reviews: { stars: 4.8, count: 80 },
    image: "/images/react.png"
  },
  {
    id: "v4",
    title: "Next.js App Router Guide",
    description: "Routing, layouts, server vs client components.",
    category: "Frontend",
    price: 599,
    url: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA",
    creator: { name: "Er. Ramesh Thapa", title: "Er.", faculty: "Full Stack Development" },
    reviews: { stars: 4.6, count: 110 },
    image: "/images/next.png"
  },
  {
    id: "v5",
    title: "Tailwind CSS Mastery",
    description: "Utility-first basics to glassmorphism with Tailwind.",
    category: "Design",
    price: 399,
    url: "https://www.youtube.com/watch?v=mr15Xzb1Ook",
    creator: { name: "Dr. Maya Gurung", title: "Dr.", faculty: "UI/UX Design" },
    reviews: { stars: 4.7, count: 70 },
    image: "/images/tailwind.png"
  },
];

export default function Page() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [myClassroom, setMyClassroom] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(ALL_VIDEOS.map((v) => v.category)))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_VIDEOS.filter((v) => {
      const matchesCategory = category === "All" || v.category === category;
      const matchesQuery =
        !q || v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  function handleAddToClassroom(video: VideoItem) {
    setSelectedVideo(video);
  }

  function handleConfirmPayment(method: string) {
    if (selectedVideo) {
      setMyClassroom((prev) =>
        prev.includes(selectedVideo.id) ? prev : [...prev, selectedVideo.id]
      );
      alert(`Paid Rs. ${selectedVideo.price} via ${method} for "${selectedVideo.title}"!`);
      setSelectedVideo(null);
    }
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-slate-900 bg-white/40 backdrop-blur-2xl">
      {/* Top Bar */}
      <div className="mx-auto max-w-7xl px-4 pt-10 mb-16">
        <div className="rounded-3xl flex px-8 py-4 md:py-6 bg-white/40 backdrop-blur-2xl ring-1 ring-white/50 shadow-[0_20px_120px_rgba(168,85,247,0.35)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40" />
            <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              Premium Videos
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
                placeholder="Search premium videos…"
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

      {/* Grid of premium cards */}
      <main className="mx-auto max-w-7xl px-4 pb-20">
        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl p-8 text-center bg-white/60 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_12px_80px_rgba(0,0,0,0.08)]">
            <p className="text-slate-700">
              No videos matched your search. Try another keyword or category.
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
                  {/* Thumbnail Placeholder */}
                  <div className="relative">
                    <img
                      src={`${v.image}`}
                      alt={v.title}
                      className="w-full aspect-video object-cover"
                    />
                    <button
                      type="button"
                      className="absolute inset-0 m-auto h-16 w-16 grid place-items-center rounded-full bg-white/70 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:bg-white transition"
                      disabled
                    >
                      <Play className="h-7 w-7 text-indigo-600" />
                    </button>
                    <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-200/70 ring-1 ring-indigo-300/60">
                      <Lock className="h-3.5 w-3.5" />
                      Premium
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 md:p-6">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-200/60 ring-1 ring-indigo-300/60">
                      {v.category}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold leading-snug">{v.title}</h3>
                    <p className="mt-2 text-sm md:text-[15px] text-slate-700">{v.description}</p>

                    {/* Creator Info */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500/30 via-violet-500/30 to-sky-500/30" />
                      <div className="text-sm">
                        <p className="font-semibold">{v.creator.name}</p>
                        <p className="text-slate-500">{v.creator.title} - {v.creator.faculty}</p>
                      </div>
                    </div>

                    {/* Reviews */}
                    <div className="mt-2 flex items-center gap-2 text-yellow-500">
                      <Star className="h-4 w-4" /> {v.reviews.stars} ({v.reviews.count} reviews)
                    </div>

                    {/* Price with Discount */}
                    <div className="mt-3 flex flex-col gap-1">
                      <span className="text-sm line-through text-red-500">
                        Rs. {v.price + 100}
                      </span>
                      <span className="font-semibold text-indigo-600 text-lg">
                        Rs. {v.price}
                      </span>
                    </div>

                    {/* Docs + Action */}
                    <div className="mt-5 flex items-center justify-between gap-2 flex-wrap">
                      <button
                        onClick={() => handleAddToClassroom(v)}
                        className="flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 shadow-[0_12px_48px_rgba(168,85,247,0.55)] hover:shadow-[0_12px_48px_rgba(168,85,247,0.65)] active:scale-[0.98] transition"
                      >
                        {isAdded ? (
                          <span className="inline-flex items-center gap-2">
                            Added <Sparkles className="h-4 w-4" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Add to Classroom
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => alert(`Open docs for ${v.title}`)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-indigo-600 ring-1 ring-indigo-400/40 hover:bg-indigo-50 transition text-sm"
                      >
                        <BookOpen className="h-4 w-4" /> Docs
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Payment Popup */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-white rounded-3xl shadow-2xl space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Pay Rs. {selectedVideo.price}
            </h2>
            <p className="text-gray-600">
              Select a payment method to purchase "{selectedVideo.title}"
            </p>
            <div className="flex flex-col gap-3">
              {["eSewa", "Khalti", "Bank Transfer"].map((method) => (
                <button
                  key={method}
                  onClick={() => handleConfirmPayment(method)}
                  className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition"
                >
                  {method}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedVideo(null)}
              className="mt-2 w-full px-4 py-2 rounded-xl border border-gray-300 font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}