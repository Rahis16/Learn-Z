"use client";

import React, { useEffect, useMemo, useState } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";

type ApiVideo = {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  youtube_url: string;
  youtube_id?: string;
};

function extractYouTubeId(link: string) {
  try {
    const url = new URL(link);
    if (url.hostname === "youtu.be") return url.pathname.slice(1);
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      const parts = url.pathname.split("/");
      const idx = parts.findIndex((p) => p === "embed" || p === "shorts");
      if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
      const last = parts.filter(Boolean).pop();
      if (last) return last;
    }
  } catch {
    return link;
  }
  return link;
}

type TabKey = "all" | "forYou" | "allVideos";

export default function Page() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [myClassroom, setMyClassroom] = useState<string[]>([]);

  const [videos, setVideos] = useState<ApiVideo[]>([]);
  const [recommended, setRecommended] = useState<ApiVideo[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingReco, setLoadingReco] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- add these states near your other UI state ---
  const [addingVideoId, setAddingVideoId] = useState<number | null>(null);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set()); // track what's already in classroom
  const [addError, setAddError] = useState<string | null>(null);

  // --- state for existing classroom items ---
  const [loadingClassroom, setLoadingClassroom] = useState(false);

  // on mount, get the user's classroom
useEffect(() => {
  let aborted = false;
  const run = async () => {
    setLoadingClassroom(true);
    try {
      // GET /api/classroom/  -> returns { id, name, active_video, items: [{ id, video:{id,...}, ...}] }
      const { data } = await axiosWithCsrf.get("/api/classroom/");
      if (aborted) return;

      const ids = new Set<number>(
        (data?.items ?? [])
          .map((it: any) => Number(it?.video?.id))
          .filter((n: any) => Number.isFinite(n))
      );
      setAddedIds(ids);
    } catch (err) {
      if (!aborted) console.error("Failed to fetch classroom:", err);
    } finally {
      if (!aborted) setLoadingClassroom(false);
    }
  };
  run();
  return () => { aborted = true; };
}, []);

  // call this from the card button
  function handleAddToClassroom(videoId: number) {
    if (isAdded(videoId) || isAdding(videoId)) return;
    setAddError(null);
    setAddingVideoId(videoId);
  }

  // --- effect that performs the POST when a click sets addingVideoId ---
  useEffect(() => {
    if (addingVideoId == null) return;

    let aborted = false;
    const run = async () => {
      try {
        // POST /api/classroom/items/  { video_id }
        await axiosWithCsrf.post("/api/classroom/items/", {
          video_id: addingVideoId,
        });

        if (!aborted) {
          setAddedIds((prev) => new Set(prev).add(addingVideoId));
        }
      } catch (e: any) {
        if (!aborted) {
          const msg =
            e?.response?.data?.detail ||
            e?.message ||
            "Failed to add to your classroom.";
          setAddError(msg);
        }
      } finally {
        if (!aborted) setAddingVideoId(null);
      }
    };

    run();
    return () => {
      aborted = true;
    };
  }, [addingVideoId, axiosWithCsrf]);

  // helper for per-card loading/added states
  const isAdding = (id: number) => addingVideoId === id;
  const isAdded = (id: number) => addedIds.has(id);

  // Build categories dynamically from fetched videos (fallback to ["All"])
  const categories = useMemo(() => {
    const setCat = new Set<string>();
    videos.forEach((v) => v.category && setCat.add(v.category));
    return ["All", ...Array.from(setCat.values())];
  }, [videos]);

  const hasActiveFilter = useMemo(() => {
    const q = query.trim();
    return q.length > 0 || (category && category !== "All");
  }, [query, category]);

  // Fetch videos (list)
  useEffect(() => {
    let aborted = false;
    const run = async () => {
      setLoadingList(true);
      setErrorMsg(null);
      try {
        const params: Record<string, string> = {};
        const q = query.trim();
        if (q) params.q = q;
        if (category && category !== "All") params.category = category;

        const { data } = await axiosWithCsrf.get("/api/videos/", { params });
        if (!aborted) {
          setVideos(Array.isArray(data) ? data : data?.results || []);
        }
      } catch (e: any) {
        if (!aborted) {
          const msg =
            e?.response?.data?.detail || e?.message || "Failed to load videos.";
          setErrorMsg(msg);
        }
      } finally {
        if (!aborted) setLoadingList(false);
      }
    };

    const t = setTimeout(run, 250); // debounce
    return () => {
      aborted = true;
      clearTimeout(t);
    };
  }, [query, category]);

  // Fetch recommended (auth)
  useEffect(() => {
    let aborted = false;
    const run = async () => {
      setLoadingReco(true);
      try {
        const params: Record<string, string> = { limit: "12" };
        const q = query.trim();
        if (q) params.q = q;
        if (category && category !== "All") params.category = category;

        const { data } = await axiosWithCsrf.get("/api/videos/recommended/", {
          params,
        });
        const results = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];
        if (!aborted) setRecommended(results);
      } catch {
        if (!aborted) setRecommended([]); // likely anonymous user, not fatal
      } finally {
        if (!aborted) setLoadingReco(false);
      }
    };
    run();
    return () => {
      aborted = true;
    };
  }, [query, category]);

  // Dedup helpers
  const recommendedIds = useMemo(
    () => new Set(recommended.map((v) => v.id)),
    [recommended]
  );
  const dedupedMain = useMemo(
    () => videos.filter((v) => !recommendedIds.has(v.id)),
    [videos, recommendedIds]
  );
  const mergedFiltered = useMemo(() => {
    // When filters are active, merge & dedupe into one grid
    const map = new Map<number, ApiVideo>();
    recommended.forEach((v) => map.set(v.id, v));
    videos.forEach((v) => map.set(v.id, v));
    return Array.from(map.values());
  }, [videos, recommended]);

  // function handleAddToClassroom(id: string) {
  //   setMyClassroom((prev) => (prev.includes(id) ? prev : [...prev, id]));
  // }

  const renderCard = (v: ApiVideo) => {
    const vid = v.youtube_id || extractYouTubeId(v.youtube_url);
    return (
      <article
        key={v.slug ?? v.id}
        className="group rounded-3xl overflow-hidden ring-1 ring-white/50 backdrop-blur-2xl bg-white/50 shadow-[0_24px_120px_rgba(236,72,153,0.25)] hover:shadow-[0_28px_140px_rgba(168,85,247,0.35)] transition-shadow"
      >
        <div className="relative">
          <div className="aspect-video w-full overflow-hidden">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${vid}`}
              title={v.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/0 via-transparent to-white/10" />
        </div>

        <div className="p-5 md:p-6">
          {v.category && (
            <div className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-200/60 ring-1 ring-indigo-300/60">
              {v.category}
            </div>
          )}
          <h3 className="text-lg md:text-xl font-semibold leading-snug line-clamp-2">
            {v.title}
          </h3>
          {v.description && (
            <p className="mt-2 text-sm md:text-[15px] text-slate-700 line-clamp-2">
              {v.description}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => handleAddToClassroom(Number(v.id))}
              disabled={isAdded(Number(v.id)) || isAdding(Number(v.id))}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 disabled:opacity-60"
            >
              {isAdded(Number(v.id)) ? (
                "Added ✓"
              ) : isAdding(Number(v.id)) ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Adding…
                </span>
              ) : (
                "Add to Classroom"
              )}
            </button>

            <a
              href={v.youtube_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-indigo-500 hover:underline"
              title="Open on YouTube"
            >
              Open on YouTube →
            </a>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen w-full text-slate-900 bg-white/40 backdrop-blur-2xl">
      {/* Header / Search / Filters */}
      <div className="mx-auto max-w-7xl px-4 pt-10 mb-6">
        <div className="rounded-3xl flex px-8 py-4 md:py-6 bg-white/40 backdrop-blur-2xl ring-1 ring-white/50 shadow-[0_20px_120px_rgba(168,85,247,0.35)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40" />
            <h1 className="text-xl font-semibold tracking-tight">
              Freemium Classroom
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
                placeholder="Search courses, topics…"
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
              <span className="text-sm font-medium">
                My Classroom: {myClassroom.length}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex items-center gap-2">
          {[
            { key: "all", label: "All" },
            { key: "forYou", label: "For You" },
            { key: "allVideos", label: "All Videos" },
          ].map((t) => {
            const k = t.key as TabKey;
            const active = activeTab === k;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(k)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition
                ${
                  active
                    ? "bg-slate-900 text-white shadow"
                    : "bg-white/60 text-slate-700 ring-1 ring-slate-200 hover:bg-white"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-20">
        {/* Error */}
        {errorMsg && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {errorMsg}
          </div>
        )}

        {/* CONTENT BY TAB */}
        {activeTab === "forYou" && (
          <>
            <div className="flex items-center justify-between mt-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Recommended for you
              </h2>
              {loadingReco && (
                <div className="text-xs text-slate-600">Updating…</div>
              )}
            </div>

            {recommended.length === 0 ? (
              <div className="mt-8 rounded-2xl p-8 text-center bg-white/60 backdrop-blur-xl ring-1 ring-white/40 shadow">
                <p className="text-slate-700">No recommendations yet.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-4">
                {recommended.map((v) => renderCard(v))}
              </div>
            )}
          </>
        )}

        {activeTab === "allVideos" && (
          <>
            <div className="flex items-center justify-between mt-2">
              <h2 className="text-lg font-semibold text-slate-900">
                All videos
              </h2>
              {loadingList && (
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                  Loading…
                </div>
              )}
            </div>

            {videos.length === 0 ? (
              <div className="mt-8 rounded-2xl p-8 text-center bg-white/60 backdrop-blur-xl ring-1 ring-white/40 shadow">
                <p className="text-slate-700">
                  No courses matched your search.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 mt-8">
                {videos.map((v) => renderCard(v))}
              </div>
            )}
          </>
        )}

        {activeTab === "all" && (
          <>
            {/* If filters are active: merged grid */}
            {hasActiveFilter ? (
              <>
                <div className="flex items-center justify-between mt-2">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Results
                  </h2>
                  {(loadingList || loadingReco) && (
                    <div className="text-xs text-slate-600">Updating…</div>
                  )}
                </div>

                {mergedFiltered.length === 0 ? (
                  <div className="mt-8 rounded-2xl p-8 text-center bg-white/60 backdrop-blur-xl ring-1 ring-white/40 shadow">
                    <p className="text-slate-700">
                      No courses matched your search.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 mt-8">
                    {mergedFiltered.map((v) => renderCard(v))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* No filters: Recommended on top, horizontal divider, then All Videos (deduped) */}
                {recommended.length > 0 && (
                  <section className="mt-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900">
                        Recommended for you
                      </h2>
                      {loadingReco && (
                        <div className="text-xs text-slate-600">Updating…</div>
                      )}
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-4">
                      {recommended.map((v) => renderCard(v))}
                    </div>
                  </section>
                )}

                {/* Horizontal divider */}
                <div className="my-8 border-t border-slate-200" />

                <section>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      All videos
                    </h2>
                    {loadingList && (
                      <div className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                        Loading…
                      </div>
                    )}
                  </div>
                  {dedupedMain.length === 0 ? (
                    <div className="mt-8 rounded-2xl p-8 text-center bg-white/60 backdrop-blur-xl ring-1 ring-white/40 shadow">
                      <p className="text-slate-700">No videos yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 mt-8">
                      {dedupedMain.map((v) => renderCard(v))}
                    </div>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}