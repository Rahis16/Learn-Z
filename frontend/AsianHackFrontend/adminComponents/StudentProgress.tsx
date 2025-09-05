"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Pencil,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  GraduationCap,
  School,
  MapPin,
  CalendarClock,
  BadgeCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

/*
  Learn‑Z • Admin Student Management
  — List of students with photo, name, username, email
  — Actions: View (modal), Edit (modal), Restrict/Unrestrict (confirm)
  — Filters & Search, Bulk actions, Pagination, KPIs, small donut chart

  Save as: app/admin/students/page.tsx
  Requires: tailwindcss, framer-motion, lucide-react, recharts
*/

// ---------------- Types ----------------
export type Student = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  plan: "Starter" | "Pro" | "Eager";
  joined: string; // ISO date
  lastActive: string; // relative text or ISO
  status: "Active" | "Restricted";
  semester: number;
  faculty: string;
  college: string;
  phone?: string;
  address?: string;
  gpa?: number;
  progressPct?: number; // overall learning progress
};

// ---------------- Dummy Data ----------------
const DUMMY_STUDENTS: Student[] = [
  {
    id: "s_01",
    name: "Aarav Shrestha",
    username: "aarav",
    email: "aarav@learnz.dev",
    avatar: "/images/profile2.jpg",
    plan: "Pro",
    joined: "2025-07-12",
    lastActive: "5m ago",
    status: "Active",
    semester: 5,
    faculty: "Computer Science",
    college: "Tech Valley College",
    phone: "+977 9800000001",
    address: "Kathmandu, NP",
    gpa: 3.8,
    progressPct: 72,
  },
  {
    id: "s_02",
    name: "Prisha Karki",
    username: "prisha",
    email: "prisha@learnz.dev",
    avatar: "/images/profile2.jpg",
    plan: "Eager",
    joined: "2025-06-21",
    lastActive: "1h ago",
    status: "Active",
    semester: 3,
    faculty: "Information Systems",
    college: "Metro Institute",
    phone: "+977 9811111111",
    address: "Pokhara, NP",
    gpa: 3.9,
    progressPct: 81,
  },
  {
    id: "s_03",
    name: "Nabin Rai",
    username: "nabin",
    email: "nabin@learnz.dev",
    avatar: "/images/profile2.jpg",
    plan: "Pro",
    joined: "2025-04-03",
    lastActive: "Yesterday",
    status: "Active",
    semester: 7,
    faculty: "Software Engineering",
    college: "Kathmandu Tech",
    phone: "+977 9822222222",
    address: "Biratnagar, NP",
    gpa: 3.7,
    progressPct: 66,
  },
  {
    id: "s_04",
    name: "Asmita Magar",
    username: "asmita",
    email: "asmita@learnz.dev",
    avatar: "/images/profile2.jpg",
    plan: "Starter",
    joined: "2025-08-14",
    lastActive: "2d ago",
    status: "Restricted",
    semester: 2,
    faculty: "Network Engineering",
    college: "Himalayan College",
    phone: "+977 9833333333",
    address: "Lalitpur, NP",
    gpa: 3.6,
    progressPct: 41,
  },
  {
    id: "s_05",
    name: "Sagar Thapa",
    username: "sagar",
    email: "sagar@learnz.dev",
    avatar: "/images/profile2.jpg",
    plan: "Pro",
    joined: "2025-03-09",
    lastActive: "3h ago",
    status: "Active",
    semester: 6,
    faculty: "AI & Data",
    college: "Valley University",
    phone: "+977 9844444444",
    address: "Bhaktapur, NP",
    gpa: 3.5,
    progressPct: 58,
  },
  {
    id: "s_06",
    name: "Kiran Lama",
    username: "kiran",
    email: "kiran@learnz.dev",
    avatar: "/images/profile2.jpg",
    plan: "Eager",
    joined: "2025-05-25",
    lastActive: "Just now",
    status: "Active",
    semester: 8,
    faculty: "Artificial Intelligence",
    college: "City Tech College",
    phone: "+977 9855555555",
    address: "Butwal, NP",
    gpa: 4.0,
    progressPct: 90,
  },
  {
    id: "s_07",
    name: "Rohan Thapa",
    username: "rohan",
    email: "rohan@learnz.dev",
    avatar: "/images/profile2.jpg",
    plan: "Starter",
    joined: "2025-02-18",
    lastActive: "4h ago",
    status: "Active",
    semester: 4,
    faculty: "Cybersecurity",
    college: "Nepal IT College",
    phone: "+977 9866666666",
    address: "Dharan, NP",
    gpa: 3.4,
    progressPct: 47,
  },
  {
    id: "s_08",
    name: "Sita Adhikari",
    username: "sita",
    email: "sita@learnz.dev",
    avatar: "/images/profile2.jpg",
    plan: "Pro",
    joined: "2025-01-29",
    lastActive: "5d ago",
    status: "Active",
    semester: 1,
    faculty: "Software Engineering",
    college: "Himalayan College",
    phone: "+977 9877777777",
    address: "Pokhara, NP",
    gpa: 3.6,
    progressPct: 52,
  },
];

