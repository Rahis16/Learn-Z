"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  MessageCircle,
  Moon,
  Sun,
  Users,
  FolderOpen,
  Sparkles,
  Crown,
  TrendingUp,
  CircleDollarSign,
  Gauge,
  Star,
  TimerReset,
  Rocket,
  BookOpen,
  Clock,
  Search,
  GraduationCapIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const [dark, setDark] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // cmd+k palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const today = useMemo(() => new Date(), []);
  const day = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // --- Mocked progress data (wire to backend as needed) ---
  const stats = {
    purchased: 12,
    completed: 7,
    consistencyRatio: 86, // %
    rank: 128, // global or cohort rank
    tokensRemaining: 76420, // daily credit tokens remaining
    dailyTokensQuota: 100000,
    userProgressPct: 64, // overall learning progress for circular viz
  };

  const recentPremium = [
    {
      title: "Advanced React Patterns",
      duration: "2h 18m",
      level: "Intermediate",
    },
    {
      title: "Next.js App Router Deep Dive",
      duration: "1h 42m",
      level: "Intermediate",
    },
    {
      title: "TypeScript Pro Essentials",
      duration: "2h 05m",
      level: "Beginner+",
    },
    {
      title: "System Design for Frontend",
      duration: "1h 29m",
      level: "Advanced",
    },
  ];

  // Motion helpers
  const card = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  // ---- Credits math (fallbacks if backend doesn't send input/output split) ----
  const QUOTA = 100_000; // total given credits per day
  const totalUsed = Math.max(
    0,
    Math.min(QUOTA, (stats.dailyTokensQuota ?? QUOTA) - stats.tokensRemaining)
  );
  const inputUsed = stats.inputUsed ?? Math.round(totalUsed * 0.55); // replace with real value if you have it
  const outputUsed = stats.outputUsed ?? Math.max(0, totalUsed - inputUsed);

  const pct = (val: number) => Math.min(100, Math.max(0, (val / QUOTA) * 100));

  function MiniCircle({
    label,
    value,
    percent,
    subtitle,
    size = 72,
    stroke = 8,
  }: {
    label: string;
    value: number;
    percent: number; // 0..100
    subtitle?: string;
    size?: number;
    stroke?: number;
  }) {
    const clamped = Math.max(0, Math.min(100, percent));
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = (clamped / 100) * c;

    return (
      <div className="flex items-center gap-3">
        <div className="relative grid place-items-center">
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="currentColor"
              className="text-zinc-200/70 dark:text-white/10"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="url(#miniGrad)"
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="miniGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366F1" /> {/* indigo-500 */}
                <stop offset="50%" stopColor="#8B5CF6" /> {/* violet-500 */}
                <stop offset="100%" stopColor="#0EA5E9" /> {/* sky-500 */}
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <div className="text-xs font-semibold">{Math.round(clamped)}%</div>
          </div>
        </div>
        <div className="leading-tight">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {label}
          </div>
          <div className="text-sm font-semibold">{value.toLocaleString()}</div>
          {subtitle && (
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="pt-4 pb-16 min-h-screen dark:from-zinc-950 dark:via-slate-950 dark:to-indigo-950 text-zinc-900 dark:text-zinc-100">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Welcome + KPI strip */}
            <motion.div
              variants={card}
              initial="hidden"
              animate="show"
              className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6"
            >
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {day}
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
                      Welcome back,{" "}
                      <span className="bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
                        {user?.username ?? "Creator"}
                      </span>{" "}
                      <GraduationCapIcon size={30} className="ml-1 inline-block" />
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-xl">
                      Keep up the momentum! Your progress, consistency, and
                      premium course journey are looking great.
                    </p>
                  </div>
                </div>

                {/* KPI row (replaced with your requested metrics) */}
                <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPI
                    icon={<BookOpen className="w-4 h-4" />}
                    label="Courses Purchased"
                    value={String(stats.purchased)}
                    sub="Premium library"
                  />
                  <KPI
                    icon={<CheckBadge className="w-4 h-4" />}
                    label="Courses Completed"
                    value={String(stats.completed)}
                    sub="Keep shipping!"
                  />
                  <KPI
                    icon={<TrendingUp className="w-4 h-4" />}
                    label="Consistency Ratio"
                    value={`${stats.consistencyRatio}%`}
                    sub="7-day streak score"
                  />
                  <KPI
                    icon={<Star className="w-4 h-4" />}
                    label="Rank"
                    value={`#${stats.rank}`}
                    sub="Global leaderboard"
                  />
                </div>

                <div className="hidden md:flex items-center gap-5 mt-8 mb-3">
                  <MiniCircle
                    label="Input Used"
                    value={inputUsed}
                    percent={pct(inputUsed)}
                    subtitle={`${inputUsed.toLocaleString()} / ${QUOTA.toLocaleString()}`}
                  />
                  <MiniCircle
                    label="Output Used"
                    value={outputUsed}
                    percent={pct(outputUsed)}
                    subtitle={`${outputUsed.toLocaleString()} / ${QUOTA.toLocaleString()}`}
                  />
                  <MiniCircle
                    label="Total Used"
                    value={totalUsed}
                    percent={pct(totalUsed)}
                    subtitle={`${totalUsed.toLocaleString()} / ${QUOTA.toLocaleString()}`}
                  />
                  <MiniCircle
                    label="Remaining"
                    value={stats.tokensRemaining}
                    percent={pct(stats.tokensRemaining)}
                    subtitle={`${stats.tokensRemaining.toLocaleString()} / ${QUOTA.toLocaleString()}`}
                  />
                </div>
              </div>
            </motion.div>

            {/* Plan + Tokens + Circular Progress */}
            <motion.div
              variants={card}
              initial="hidden"
              animate="show"
              className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-gradient-to-b from-white/70 to-white/40 dark:from-zinc-900/70 dark:to-zinc-900/40 backdrop-blur-xl shadow-xl p-6"
            >
              <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-gradient-to-tr from-fuchsia-500/40 via-rose-500/30 to-amber-500/40 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    Update Plan
                  </h2>
                  <button
                    onClick={() => router.push("/pricings")}
                    className="inline-flex items-center gap-1 text-xs font-medium rounded-xl px-3 py-1.5 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90"
                  >
                    Upgrade <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Tokens / Credits */}
                <div className="mt-4 rounded-2xl border border-white/30 dark:border-white/10 p-4 bg-white/60 dark:bg-zinc-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Remaining Credits Today
                      </span>
                    </div>
                    <span className="text-sm font-mono">
                      {stats.tokensRemaining.toLocaleString()} /{" "}
                      {stats.dailyTokensQuota.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-zinc-200/70 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (stats.tokensRemaining / stats.dailyTokensQuota) * 100
                        ).toFixed(2)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/30 dark:border-white/10 p-4 bg-white/60 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">Your Progress</span>
                    </div>
                    <CircularProgress
                      percent={stats.userProgressPct}
                      size={112}
                      stroke={10}
                    />
                  </div>
                  <div className="rounded-2xl border border-white/30 dark:border-white/10 p-4 bg-white/60 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Next Milestone
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">
                      Complete 3 more lessons to reach <strong>70%</strong>{" "}
                      progress and unlock a bonus badge.
                    </p>
                    <button
                      onClick={() => router.push("/classroom")}
                      className="mt-3 w-full text-xs rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Grid (replaced with Recent Premium Courses + Insights) */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid gap-6 lg:grid-cols-3">
          {/* Recent Premium Courses */}
          <motion.section
            variants={card}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" /> Recent Premium
                Courses
              </h3>
              <button
                onClick={() => router.push("/courses")}
                className="text-sm text-indigo-600 dark:text-indigo-300 hover:underline"
              >
                View all
              </button>
            </div>

            <ul className="mt-4 space-y-3">
              {recentPremium.map((c, i) => (
                <li
                  key={i}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-4 hover:bg-white/70 dark:hover:bg-zinc-900/70 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {c.duration}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-sky-500/15 border border-white/20 dark:border-white/10">
                          {c.level}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/classroom")}
                    className="inline-flex items-center gap-1 text-xs font-medium rounded-xl px-3 py-1.5 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90"
                  >
                    Resume <ChevronRight className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Insight / Tips / Streak */}
          <div className="space-y-6">
            <motion.section
              variants={card}
              initial="hidden"
              animate="show"
              className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Personal Insights
              </h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-2">
                <li>
                  You’re most productive between <strong>7–9 PM</strong>. Try
                  scheduling deep work here.
                </li>
                <li>
                  <strong>{stats.consistencyRatio}%</strong> consistency—keep a
                  streak going to boost retention.
                </li>
                <li>
                  Revisit “{recentPremium[0].title}” sections 3–4 for mastery.
                </li>
              </ul>
            </motion.section>

            <motion.section
              variants={card}
              initial="hidden"
              animate="show"
              className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CircleDollarSign className="w-5 h-5" /> Manage Plan & Credits
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">
                You have{" "}
                <strong>{stats.tokensRemaining.toLocaleString()}</strong>{" "}
                credits left today.
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-zinc-200/70 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (stats.tokensRemaining / stats.dailyTokensQuota) * 100
                    ).toFixed(2)}%`,
                  }}
                />
              </div>
              <button
                onClick={() => router.push("/pricings")}
                className="mt-3 w-full text-sm rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90"
              >
                Update Plan
              </button>
            </motion.section>
          </div>
        </main>
      </div>

      {/* Command Palette */}
      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setPaletteOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed left-1/2 top-24 -translate-x-1/2 w-[92vw] max-w-xl rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl p-3"
            >
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10">
                <Search className="w-4 h-4 text-zinc-400" />
                <input
                  autoFocus
                  placeholder="Type a command (e.g., ‘upgrade plan’, ‘open classroom’, ‘view credits’)"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
              <div className="mt-2 divide-y divide-white/20 dark:divide-white/10">
                <PaletteItem
                  icon={<Crown className="w-4 h-4" />}
                  title="Upgrade plan"
                  subtitle="Unlock more credits & premium perks"
                />
                <PaletteItem
                  icon={<MessageCircle className="w-4 h-4" />}
                  title="Open classroom"
                  subtitle="Jump back to your current lesson"
                />
                <PaletteItem
                  icon={<FolderOpen className="w-4 h-4" />}
                  title="View files"
                  subtitle="Browse your resources"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- Small Components ---- */
function ActionChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm text-sm">
      {icon}
      <span>{label}</span>
    </button>
  );
}

function KPI({
  icon,
  label,
  value,
  sub,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50">
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-500/20 blur-2xl" />
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        {icon && (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-500/20">
            {icon}
          </span>
        )}
        <span>{label}</span>
      </div>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
        {sub}
      </p>
    </div>
  );
}

function CheckBadge(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className={props.className}>
      <path
        d="M9 11l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

function PaletteItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow">
        {icon}
      </span>
      <span className="text-left">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </span>
      </span>
    </button>
  );
}

/* Circular Progress (SVG) */
function CircularProgress({
  percent,
  size = 120,
  stroke = 12,
}: {
  percent: number;
  size?: number;
  stroke?: number;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (clamped / 100) * c;

  return (
    <div className="relative grid place-items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          className="text-zinc-200/70 dark:text-white/10"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#grad)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-semibold">{clamped}%</div>
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
          overall
        </div>
      </div>
    </div>
  );
}
