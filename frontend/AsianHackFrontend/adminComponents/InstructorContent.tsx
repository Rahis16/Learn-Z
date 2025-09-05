"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  Pencil,
  Eye,
  Trash2,
  Plus,
  ChartPie,
  BarChart4,
  Crown,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

/*
  Admin Instructors Management Page (single-file)
  - Drop-in page: app/admin/instructors/page.tsx
  - Dummy data included
  - Uses Tailwind classes consistent with your Learn‑Z UI
  - Requires: framer-motion, lucide-react, recharts
*/

export type CourseMini = {
  id: string;
  title: string;
  price: number; // USD
  learners: number;
  revenue: number; // price * learners
};

export type Instructor = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  status: "Active" | "Suspended";
  courses: CourseMini[];
  joined: string; // ISO
  lastActive: string;
};

const DUMMY_INSTRUCTORS: Instructor[] = [
  {
    id: "i_1",
    name: "Dr. Aarav Sharma",
    username: "aarav_sh",
    email: "aarav@learnz.dev",
    avatar: "/images/profile2.jpg",
    bio: "Frontend engineer & mentor. Focused on performance and DX.",
    status: "Active",
    joined: "2024-03-12",
    lastActive: "2h ago",
    courses: [
      { id: "c1", title: "Advanced React Patterns", price: 39, learners: 1240, revenue: 39 * 1240 },
      { id: "c2", title: "Next.js App Router Deep Dive", price: 29, learners: 980, revenue: 29 * 980 },
    ],
  },
  {
    id: "i_2",
    name: "Prof. Prisha Karki",
    username: "prisha_k",
    email: "prisha@learnz.dev",
    avatar: "/images/profile2.jpg",
    bio: "Data scientist & ML educator.",
    status: "Active",
    joined: "2023-11-02",
    lastActive: "1d ago",
    courses: [
      { id: "c3", title: "ML Basics", price: 49, learners: 740, revenue: 49 * 740 },
      { id: "c4", title: "Deep Learning for Vision", price: 59, learners: 360, revenue: 59 * 360 },
    ],
  },
  {
    id: "i_3",
    name: "Nabin Rai",
    username: "nabin",
    email: "nabin@learnz.dev",
    avatar: "/images/profile2.jpg",
    bio: "Backend & systems instructor.",
    status: "Suspended",
    joined: "2024-01-25",
    lastActive: "10d ago",
    courses: [
      { id: "c5", title: "REST API Best Practices", price: 25, learners: 870, revenue: 25 * 870 },
    ],
  },
  {
    id: "i_4",
    name: "Asmita Magar",
    username: "asmita",
    email: "asmita@learnz.dev",
    avatar: "/images/profile2.jpg",
    bio: "UI/UX and design systems.",
    status: "Active",
    joined: "2024-06-02",
    lastActive: "3h ago",
    courses: [
      { id: "c6", title: "Design Systems 101", price: 19, learners: 410, revenue: 19 * 410 },
    ],
  },
];

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>(DUMMY_INSTRUCTORS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Instructor["status"]>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Derived stats
  const totals = useMemo(() => {
    const totalInstructors = instructors.length;
    const active = instructors.filter((i) => i.status === "Active").length;
    const suspended = totalInstructors - active;
    const totalCourses = instructors.reduce((acc, i) => acc + i.courses.length, 0);
    const totalLearners = instructors.reduce((acc, i) => acc + i.courses.reduce((a, c) => a + c.learners, 0), 0);
    const totalRevenue = instructors.reduce((acc, i) => acc + i.courses.reduce((a, c) => a + c.revenue, 0), 0);
    const platformCommission = Math.round(totalRevenue * 0.4); // 40% to instructors according to request?? Wait, user said instructors get 40% — platform commission should be 60%. We'll show instructor share = 40%.
    const instructorShare = Math.round(totalRevenue * 0.4);
    return { totalInstructors, active, suspended, totalCourses, totalLearners, totalRevenue, instructorShare, platformCommission };
  }, [instructors]);

  const filtered = useMemo(() => {
    return instructors.filter((ins) => {
      const q = search.trim().toLowerCase();
      if (statusFilter !== "All" && ins.status !== statusFilter) return false;
      if (!q) return true;
      return (
        ins.name.toLowerCase().includes(q) ||
        ins.username.toLowerCase().includes(q) ||
        ins.email.toLowerCase().includes(q)
      );
    });
  }, [instructors, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Charts
  const donutData = useMemo(() => [
    { name: "Active", value: totals.active },
    { name: "Suspended", value: totals.suspended },
  ], [totals]);

  const revenueByInstructor = useMemo(() => {
    return instructors.map((ins) => ({ name: ins.name.split(" ")[0], revenue: ins.courses.reduce((a, c) => a + c.revenue, 0) })).sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  }, [instructors]);

  // actions
  function toggleSelectAll(checked: boolean) {
    if (checked) setSelected(new Set(pageData.map((i) => i.id)));
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

  function restrict(ids: string[]) {
    setInstructors((list) => list.map((i) => (ids.includes(i.id) ? { ...i, status: "Suspended" } : i)));
    setSelected(new Set());
  }
  function unrestrict(ids: string[]) {
    setInstructors((list) => list.map((i) => (ids.includes(i.id) ? { ...i, status: "Active" } : i)));
    setSelected(new Set());
  }
  function remove(ids: string[]) {
    setInstructors((list) => list.filter((i) => !ids.includes(i.id)));
    setSelected(new Set());
  }

  // modal state
  const [viewing, setViewing] = useState<Instructor | null>(null);
  const [editing, setEditing] = useState<Instructor | null>(null);
  const [confirm, setConfirm] = useState<null | { ids: string[]; action: "restrict" | "unrestrict" | "delete" }>(null);

  return (
    <div className="pt-6 pb-24 min-h-screen text-zinc-900 dark:text-zinc-100">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500">Learn‑Z Admin</p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Instructor Management</h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-2xl">Manage creators, view their catalog & earnings, and take moderation actions.</p>
            </div>
            <div className="flex items-center gap-2">
              <HeroButton icon={<Plus className="w-4 h-4" />} onClick={() => setEditing({ id: "", name: "", username: "", email: "", avatar: "/images/profile2.jpg", bio: "", status: "Active", courses: [], joined: new Date().toISOString(), lastActive: "Just now" })}>Add Instructor</HeroButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* KPIs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid gap-4 md:grid-cols-4">
        <KPI icon={<Users className="w-4 h-4" />} label="Instructors" value={String(totals.totalInstructors)} sub="Total creators" />
        <KPI icon={<Crown className="w-4 h-4" />} label="Courses" value={String(totals.totalCourses)} sub="Published by creators" />
        <KPI icon={<Users className="w-4 h-4" />} label="Learners" value={String(totals.totalLearners)} sub="Across all courses" />
        <KPI icon={<DollarSign className="w-4 h-4" />} label="Instructor Share (40%)" value={`$${totals.instructorShare.toLocaleString()}`} sub="Payout owed" />
      </section>

      {/* Charts */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid gap-6 lg:grid-cols-3">
        <motion.section className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-lg font-semibold flex items-center gap-2"><ChartPie className="w-5 h-5" /> Status</h3>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} strokeWidth={2}>
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={["#6366F1", "#8B5CF6"][i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => v} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm">
              <div className="flex items-center justify-between"><span>Active</span><span className="font-medium">{totals.active}</span></div>
              <div className="flex items-center justify-between mt-2"><span>Suspended</span><span className="font-medium">{totals.suspended}</span></div>
            </div>
          </div>
        </motion.section>

        <motion.section className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6 lg:col-span-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-lg font-semibold flex items-center gap-2"><BarChart4 className="w-5 h-5" /> Top Instructors by Revenue</h3>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByInstructor} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => `Rs${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </main>

      {/* Table + controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <motion.div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 min-w-[220px] inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10">
                <Search className="w-4 h-4 text-zinc-400" />
                <input className="w-full bg-transparent outline-none text-sm" placeholder="Search instructors..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
              </div>
              <Select value={statusFilter} onChange={(v) => { setStatusFilter(v as any); setPage(1); }} items={["All", "Active", "Suspended"]} />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => restrict(Array.from(selected))} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60 text-sm"><ShieldAlert className="w-4 h-4" /> Restrict</button>
              <button onClick={() => unrestrict(Array.from(selected))} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60 text-sm"><ShieldCheck className="w-4 h-4" /> Unrestrict</button>
              <button onClick={() => setConfirm({ ids: Array.from(selected), action: "delete" })} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60 text-sm text-rose-600"><Trash2 className="w-4 h-4" /> Delete</button>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 dark:text-zinc-400">
                  <th className="py-3 pl-3 pr-2"><input type="checkbox" onChange={(e) => toggleSelectAll(e.target.checked)} checked={pageData.every((i) => selected.has(i.id)) && pageData.length > 0} /></th>
                  <th className="py-3 pr-3">Instructor</th>
                  <th className="py-3 pr-3">Courses</th>
                  <th className="py-3 pr-3">Learners</th>
                  <th className="py-3 pr-3">Revenue</th>
                  <th className="py-3 pr-3">Commission (40%)</th>
                  <th className="py-3 pr-3">Status</th>
                  <th className="py-3 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((ins) => {
                  const totalCourses = ins.courses.length;
                  const learners = ins.courses.reduce((a, c) => a + c.learners, 0);
                  const revenue = ins.courses.reduce((a, c) => a + c.revenue, 0);
                  const instructorShare = Math.round(revenue * 0.4);
                  return (
                    <tr key={ins.id} className="border-t border-white/20 dark:border-white/10">
                      <td className="py-2 pl-3 pr-2"><input type="checkbox" checked={selected.has(ins.id)} onChange={() => toggleSelect(ins.id)} /></td>
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-3">
                          <img src={ins.avatar} alt={ins.name} className="w-9 h-9 rounded-xl border border-white/20 object-cover" />
                          <div>
                            <p className="font-medium leading-tight">{ins.name}</p>
                            <p className="text-[11px] text-zinc-500">@{ins.username} • {ins.lastActive}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 pr-3">{totalCourses}</td>
                      <td className="py-2 pr-3">{learners.toLocaleString()}</td>
                      <td className="py-2 pr-3">Rs{revenue.toLocaleString()}</td>
                      <td className="py-2 pr-3">Rs{instructorShare.toLocaleString()}</td>
                      <td className="py-2 pr-3">
                        {ins.status === "Active" ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/20">Active</span>
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 border border-rose-500/20">Suspended</span>
                        )}
                      </td>
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewing(ins)} className="text-xs rounded-xl px-2.5 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"><Eye className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setEditing(ins)} className="text-xs rounded-xl px-2.5 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"><Pencil className="w-3.5 h-3.5" /></button>
                          {ins.status === "Active" ? (
                            <button onClick={() => setConfirm({ ids: [ins.id], action: "restrict" })} className="text-xs rounded-xl px-2.5 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60 text-rose-600"><ShieldAlert className="w-3.5 h-3.5" /></button>
                          ) : (
                            <button onClick={() => setConfirm({ ids: [ins.id], action: "unrestrict" })} className="text-xs rounded-xl px-2.5 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"><ShieldCheck className="w-3.5 h-3.5" /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-zinc-500">{filtered.length} results</span>
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
        {viewing && <InstructorViewModal key="view" instructor={viewing} onClose={() => setViewing(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {editing && (
          <InstructorEditModal
            key="edit"
            initial={editing}
            onClose={() => setEditing(null)}
            onSave={(data) => {
              setInstructors((list) => {
                if (data.id) return list.map((l) => (l.id === data.id ? data : l));
                return [{ ...data, id: `i_${Date.now()}` }, ...list];
              });
              setEditing(null);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {confirm && (
          <ConfirmDialog
            key="confirm"
            message={
              confirm.action === "restrict"
                ? `Suspend ${confirm.ids.length} instructor(s)?`
                : confirm.action === "unrestrict"
                ? `Activate ${confirm.ids.length} instructor(s)?`
                : `Delete ${confirm.ids.length} instructor(s)? This cannot be undone.`
            }
            onCancel={() => setConfirm(null)}
            onConfirm={() => {
              if (confirm.action === "restrict") restrict(confirm.ids);
              else if (confirm.action === "unrestrict") unrestrict(confirm.ids);
              else remove(confirm.ids);
              setConfirm(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Small Components ---------------- */
function KPI({ icon, label, value, sub }: { icon?: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50">
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-500/20 blur-2xl" />
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        {icon && <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-500/20">{icon}</span>}
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
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent outline-none">
        {items.map((i) => (
          <option key={i} value={i} className="bg-zinc-900 text-white">{i}</option>
        ))}
      </select>
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

/* ---------------- Modals ---------------- */
function InstructorViewModal({ instructor, onClose }: { instructor: Instructor; onClose: () => void }) {
  const totalRevenue = instructor.courses.reduce((a, c) => a + c.revenue, 0);
  const instructorShare = Math.round(totalRevenue * 0.4);
  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onClick={(e) => e.stopPropagation()} className="fixed left-1/2 top-12 -translate-x-1/2 w-[92vw] max-w-3xl rounded-3xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Instructor Profile</h3>
          <button onClick={onClose} className="text-xs rounded-xl px-2 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">Close</button>
        </div>

        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 text-center">
            <img src={instructor.avatar} alt={instructor.name} className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg object-cover mx-auto" />
            <p className="mt-3 text-xl font-semibold">{instructor.name}</p>
            <p className="text-sm text-zinc-500">@{instructor.username}</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 max-w-xs mx-auto">{instructor.bio}</p>
            <div className="mt-3 text-sm">
              <div>Joined: <strong>{new Date(instructor.joined).toLocaleDateString()}</strong></div>
              <div>Last active: <strong>{instructor.lastActive}</strong></div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="rounded-2xl border border-white/30 dark:border-white/10 p-4 bg-white/60 dark:bg-zinc-900/60">
              <h4 className="font-semibold text-sm">Stats</h4>
              <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
                <div className="text-center"><div className="text-lg font-semibold">{instructor.courses.length}</div><div className="text-xs text-zinc-500">Courses</div></div>
                <div className="text-center"><div className="text-lg font-semibold">{instructor.courses.reduce((a,c)=>a+c.learners,0)}</div><div className="text-xs text-zinc-500">Learners</div></div>
                <div className="text-center"><div className="text-lg font-semibold">${totalRevenue.toLocaleString()}</div><div className="text-xs text-zinc-500">Gross Rev</div></div>
              </div>
              <div className="mt-3 text-sm">Instructor share (40%): <strong>${instructorShare.toLocaleString()}</strong></div>
            </div>

            <div className="rounded-2xl border border-white/30 dark:border-white/10 p-4 bg-white/60 dark:bg-zinc-900/60">
              <h4 className="font-semibold text-sm">Recent Courses</h4>
              <ul className="mt-2 space-y-2 text-sm">
                {instructor.courses.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{c.title}</div>
                      <div className="text-xs text-zinc-500">{c.learners} learners • ${c.price} • Revenue ${c.revenue.toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-zinc-500">Instructor share: <strong>${Math.round(c.revenue * 0.4).toLocaleString()}</strong></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InstructorEditModal({ initial, onClose, onSave }: { initial: Instructor; onClose: () => void; onSave: (s: Instructor) => void }) {
  const [form, setForm] = useState<Instructor>(initial);
  function setField<K extends keyof Instructor>(k: K, v: Instructor[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onClick={(e) => e.stopPropagation()} className="fixed left-1/2 top-16 -translate-x-1/2 w-[92vw] max-w-2xl rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial.id ? "Edit Instructor" : "Add Instructor"}</h3>
          <button onClick={onClose} className="text-xs rounded-xl px-2 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">Close</button>
        </div>

        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
          <label className="grid gap-1"><span>Name</span><input value={form.name} onChange={(e) => setField("name", e.target.value)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 outline-none" /></label>
          <label className="grid gap-1"><span>Username</span><input value={form.username} onChange={(e) => setField("username", e.target.value)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 outline-none" /></label>
          <label className="grid gap-1 sm:col-span-2"><span>Email</span><input value={form.email} onChange={(e) => setField("email", e.target.value)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 outline-none" /></label>
          <label className="grid gap-1 sm:col-span-2"><span>Bio</span><textarea value={form.bio} onChange={(e) => setField("bio", e.target.value)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 outline-none" /></label>
          <label className="grid gap-1"><span>Status</span><select value={form.status} onChange={(e) => setField("status", e.target.value as any)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 outline-none"><option>Active</option><option>Suspended</option></select></label>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button onClick={onClose} className="text-sm rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">Cancel</button>
          <button onClick={() => onSave(form)} className="text-sm rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90">Save</button>
        </div>
      </motion.div>
    </div>
  );
}

function ConfirmDialog({ message, onCancel, onConfirm }: { message: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onCancel}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onClick={(e) => e.stopPropagation()} className="fixed left-1/2 top-24 -translate-x-1/2 w-[92vw] max-w-md rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl p-5">
        <p className="text-sm">{message}</p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="text-sm rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">Cancel</button>
          <button onClick={onConfirm} className="text-sm rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90">Confirm</button>
        </div>
      </motion.div>
    </div>
  );
}