// ---------------- Page ----------------
export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>(DUMMY_STUDENTS);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<"All" | Student["plan"]>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | Student["status"]>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const card = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } } as const;

  const filtered = useMemo(() => {
    let data = students.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.username.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );
    if (planFilter !== "All") data = data.filter((s) => s.plan === planFilter);
    if (statusFilter !== "All") data = data.filter((s) => s.status === statusFilter);
    return data;
  }, [students, search, planFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  // KPIs & donut
  const kpis = useMemo(() => {
    const total = students.length;
    const restricted = students.filter((s) => s.status === "Restricted").length;
    const plans = {
      Starter: students.filter((s) => s.plan === "Starter").length,
      Pro: students.filter((s) => s.plan === "Pro").length,
      Eager: students.filter((s) => s.plan === "Eager").length,
    } as const;
    return { total, restricted, plans };
  }, [students]);

  const donutData = useMemo(
    () => [
      { name: "Starter", value: kpis.plans.Starter },
      { name: "Pro", value: kpis.plans.Pro },
      { name: "Eager", value: kpis.plans.Eager },
    ],
    [kpis]
  );
  const COLORS = ["#6366F1", "#8B5CF6", "#0EA5E9"]; // indigo, violet, sky

  // ---------- handlers ----------
  function toggleSelectAll(checked: boolean) {
    if (checked) setSelected(new Set(pageData.map((s) => s.id)));
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
    setStudents((list) =>
      list.map((s) => (ids.includes(s.id) ? { ...s, status: "Restricted" } : s))
    );
    setSelected(new Set());
  }
  function unrestrict(ids: string[]) {
    setStudents((list) =>
      list.map((s) => (ids.includes(s.id) ? { ...s, status: "Active" } : s))
    );
    setSelected(new Set());
  }
  function remove(ids: string[]) {
    setStudents((list) => list.filter((s) => !ids.includes(s.id)));
    setSelected(new Set());
  }

  // view/edit modals state
  const [viewing, setViewing] = useState<Student | null>(null);
  const [editing, setEditing] = useState<Student | null>(null);
  const [confirm, setConfirm] = useState<null | { ids: string[]; action: "restrict" | "unrestrict" | "delete" }>(null);

  return (
    <div className="pt-6 pb-24 min-h-screen dark:from-zinc-950 dark:via-slate-950 dark:to-indigo-950 text-zinc-900 dark:text-zinc-100">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={card} initial="hidden" animate="show" className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Learn‑Z Admin</p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Student Management</h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-2xl">Search, filter, and manage student accounts. View details, edit info, or restrict access.</p>
            </div>
            <div className="flex items-center gap-2">
              <HeroButton icon={<UserPlus className="w-4 h-4" />} onClick={() => setEditing({
                id: "",
                name: "",
                username: "",
                email: "",
                avatar: "/images/profile2.jpg",
                plan: "Starter",
                joined: new Date().toISOString(),
                lastActive: "Just now",
                status: "Active",
                semester: 1,
                faculty: "",
                college: "",
                phone: "",
                address: "",
                gpa: 0,
                progressPct: 0,
              })}>Add Student</HeroButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* KPIs + donut */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <KPI icon={<Users className="w-4 h-4" />} label="Students" value={String(kpis.total)} sub="Total" />
        <KPI icon={<ShieldAlert className="w-4 h-4" />} label="Restricted" value={String(kpis.restricted)} sub="Current" />
        <KPI icon={<BadgeCheck className="w-4 h-4" />} label="Active" value={String(kpis.total - kpis.restricted)} sub="Current" />
        <motion.section variants={card} initial="hidden" animate="show" className="lg:col-span-2 rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">Plan Distribution</h3>
          <div className="mt-1 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} strokeWidth={2}>
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={["#6366F1", "#8B5CF6", "#0EA5E9"][i]} />
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

      {/* Filters + Bulk */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <motion.div variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Filters */}
            <div className="flex flex-1 items-center gap-2">
              <div className="flex-1 min-w-[220px] inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10">
                <Search className="w-4 h-4 text-zinc-400" />
                <input className="w-full bg-transparent outline-none text-sm" placeholder="Search by name, username, email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
              </div>
              <Select value={planFilter} onChange={(v) => { setPlanFilter(v as any); setPage(1); }} items={["All", "Starter", "Pro", "Eager"]} />
              <Select value={statusFilter} onChange={(v) => { setStatusFilter(v as any); setPage(1); }} items={["All", "Active", "Restricted"]} />
            </div>
            {/* Bulk actions */}
            <div className="flex items-center gap-2">
              <button onClick={() => setConfirm({ ids: Array.from(selected), action: "restrict" })} className="inline-flex items-center gap-1 text-xs rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"><ShieldAlert className="w-3.5 h-3.5" /> Restrict</button>
              <button onClick={() => setConfirm({ ids: Array.from(selected), action: "unrestrict" })} className="inline-flex items-center gap-1 text-xs rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"><ShieldCheck className="w-3.5 h-3.5" /> Unrestrict</button>
              <button onClick={() => setConfirm({ ids: Array.from(selected), action: "delete" })} className="inline-flex items-center gap-1 text-xs rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60 text-rose-600"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
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
                  <th className="py-3 pl-3 pr-2"><input type="checkbox" onChange={(e) => toggleSelectAll(e.target.checked)} checked={pageData.every((s) => selected.has(s.id)) && pageData.length > 0} /></th>
                  <th className="py-3 pr-3">Student</th>
                  <th className="py-3 pr-3">Username</th>
                  <th className="py-3 pr-3">Email</th>
                  <th className="py-3 pr-3">Plan</th>
                  <th className="py-3 pr-3">Joined</th>
                  <th className="py-3 pr-3">Status</th>
                  <th className="py-3 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((s) => (
                  <tr key={s.id} className="border-t border-white/20 dark:border-white/10">
                    <td className="py-2 pl-3 pr-2"><input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} /></td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-xl border border-white/20 object-cover" />
                        <div>
                          <p className="font-medium leading-tight">{s.name}</p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Last active • {s.lastActive}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 pr-3">@{s.username}</td>
                    <td className="py-2 pr-3"><a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a></td>
                    <td className="py-2 pr-3">{s.plan}</td>
                    <td className="py-2 pr-3">{new Date(s.joined).toLocaleDateString()}</td>
                    <td className="py-2 pr-3">
                      {s.status === "Active" ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Active</span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">Restricted</span>
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewing(s)} className="text-xs rounded-xl px-2.5 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditing(s)} className="text-xs rounded-xl px-2.5 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"><Pencil className="w-3.5 h-3.5" /></button>
                        {s.status === "Active" ? (
                          <button onClick={() => setConfirm({ ids: [s.id], action: "restrict" })} className="text-xs rounded-xl px-2.5 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60 text-rose-600"><ShieldAlert className="w-3.5 h-3.5" /></button>
                        ) : (
                          <button onClick={() => setConfirm({ ids: [s.id], action: "unrestrict" })} className="text-xs rounded-xl px-2.5 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"><ShieldCheck className="w-3.5 h-3.5" /></button>
                        )}
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
        {viewing && (
          <StudentViewModal key="view" student={viewing} onClose={() => setViewing(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {editing && (
          <StudentEditModal key="edit" initial={editing} onClose={() => setEditing(null)} onSave={(data) => {
            setStudents((list) => {
              if (data.id) return list.map((s) => (s.id === data.id ? data : s));
              return [{ ...data, id: `s_${Date.now()}` }, ...list];
            });
            setEditing(null);
          }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {confirm && (
          <ConfirmDialog
            key="confirm"
            message={
              confirm.action === "restrict"
                ? `Restrict ${confirm.ids.length} student(s)?`
                : confirm.action === "unrestrict"
                ? `Unrestrict ${confirm.ids.length} student(s)?`
                : `Delete ${confirm.ids.length} student(s)? This cannot be undone.`
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

function HeroButton({ icon, children, onClick }: { icon: React.ReactNode; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 text-sm font-medium rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90">
      <span className="grid place-items-center w-5 h-5 rounded-md bg-white/20">{icon}</span>
      {children}
    </button>
  );
}

function ProgressPill({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className="inline-flex items-center gap-2 text-[11px] px-2 py-0.5 rounded-full border border-white/20 dark:border-white/10">
      <span className="w-20 h-1.5 rounded-full bg-zinc-200/70 dark:bg-white/10 overflow-hidden">
        <span className="block h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500" style={{ width: `${p}%` }} />
      </span>
      {p}%
    </div>
  );
}

/* -------------- View Modal -------------- */
function StudentViewModal({ student, onClose }: { student: Student; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-12 -translate-x-1/2 w-[92vw] max-w-3xl rounded-3xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Student Details</h3>
          <button onClick={onClose} className="text-xs rounded-xl px-2 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">Close</button>
        </div>

        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="flex flex-col items-center text-center">
              <img src={student.avatar} alt={student.name} className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover" />
              <p className="mt-3 text-xl font-semibold">{student.name}</p>
              <p className="text-sm text-zinc-500">@{student.username}</p>
              <p className="mt-1 text-xs text-zinc-500"><a className="hover:underline" href={`mailto:${student.email}`}>{student.email}</a></p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full border border-white/20 dark:border-white/10">Plan: {student.plan}</span>
                <span className="px-2 py-0.5 rounded-full border border-white/20 dark:border-white/10">Joined: {new Date(student.joined).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 grid gap-4">
            <div className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-4">
              <h4 className="font-semibold text-sm flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Academics</h4>
              <div className="mt-2 grid sm:grid-cols-2 gap-2 text-sm">
                <span>Semester: <strong>{student.semester}</strong></span>
                <span>Faculty: <strong>{student.faculty}</strong></span>
                <span>College: <strong>{student.college}</strong></span>
                <span>GPA: <strong>{student.gpa ?? "—"}</strong></span>
              </div>
              <div className="mt-3"><span className="text-xs text-zinc-500">Overall Progress</span> <div className="mt-1"><ProgressPill percent={student.progressPct ?? 0} /></div></div>
            </div>

            <div className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-4">
              <h4 className="font-semibold text-sm flex items-center gap-2"><School className="w-4 h-4" /> Contact</h4>
              <div className="mt-2 grid sm:grid-cols-2 gap-2 text-sm">
                <span className="inline-flex items-center gap-2"><Mail className="w-4 h-4" /> {student.email}</span>
                <span className="inline-flex items-center gap-2"><Phone className="w-4 h-4" /> {student.phone ?? "—"}</span>
                <span className="inline-flex items-center gap-2 sm:col-span-2"><MapPin className="w-4 h-4" /> {student.address ?? "—"}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-4">
              <h4 className="font-semibold text-sm flex items-center gap-2"><CalendarClock className="w-4 h-4" /> Activity</h4>
              <div className="mt-2 grid sm:grid-cols-3 gap-2 text-sm">
                <span>Joined: <strong>{new Date(student.joined).toLocaleDateString()}</strong></span>
                <span>Last Active: <strong>{student.lastActive}</strong></span>
                <span>Status: <strong>{student.status}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------- Edit Modal -------------- */
function StudentEditModal({ initial, onClose, onSave }: { initial: Student; onClose: () => void; onSave: (s: Student) => void }) {
  const [form, setForm] = useState<Student>(initial);
  function set<K extends keyof Student>(key: K, val: Student[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-16 -translate-x-1/2 w-[92vw] max-w-2xl rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial.id ? "Edit Student" : "Add Student"}</h3>
          <button onClick={onClose} className="text-xs rounded-xl px-2 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">Close</button>
        </div>
        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
          <label className="grid gap-1"><span>Name</span><input value={form.name} onChange={(e) => set("name", e.target.value)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none" /></label>
          <label className="grid gap-1"><span>Username</span><input value={form.username} onChange={(e) => set("username", e.target.value)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none" /></label>
          <label className="grid gap-1"><span>Email</span><input value={form.email} onChange={(e) => set("email", e.target.value)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none" /></label>
          <label className="grid gap-1"><span>Plan</span><select value={form.plan} onChange={(e) => set("plan", e.target.value as any)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none"><option>Starter</option><option>Pro</option><option>Eager</option></select></label>
          <label className="grid gap-1"><span>Semester</span><input type="number" min={1} max={8} value={form.semester} onChange={(e) => set("semester", Number(e.target.value))} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none" /></label>
          <label className="grid gap-1"><span>Faculty</span><input value={form.faculty} onChange={(e) => set("faculty", e.target.value)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none" /></label>
          <label className="grid gap-1"><span>College</span><input value={form.college} onChange={(e) => set("college", e.target.value)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none" /></label>
          <label className="grid gap-1"><span>Phone</span><input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none" /></label>
          <label className="grid gap-1 sm:col-span-2"><span>Address</span><input value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} className="rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 outline-none" /></label>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button onClick={onClose} className="text-sm rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">Cancel</button>
          <button onClick={() => onSave(form)} className="text-sm rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90">Save</button>
        </div>
      </motion.div>
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