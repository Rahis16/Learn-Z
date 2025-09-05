"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChartPie,
  BarChart4,
  LineChart as LineIcon,
  Download,
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

/*
  Admin Analytics Page
  - Drop-in: app/admin/analytics/page.tsx
  - Uses Tailwind + framer-motion + recharts + lucide-react
  - Dummy data simulated for 12 months
*/

const card = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } } as const;

// ---------- Dummy data generation ----------
function monthsArray() {
  const m = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  for (let i = 0; i < 12; i++) m.push(monthNames[i]);
  return m;
}

const MONTHS = monthsArray();

function makeMonthlyData() {
  // simulate revenue (USD), signups, purchases
  return MONTHS.map((m, i) => {
    const base = 50_000 + i * 2000 + Math.round((Math.random() - 0.5) * 10_000);
    const purchases = Math.max(200 + i * 10 + Math.round((Math.random() - 0.5) * 80), 50);
    const signups = Math.max(800 + i * 15 + Math.round((Math.random() - 0.5) * 200), 100);
    const premiumCourses = Math.max(100 + Math.round(Math.random() * 20), 60);
    const freemiumCourses = Math.max(200 + Math.round(Math.random() * 40), 150);
    return {
      month: m,
      revenue: base,
      purchases,
      signups,
      premiumCourses,
      freemiumCourses,
    };
  });
}

const MONTHLY = makeMonthlyData();

const TOP_COURSES = [
  { title: "Advanced React Patterns", purchases: 1240, revenue: 39 * 1240 },
  { title: "TypeScript Pro Essentials", purchases: 980, revenue: 29 * 980 },
  { title: "SQL & Database Basics", purchases: 860, revenue: 0 },
  { title: "ML Basics", purchases: 740, revenue: 49 * 740 },
  { title: "Docker Fundamentals", purchases: 650, revenue: 0 },
];

const PLAN_DISTRIBUTION = [
  { name: "Starter", value: 6240 },
  { name: "Pro", value: 8210 },
  { name: "Eager", value: 3970 },
];

const COLORS = ["#6366F1", "#8B5CF6", "#0EA5E9"];

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<"30d" | "90d" | "1y">("1y");

  // aggregated KPIs (simple derivation from dummy data)
  const KPIs = useMemo(() => {
    const totalRevenue = MONTHLY.reduce((a, m) => a + m.revenue, 0);
    const totalSignups = MONTHLY.reduce((a, m) => a + m.signups, 0);
    const totalPurchases = MONTHLY.reduce((a, m) => a + m.purchases, 0);
    const premium = MONTHLY.reduce((a, m) => a + m.premiumCourses, 0);
    const freemium = MONTHLY.reduce((a, m) => a + m.freemiumCourses, 0);
    const students = 18420; // keep some static total for demo
    const instructors = 420;
    const courses = premium + freemium;
    return { totalRevenue, totalSignups, totalPurchases, premium, freemium, students, instructors, courses };
  }, []);

  // Line chart data
  const lineData = MONTHLY.map((m) => ({ month: m.month, revenue: Math.round(m.revenue / 1000) })); // in thousands for display

  // Bar chart for plan distribution
  const planBars = PLAN_DISTRIBUTION.map((p, i) => ({ name: p.name, value: p.value }));

  // Top courses horizontal bar data (reverse for horizontal ordering)
  const topCourses = TOP_COURSES.map((c) => ({ ...c }));

  // Recent activities (dummy)
  const RECENT = [
    { time: "2m ago", text: "Aarav purchased Advanced React Patterns (Rs 399)" },
    { time: "1h ago", text: "Prisha uploaded new premium course: Deep Learning for Vision" },
    { time: "3h ago", text: "Kiran upgraded to Pro" },
    { time: "6h ago", text: "Asmita's course reached 1,000 learners" },
  ];

  return (
    <div className="pt-6 pb-24 min-h-screen text-zinc-900 dark:text-zinc-100">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={card} initial="hidden" animate="show" className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500">Learn‑Z Admin</p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Analytics</h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-2xl">Platform performance: revenue, acquisition, course & plan trends.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90"><Download className="w-4 h-4" /> Download Report</button>
              <div className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20"> <Calendar className="w-4 h-4" /> <span className="text-sm">{range === "30d" ? "Last 30 days" : range === "90d" ? "Last 90 days" : "Last 12 months"}</span></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* KPI Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue (12m)" value={`Rs ${KPIs.totalRevenue.toLocaleString()}`} sub="Gross revenue" />
        <StatCard icon={<Users className="w-4 h-4" />} label="Students" value={String(KPIs.students)} sub="Total users" />
        <StatCard icon={<BookOpen className="w-4 h-4" />} label="Courses" value={String(KPIs.courses)} sub={`${KPIs.premium} premium • ${KPIs.freemium} freemium`} />
        <StatCard icon={<Clock className="w-4 h-4" />} label="Purchases" value={String(KPIs.totalPurchases)} sub={`${KPIs.totalSignups} signups`} />
      </section>

      {/* Charts */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid gap-6 lg:grid-cols-3">
        <motion.section variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2"><LineIcon className="w-5 h-5" /> Revenue (Rs x1k)</h3>
            <div className="inline-flex items-center gap-2">
              <button onClick={() => setRange("30d")} className={`text-xs px-2 py-1 rounded-xl ${range === "30d" ? "bg-indigo-500 text-white" : "bg-white/60 dark:bg-zinc-900/60"}`}>30d</button>
              <button onClick={() => setRange("90d")} className={`text-xs px-2 py-1 rounded-xl ${range === "90d" ? "bg-indigo-500 text-white" : "bg-white/60 dark:bg-zinc-900/60"}`}>90d</button>
              <button onClick={() => setRange("1y")} className={`text-xs px-2 py-1 rounded-xl ${range === "1y" ? "bg-indigo-500 text-white" : "bg-white/60 dark:bg-zinc-900/60"}`}>1y</button>
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v: number) => `Rs ${v}k`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2"><ChartPie className="w-5 h-5" /> Plan Distribution</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 items-center">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PLAN_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} strokeWidth={2}>
                    {PLAN_DISTRIBUTION.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => v} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm flex flex-col gap-2">
              {PLAN_DISTRIBUTION.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} /> {p.name}</div>
                  <div className="font-medium">{p.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6 lg:col-span-3">
          <h3 className="text-lg font-semibold flex items-center gap-2"><BarChart4 className="w-5 h-5" /> Top Courses</h3>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {topCourses.map((c, i) => (
                <div key={c.title} className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-zinc-500">{c.purchases.toLocaleString()} purchases</div>
                  </div>
                  <div className="w-36 text-right">Rs {c.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCourses} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" />
                  <YAxis dataKey="title" type="category" width={160} />
                  <Tooltip formatter={(v: number) => `Rs ${v.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[6, 6, 6, 6]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.section>

        <motion.section variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6 lg:col-span-3">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {RECENT.map((r, i) => (
              <li key={i} className="rounded-2xl border border-white/30 dark:border-white/10 p-3 bg-white/50 dark:bg-zinc-900/50"> <span className="text-xs text-zinc-500 mr-2">{r.time}</span> {r.text} </li>
            ))}
          </ul>
        </motion.section>
      </main>

    </div>
  );
}

/* ---------------- Small components ---------------- */
function StatCard({ label, value, sub }: { icon?: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50">
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-500/20 blur-2xl" />
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">Rs.<span>{label}</span></div>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
    </div>
  );
}