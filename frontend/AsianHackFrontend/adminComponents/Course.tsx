"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  BookOpenCheck,
  Tag,
  Layers,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  Eye,
  Crown,
  DollarSign,
  Upload,
  Download,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

/*
  Learn‑Z Admin • Courses Management
  — Manage Freemium & Premium courses
  — Filters, search, bulk actions, create/edit modal, table with selection
  — Mini donut for distribution

  Save as: app/admin/courses/page.tsx
  Requires: tailwindcss, framer-motion, lucide-react, recharts
*/

// ---------------- Types ----------------
export type Course = {
  id: string;
  title: string;
  type: "Freemium" | "Premium";
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  lessons: number;
  learners: number;
  price?: number; // only for premium
  updatedAt: string; // ISO or pretty
  status: "Published" | "Draft";
  progress: number; // authoring completion 0..100
  tags: string[];
};

// ---------------- Dummy Data ----------------
const DUMMY_COURSES: Course[] = [
  {
    id: "c_01",
    title: "Advanced React Patterns",
    type: "Premium",
    level: "Intermediate",
    category: "Frontend",
    lessons: 28,
    learners: 1240,
    price: 3999,
    updatedAt: "2025-09-01",
    status: "Published",
    progress: 100,
    tags: ["React", "Hooks"],
  },
  {
    id: "c_02",
    title: "Next.js App Router Deep Dive",
    type: "Premium",
    level: "Intermediate",
    category: "Frontend",
    lessons: 1800,
    learners: 980,
    price: 29,
    updatedAt: "2025-08-27",
    status: "Published",
    progress: 95,
    tags: ["Next.js", "SSR"],
  },
  {
    id: "c_03",
    title: "TypeScript Pro Essentials",
    type: "Freemium",
    level: "Beginner",
    category: "Programming",
    lessons: 16000,
    learners: 5230,
    updatedAt: "2025-08-30",
    status: "Published",
    progress: 100,
    tags: ["TS", "Types"],
  },
  {
    id: "c_04",
    title: "SQL & Database Basics",
    type: "Freemium",
    level: "Beginner",
    category: "Database",
    lessons: 14000,
    learners: 3320,
    updatedAt: "2025-08-18",
    status: "Published",
    progress: 92,
    tags: ["SQL", "DB"],
  },
  {
    id: "c_05",
    title: "System Design for Frontend",
    type: "Premium",
    level: "Advanced",
    category: "Architecture",
    lessons: 22,
    learners: 410,
    price: 4900,
    updatedAt: "2025-08-10",
    status: "Draft",
    progress: 70,
    tags: ["Design", "Scalability"],
  },
  {
    id: "c_06",
    title: "Docker Fundamentals",
    type: "Freemium",
    level: "Beginner",
    category: "DevOps",
    lessons: 12,
    learners: 2870,
    updatedAt: "2025-07-22",
    status: "Published",
    progress: 100,
    tags: ["Docker"],
  },
  {
    id: "c_07",
    title: "REST API Best Practices",
    type: "Premium",
    level: "Intermediate",
    category: "Backend",
    lessons: 20,
    learners: 870,
    price: 25000,
    updatedAt: "2025-08-05",
    status: "Published",
    progress: 100,
    tags: ["API", "HTTP"],
  },
  {
    id: "c_08",
    title: "Data Structures Primer",
    type: "Freemium",
    level: "Beginner",
    category: "Programming",
    lessons: 15,
    learners: 4520,
    updatedAt: "2025-08-29",
    status: "Published",
    progress: 100,
    tags: ["Algorithms"],
  },
];

