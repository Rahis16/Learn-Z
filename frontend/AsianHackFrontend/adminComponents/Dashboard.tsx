"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Crown,
  Gauge,
  BookOpen,
  BookOpenCheck,
  ChartPie,
  BarChart4,
  Rocket,
  Bell,
  ShieldCheck,
  Settings,
  Megaphone,
  FolderPlus,
  ClipboardList,
  Sparkles,
  Trophy,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/*
  Learn‑Z Admin Dashboard
  - Same glassy gradient UI pattern (rounded-3xl, borders, blur, gradients)
  - KPIs: Students, plan breakdown, courses
  - Charts: Plan pie (donut), Weekly bar chart, progress bars
  - Top Performing Students table
  - Quick Actions for admin
  - Dummy data with TODOs to wire your API

  Save as: app/admin/dashboard/page.tsx
  Ensure: npm i recharts lucide-react framer-motion
*/

// ----- Dummy Data (wire to API later) -----
const DUMMY_COUNTS = {
  studentsTotal: 18420,
  plans: {
    starter: 6240,
    pro: 8210,
    eager: 3970, // "Eager to Learn"
  },
  courses: {
    total: 356,
    premium: 148,
    freemium: 208,
  },
};

const WEEKLY = [
  { week: "W1", signups: 620, purchases: 380 },
  { week: "W2", signups: 710, purchases: 420 },
  { week: "W3", signups: 680, purchases: 445 },
  { week: "W4", signups: 760, purchases: 490 },
];

const TOP_STUDENTS = [
  { id: "u1", name: "Aarav Shrestha", plan: "Pro", score: 980, avatar: "/images/profile2.jpg" },
  { id: "u2", name: "Prisha Karki", plan: "Eager", score: 965, avatar: "/images/profile2.jpg" },
  { id: "u3", name: "Nabin Rai", plan: "Pro", score: 944, avatar: "/images/profile2.jpg" },
  { id: "u4", name: "Asmita Magar", plan: "Starter", score: 912, avatar: "/images/profile2.jpg" },
  { id: "u5", name: "Sagar Thapa", plan: "Pro", score: 905, avatar: "/images/profile2.jpg" },
];

const card = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
} as const;