// ---------------- Page ----------------
export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(DUMMY_COURSES);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "Freemium" | "Premium">("All");
  const [levelFilter, setLevelFilter] = useState<"All" | Course["level"]>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | Course["status"]>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const categories = useMemo(() => {
    const s = new Set(courses.map((c) => c.category));
    return ["All", ...Array.from(s)];
  }, [courses]);

  const filtered = useMemo(() => {
    let data = courses.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
    if (typeFilter !== "All") data = data.filter((c) => c.type === typeFilter);
    if (levelFilter !== "All") data = data.filter((c) => c.level === levelFilter);
    if (statusFilter !== "All") data = data.filter((c) => c.status === statusFilter);
    if (categoryFilter !== "All") data = data.filter((c) => c.category === categoryFilter);
    return data;
  }, [courses, search, typeFilter, levelFilter, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const kpis = useMemo(() => {
    const total = courses.length;
    const premium = courses.filter((c) => c.type === "Premium").length;
    const freemium = total - premium;
    return { total, premium, freemium };
  }, [courses]);

  const donutData = useMemo(() => [
    { name: "Freemium", value: kpis.freemium },
    { name: "Premium", value: kpis.premium },
  ], [kpis]);

  const COLORS = ["#0EA5E9", "#8B5CF6"]; // sky, violet

  // -------------- Handlers --------------
  function toggleSelectAll(checked: boolean) {
    if (checked) setSelected(new Set(pageData.map((c) => c.id)));
    else setSelected(new Set());
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onCreate(course: Course) {
    setCourses((cs) => [{ ...course, id: `c_${Date.now()}` }, ...cs]);
  }

  function onUpdate(course: Course) {
    setCourses((cs) => cs.map((c) => (c.id === course.id ? course : c)));
  }

  function onDelete(ids: string[]) {
    setCourses((cs) => cs.filter((c) => !ids.includes(c.id)));
    setSelected(new Set());
  }

  function moveType(ids: string[], type: Course["type"]) {
    setCourses((cs) => cs.map((c) => (ids.includes(c.id) ? { ...c, type, price: type === "Freemium" ? undefined : (c.price ?? 19) } : c)));
  }

  function bulkPublish(ids: string[]) {
    setCourses((cs) => cs.map((c) => (ids.includes(c.id) ? { ...c, status: "Published" } : c)));
  }

  // -------------- UI State --------------
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<null | { ids: string }>(null);

  const card = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } } as const;

  return (
    <div className="pt-6 pb-24 min-h-screen dark:from-zinc-950 dark:via-slate-950 dark:to-indigo-950 text-zinc-900 dark:text-zinc-100">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={card} initial="hidden" animate="show" className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Learn‑Z Admin</p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Course Management</h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-2xl">Create, organize, and maintain your freemium & premium catalog.</p>
            </div>
            <div className="flex items-center gap-2">
              <HeroButton icon={<Plus className="w-4 h-4" />} onClick={() => { setEditing(null); setModalOpen(true); }}>New Course</HeroButton>
              <HeroButton icon={<Upload className="w-4 h-4" />}>Import CSV</HeroButton>
              <HeroButton icon={<Download className="w-4 h-4" />}>Export</HeroButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* KPI + Donut */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <KPI icon={<Layers className="w-4 h-4" />} label="All Courses" value={String(kpis.total)} sub="Total" />
        <KPI icon={<BookOpen className="w-4 h-4" />} label="Freemium" value={String(kpis.freemium)} sub="Public" />
        <KPI icon={<BookOpenCheck className="w-4 h-4" />} label="Premium" value={String(kpis.premium)} sub="Paid" />
        <motion.section variants={card} initial="hidden" animate="show" className="lg:col-span-2 rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-4">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Crown className="w-4 h-4" /> Distribution</h3>
          <div className="mt-1 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} strokeWidth={2}>
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number, n: string) => [`${v}`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {donutData.map((d, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                {d.name}: <span className="font-medium">{d.value}</span>
              </span>
            ))}
          </div>
        </motion.section>
      </section>

      {/* Filters + Bulk Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <motion.div variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Filters */}
            <div className="flex flex-1 items-center gap-2">
              <div className="flex-1 min-w-[220px] inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10">
                <Search className="w-4 h-4 text-zinc-400" />
                <input className="w-full bg-transparent outline-none text-sm" placeholder="Search courses..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
              </div>
              <Select value={typeFilter} onChange={(v) => { setTypeFilter(v as any); setPage(1); }} items={["All", "Freemium", "Premium"]} />
              <Select value={levelFilter} onChange={(v) => { setLevelFilter(v as any); setPage(1); }} items={["All", "Beginner", "Intermediate", "Advanced"]} />
              <Select value={statusFilter} onChange={(v) => { setStatusFilter(v as any); setPage(1); }} items={["All", "Published", "Draft"]} />
              <Select value={categoryFilter} onChange={(v) => { setCategoryFilter(v); setPage(1); }} items={categories} />
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-2">
              <button onClick={() => bulkPublish(Array.from(selected))} className="inline-flex items-center gap-1 text-xs rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">
                Publish
              </button>
              <button onClick={() => moveType(Array.from(selected), "Premium")} className="inline-flex items-center gap-1 text-xs rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">
                To Premium
              </button>
              <button onClick={() => moveType(Array.from(selected), "Freemium")} className="inline-flex items-center gap-1 text-xs rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">
                To Freemium
              </button>
              <button onClick={() => setConfirmOpen({ ids: Array.from(selected).join(",") })} className="inline-flex items-center gap-1 text-xs rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60 text-rose-600">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <motion.div variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-2">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 dark:text-zinc-400">
                  <th className="py-3 pl-3 pr-2"><input type="checkbox" onChange={(e) => toggleSelectAll(e.target.checked)} checked={pageData.every((c) => selected.has(c.id)) && pageData.length > 0} /></th>
                  <th className="py-3 pr-3">Title</th>
                  <th className="py-3 pr-3">Type</th>
                  <th className="py-3 pr-3">Price</th>
                  <th className="py-3 pr-3">Lessons</th>
                  <th className="py-3 pr-3">Learners</th>
                  <th className="py-3 pr-3">Progress</th>
                  <th className="py-3 pr-3">Status</th>
                  <th className="py-3 pr-3">Updated</th>
                  <th className="py-3 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((c) => (
                  <tr key={c.id} className="border-t border-white/20 dark:border-white/10">
                    <td className="py-2 pl-3 pr-2"><input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)} /></td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{c.title}</span>
                        <div className="flex flex-wrap gap-1">
                          {c.tags.map((t) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-sky-500/15 border border-white/20 dark:border-white/10">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{c.category} • {c.level}</div>
                    </td>
                    <td className="py-2 pr-3">
                      <TypeBadge type={c.type} />
                    </td>
                    <td className="py-2 pr-3">{c.type === "Premium" ? formatCurrency(c.price ?? 0) : "—"}</td>
                    <td className="py-2 pr-3">{c.lessons}</td>
                    <td className="py-2 pr-3">{c.learners.toLocaleString()}</td>
                    <td className="py-2 pr-3 w-40"><ProgressBar percent={c.progress} /></td>
                    <td className="py-2 pr-3">
                      {c.status === "Published" ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Published</span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-500/15 text-zinc-600 dark:text-zinc-300 border border-white/20">Draft</span>
                      )}
                    </td>
                    <td className="py-2 pr-3">{new Date(c.updatedAt).toLocaleDateString()}</td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditing(c); setModalOpen(true); }} className="text-xs rounded-xl px-2.5 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"><Pencil className="w-3.5 h-3.5" /></button>
                        <Link href={`/courses/${c.id}`} className="text-xs rounded-xl px-2.5 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"><Eye className="w-3.5 h-3.5" /></Link>
                        <button onClick={() => setConfirmOpen({ ids: c.id })} className="text-xs rounded-xl px-2.5 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60 text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{filtered.length} results</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="inline-flex items-center gap-1 text-xs rounded-xl px-3 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60" disabled={page === 1}>
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <span className="text-xs">Page {page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="inline-flex items-center gap-1 text-xs rounded-xl px-3 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60" disabled={page === totalPages}>
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {modalOpen && (
          <CourseModal
            key="course-modal"
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            initial={editing}
            onSave={(data) => {
              if (editing) onUpdate(data);
              else onCreate(data);
              setModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmOpen && (
          <ConfirmDialog
            key="confirm"
            message={`Delete ${confirmOpen.ids.split(",").length} course(s)? This cannot be undone.`}
            onCancel={() => setConfirmOpen(null)}
            onConfirm={() => {
              onDelete(confirmOpen.ids.split(","));
              setConfirmOpen(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Components ---------------- */
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

function Select({ value, onChange, items }: { value: string; onChange: (v: string) => void; items: string[] }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 text-sm">
      <Filter className="w-4 h-4 text-zinc-400" />
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent outline-none">
        {items.map((i) => (
          <option key={i} value={i} className="bg-zinc-900 text-white">{i}</option>
        ))}
      </select>
    </div>
  );
}

function TypeBadge({ type }: { type: Course["type"] }) {
  const cls =
    type === "Premium"
      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
      : "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20";
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${cls}`}>{type}</span>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-zinc-200/70 dark:bg-white/10 overflow-hidden">
      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
    </div>
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

function formatCurrency(v: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "NPR", maximumFractionDigits: 0 }).format(v);
}

/* -------------- Course Modal -------------- */
function CourseModal({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial: Course | null; onSave: (c: Course) => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [type, setType] = useState<Course["type"]>(initial?.type ?? "Freemium");
  const [level, setLevel] = useState<Course["level"]>(initial?.level ?? "Beginner");
  const [category, setCategory] = useState(initial?.category ?? "Frontend");
  const [lessons, setLessons] = useState(initial?.lessons ?? 10);
  const [price, setPrice] = useState<number>(initial?.price ?? 19);
  const [status, setStatus] = useState<Course["status"]>(initial?.status ?? "Draft");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [progress, setProgress] = useState<number>(initial?.progress ?? 50);

  function addTag(t: string) {
    const v = t.trim();
    if (!v) return;
    setTags((arr) => Array.from(new Set([...arr, v])));
  }

  function removeTag(t: string) {
    setTags((arr) => arr.filter((x) => x !== t));
  }

  function submit() {
    if (!title.trim()) return alert("Title required");
    const payload: Course = {
      id: initial?.id ?? "",
      title,
      type,
      level,
      category,
      lessons: Math.max(1, Number(lessons)),
      learners: initial?.learners ?? 0,
      price: type === "Premium" ? Number(price) : undefined,
      updatedAt: new Date().toISOString(),
      status,
      progress: Math.max(0, Math.min(100, Number(progress))),
      tags,
    };
    onSave(payload);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-14 -translate-x-1/2 w-[92vw] max-w-2xl rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial ? "Edit Course" : "New Course"}</h3>
          <button onClick={onClose} className="text-xs rounded-xl px-2 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">Close</button>
        </div>

        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
          <label className="grid gap-1">
            <span>Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none" />
          </label>
          <label className="grid gap-1">
            <span>Category</span>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none" />
          </label>
          <label className="grid gap-1">
            <span>Level</span>
            <select value={level} onChange={(e) => setLevel(e.target.value as any)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span>Lessons</span>
            <input type="number" min={1} value={lessons} onChange={(e) => setLessons(Number(e.target.value))} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none" />
          </label>
          <label className="grid gap-1">
            <span>Type</span>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none">
              <option>Freemium</option>
              <option>Premium</option>
            </select>
          </label>
          {type === "Premium" && (
            <label className="grid gap-1">
              <span>Price (USD)</span>
              <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none" />
            </label>
          )}
          <label className="grid gap-1">
            <span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none">
              <option>Draft</option>
              <option>Published</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span>Authoring Progress</span>
            <input type="number" min={0} max={100} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none" />
          </label>

          {/* Tags */}
          <div className="sm:col-span-2">
            <span className="block mb-1">Tags</span>
            <TagEditor tags={tags} onAdd={addTag} onRemove={removeTag} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button onClick={onClose} className="text-sm rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">Cancel</button>
          <button onClick={submit} className="text-sm rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90">Save</button>
        </div>
      </motion.div>
    </div>
  );
}

function TagEditor({ tags, onAdd, onRemove }: { tags: string[]; onAdd: (t: string) => void; onRemove: (t: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tags.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-sky-500/15 border border-white/20 dark:border-white/10">
          <Tag className="w-3 h-3" /> {t}
          <button onClick={() => onRemove(t)} className="ml-1 text-[10px] px-1 rounded bg-white/30 dark:bg-zinc-800/60">×</button>
        </span>
      ))}
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd(val);
            setVal("");
          }
        }}
        placeholder="Add tag & press Enter"
        className="flex-1 min-w-[160px] rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none text-sm"
      />
    </div>
  );
}

/* -------------- Confirm Dialog -------------- */
function ConfirmDialog({ message, onCancel, onConfirm }: { message: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onCancel}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-24 -translate-x-1/2 w-[92vw] max-w-md rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl p-5">
        <p className="text-sm">{message}</p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="text-sm rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">Cancel</button>
          <button onClick={onConfirm} className="text-sm rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90">Confirm</button>
        </div>
      </motion.div>
    </div>
  );
}