export default function AdminDashboardPage() {
  const router = useRouter();

  // ---- Replace with real API fetches ----
  const [counts, setCounts] = useState(DUMMY_COUNTS);
  const [weekly, setWeekly] = useState(WEEKLY);
  const [topStudents, setTopStudents] = useState(TOP_STUDENTS);

  // Percent helpers
  const planPie = useMemo(() => {
    const { starter, pro, eager } = counts.plans;
    const total = starter + pro + eager || 1;
    return [
      { name: "Starter", value: starter, pct: Math.round((starter / total) * 100) },
      { name: "Pro", value: pro, pct: Math.round((pro / total) * 100) },
      { name: "Eager", value: eager, pct: Math.round((eager / total) * 100) },
    ];
  }, [counts]);

  const planTargets = [
    { label: "Starter", value: counts.plans.starter, goal: 6500 },
    { label: "Pro", value: counts.plans.pro, goal: 8500 },
    { label: "Eager", value: counts.plans.eager, goal: 4200 },
  ];

  const COLORS = ["#6366F1", "#8B5CF6", "#0EA5E9"]; // indigo, violet, sky

  return (
    <div className="pt-6 pb-24 min-h-screen dark:from-zinc-950 dark:via-slate-950 dark:to-indigo-950 text-zinc-900 dark:text-zinc-100">
      {/* Hero */}
      <section className="mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={card}
          initial="hidden"
          animate="show"
          className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Learn‑Z Admin</p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
                Overview & Insights
              </h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-2xl">
                Track student growth, plan adoption, course inventory, and performance at a glance.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <HeroButton icon={<Megaphone className="w-4 h-4" />} onClick={() => router.push("/admin/announcements")}>Create Announcement</HeroButton>
              <HeroButton icon={<FolderPlus className="w-4 h-4" />} onClick={() => router.push("/admin/courses/new")}>Add Course</HeroButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* KPI Row */}
      <section className="mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KPI icon={<Users className="w-4 h-4" />} label="Students" value={counts.studentsTotal.toLocaleString()} sub="All time" />
        <KPI icon={<Gauge className="w-4 h-4" />} label="Starter" value={counts.plans.starter.toLocaleString()} sub="Active" />
        <KPI icon={<Crown className="w-4 h-4" />} label="Pro" value={counts.plans.pro.toLocaleString()} sub="Active" />
        <KPI icon={<Rocket className="w-4 h-4" />} label="Eager to Learn" value={counts.plans.eager.toLocaleString()} sub="Active" />
        <KPI icon={<BookOpen className="w-4 h-4" />} label="Courses" value={counts.courses.total.toLocaleString()} sub="Total" />
        <KPI icon={<BookOpenCheck className="w-4 h-4" />} label="Premium" value={counts.courses.premium.toLocaleString()} sub={`Freemium ${counts.courses.freemium}`} />
      </section>

      {/* Charts + Goals */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid gap-6 lg:grid-cols-3">
        {/* Donut: Plans */}
        <motion.section variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2"><ChartPie className="w-5 h-5" /> Plan Distribution</h3>
          <div className="mt-2 grid grid-cols-1 gap-4 items-center">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#0EA5E9" />
                    </linearGradient>
                    <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0EA5E9" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={planPie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={80}
                    strokeWidth={2}
                  >
                    {planPie.map((_, i) => (
                      <Cell key={i} fill={`url(#g${i + 1})`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number, n: string, p: any) => [`${v.toLocaleString()}`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="text-sm space-y-2">
              {planPie.map((p, i) => (
                <li key={i} className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                    {p.name}
                  </span>
                  <span className="font-medium">{p.pct}%</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Goals */}
          <div className="mt-4 rounded-2xl border border-white/30 dark:border-white/10 p-4 bg-white/50 dark:bg-zinc-900/50">
            <p className="text-sm font-medium">Plan Targets</p>
            <div className="mt-3 space-y-3">
              {planTargets.map((g) => {
                const pct = Math.min(100, Math.round((g.value / g.goal) * 100));
                return (
                  <div key={g.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span>{g.label}</span>
                      <span>
                        {g.value.toLocaleString()} / {g.goal.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <ProgressBar percent={pct} />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Weekly Bars */}
        <motion.section variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold flex items-center gap-2"><BarChart4 className="w-5 h-5" /> Weekly Signups vs Purchases</h3>
          <div className="mt-2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(v: number) => v.toLocaleString()} />
                <Legend />
                <Bar dataKey="signups" name="Signups" fill="url(#bar1)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="purchases" name="Purchases" fill="url(#bar2)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="bar1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="bar2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </main>

      {/* Top Performing Students + Quick Actions */}
      <section className="mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid gap-6 lg:grid-cols-3">
        {/* Top Students */}
        <motion.section variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Trophy className="w-5 h-5" /> Top Performing Students</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 dark:text-zinc-400">
                  <th className="py-2 pr-3">#</th>
                  <th className="py-2 pr-3">Student</th>
                  <th className="py-2 pr-3">Plan</th>
                  <th className="py-2 pr-3">Score</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((s, i) => (
                  <tr key={s.id} className="border-t border-white/20 dark:border-white/10">
                    <td className="py-2 pr-3 font-mono">{i + 1}</td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-lg border border-white/20" />
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-2 pr-3">{s.plan}</td>
                    <td className="py-2 pr-3 font-semibold">{s.score}</td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/profile/${s.id}`} className="text-xs rounded-xl px-3 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">View</Link>
                        <button className="text-xs rounded-xl px-3 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">Message</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-gradient-to-b from-white/70 to-white/40 dark:from-zinc-900/70 dark:to-zinc-900/40 p-6">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <QuickAction icon={<Users className="w-4 h-4" />} label="Manage Users" href="/admin/users" />
            <QuickAction icon={<FolderPlus className="w-4 h-4" />} label="Add Course" href="/admin/courses/new" />
            <QuickAction icon={<Megaphone className="w-4 h-4" />} label="Announcement" href="/admin/announcements" />
            <QuickAction icon={<ClipboardList className="w-4 h-4" />} label="Create Quiz" href="/admin/quiz/new" />
            <QuickAction icon={<Sparkles className="w-4 h-4" />} label="Assign Quiz" href="/admin/quiz/assign" />
            <QuickAction icon={<Settings className="w-4 h-4" />} label="Settings" href="/admin/settings" />
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-3">Tip: Use Assign Quiz to push practice sets to segments.</p>
        </motion.section>
      </section>

      {/* Activity + Health */}
      <section className="mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid gap-6 lg:grid-cols-3">
        <motion.section variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-3">Prisha upgraded to <span className="font-medium">Eager to Learn</span> • 5m ago</li>
            <li className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-3">New course published: <span className="font-medium">System Design 101</span> • 1h ago</li>
            <li className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-3">Aarav completed quiz <span className="font-medium">Realtime IT Basics</span> • 2h ago</li>
          </ul>
        </motion.section>
        <motion.section variants={card} initial="hidden" animate="show" className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-gradient-to-tr from-fuchsia-500/40 via-rose-500/30 to-amber-500/40 blur-2xl" />
          <div className="relative">
            <h3 className="text-lg font-semibold flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> System Health</h3>
            <div className="mt-3 space-y-3">
              <HealthRow label="API uptime" pct={99.9} />
              <HealthRow label="Latency (p95)" pct={92} suffix="< 250ms" />
              <HealthRow label="Error rate" pct={98.5} suffix="< 0.5%" />
            </div>
          </div>
        </motion.section>
      </section>
    </div>
  );
}

/* ---------------- Small Components ---------------- */
function KPI({ icon, label, value, sub }: { icon?: React.ReactNode; label: string; value: string; sub: string }) {
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
      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{sub}</p>
    </div>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="mt-1 h-2 w-full rounded-full bg-zinc-200/70 dark:bg-white/10 overflow-hidden">
      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
    </div>
  );
}

function HealthRow({ label, pct, suffix }: { label: string; pct: number; suffix?: string }) {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span>{label}</span>
        <span>
          {p}% {suffix && <span className="text-zinc-500">• {suffix}</span>}
        </span>
      </div>
      <ProgressBar percent={p} />
    </div>
  );
}

function QuickAction({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60 text-sm"
    >
      <span className="grid place-items-center w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-500/20">
        {icon}
      </span>
      {label}
    </Link>
  );
}

function HeroButton({ icon, children, onClick }: { icon: React.ReactNode; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 text-sm font-medium rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90">
      <span className="grid place-items-center w-5 h-5 rounded-md bg-white/20">{icon}</span>
      {children}
    </button>
  );
}