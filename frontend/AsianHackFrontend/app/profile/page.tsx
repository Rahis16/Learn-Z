"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import UpdateProfileModal from "@/components/profile/ProfileEditPopup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Crown,
  Sparkles,
  Gauge,
  BookOpen,
  GraduationCap,
  Rocket,
  Star,
  CheckCircle2,
} from "lucide-react";

interface StudentProfile {
  id: number;
  username: string;
  photo: string;
  rank: number;
  faculty: string;
  year?: number;
  background: string;
  bio: string;
  college: string;
  contact_number: string;
  gender: string;
  lcid: string;
  perm_address: string;
  temp_address: string;
  school: string;
  user: number;
  full_name: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"detail" | "portfolio" | "dashboard">("dashboard");

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const fetchprofile = async () => {
    try {
      const { data } = await axiosWithCsrf("/my-profile/");
      setProfile(data);
      console.log("Profile data:", data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchprofile();
  }, []);

  // ---------- Dummy Data (UI only; keep API logic intact) ----------
  const purchasedCount = 12;
  const studiedHours = 48; // last 30 days
  const overallPerformance = 76; // %
  const aiFeedback = [
    "Great consistency this week (5/7 days).",
    "Revise SQL joins—accuracy dipped on related quizzes.",
    "Consider a weekend sprint on React performance patterns.",
  ];

  const portfolioProjects = [
    {
      id: 1,
      title: "Learn‑Z Classroom UI",
      tag: "Next.js • Tailwind",
      desc: "Responsive app‑router dashboard with gradients & glassmorphism.",
    },
    {
      id: 2,
      title: "Realtime Quiz Engine",
      tag: "React • Framer Motion",
      desc: "Timed questions, rival simulation, and podium summary.",
    },
    {
      id: 3,
      title: "API Notes & Docs",
      tag: "MDX • Markdown",
      desc: "Clean course notes renderer with syntax highlighting.",
    },
  ];

  const certificates = [
    { id: 1, name: "Advanced React", org: "Coursera", year: "2024" },
    { id: 2, name: "SQL Specialist", org: "Udemy", year: "2023" },
  ];

  const studiedRecently = [
    { id: 1, title: "TypeScript Pro Essentials", when: "Yesterday", mins: 42 },
    { id: 2, title: "Next.js App Router Deep Dive", when: "2 days ago", mins: 55 },
    { id: 3, title: "DB Indexing Basics", when: "4 days ago", mins: 31 },
  ];

  const card = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  } as const;

  return (
    <div className="min-h-screen px-6 py-10 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl rounded-3xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl p-6 sm:p-8"
      >
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40 blur-3xl" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
              <Image
                src={profile?.photo || "/images/profile2.jpg"}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-zinc-500 mb-2">@{profile?.username}</p>
              <h1 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
                {profile?.full_name || "Student"}
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl">
                {profile?.bio || "Learner at Learn‑Z. Building skills one sprint at a time."}
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => router.push("/chatpage")}
                className="px-4 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 hover:bg-white/80 dark:hover:bg-zinc-900/80 shadow-sm transition"
              >
                Message
              </button>
              <button
                onClick={() => setOpenModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[{ 
            label: "Rank",
            value: String(profile?.rank ?? "#1"),
          },
          { label: "Courses Purchased", value: String(purchasedCount) },
          { label: "Study (30d)", value: `${studiedHours}h` }].map((s) => (
            <div key={s.label} className="relative overflow-hidden rounded-2xl p-4 border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50">
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-500/20 blur-2xl" />
              <p className="text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex items-center justify-center">
          <div className="inline-flex items-center gap-1 rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-1">
            {([
              { k: "dashboard", label: "Dashboard" },
              { k: "portfolio", label: "Portfolio" },
              { k: "detail", label: "Detail" },
              
            ] as { k: typeof activeTab; label: string }[]).map((t) => (
              <button
                key={t.k}
                onClick={() => setActiveTab(t.k)}
                className={`px-3 py-1.5 rounded-xl text-sm transition cursor-pointer ${
                  activeTab === t.k
                    ? "bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow"
                    : "hover:bg-white/70 dark:hover:bg-zinc-900/70"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

         {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Progress + KPI */}
            <motion.div variants={card} initial="hidden" animate="show" className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/30 via-violet-500/20 to-sky-500/30 blur-3xl" />
              <div className="relative">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Gauge className="w-5 h-5" /> Your Progress</h3>
                <div className="mt-5 grid md:grid-cols-2 gap-4 items-center">
                  <div className="rounded-2xl border border-white/30 dark:border-white/10 p-4 bg-white/50 dark:bg-zinc-900/50 grid place-items-center">
                    <CircularProgress percent={overallPerformance} size={140} stroke={12} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <KPI icon={<BookOpen className="w-4 h-4" />} label="Purchased" value={String(purchasedCount)} sub="Premium courses" />
                    <KPI icon={<Rocket className="w-4 h-4" />} label="Study (30d)" value={`${studiedHours}h`} sub="Focused time" />
                    <KPI icon={<Star className="w-4 h-4" />} label="Performance" value={`${overallPerformance}%`} sub="Overall score" />
                    <KPI icon={<Sparkles className="w-4 h-4" />} label="Badges" value={"5"} sub="Achievements" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Feedback */}
            <motion.div variants={card} initial="hidden" animate="show" className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-gradient-to-b from-white/70 to-white/40 dark:from-zinc-900/70 dark:to-zinc-900/40 p-6">
              <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-gradient-to-tr from-fuchsia-500/40 via-rose-500/30 to-amber-500/40 blur-2xl" />
              <div className="relative">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5" /> AI Feedback (Learn‑Z)</h3>
                <ul className="mt-3 list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-2">
                  {aiFeedback.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Recent Study */}
            <motion.div variants={card} initial="hidden" animate="show" className="lg:col-span-3 rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2"><BookOpen className="w-5 h-5" /> Recent Study</h3>
              <ul className="mt-4 grid sm:grid-cols-3 gap-3">
                {studiedRecently.map((s) => (
                  <li key={s.id} className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-4">
                    <p className="font-medium leading-tight">{s.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{s.when} • {s.mins}m</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </section>
        )}


        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <section className="mt-8 space-y-6">
            <motion.div variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2"><Crown className="w-5 h-5 text-amber-500" /> Projects</h3>
              <div className="mt-4 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
                {portfolioProjects.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-4 hover:bg-white/70 dark:hover:bg-zinc-900/70 transition">
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{p.tag}</p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">{p.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Certificates</h3>
              <ul className="mt-3 grid sm:grid-cols-2 gap-3">
                {certificates.map((c) => (
                  <li key={c.id} className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-4">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{c.org} • {c.year}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </section>
        )}

        {/* Detail Tab */}
        {activeTab === "detail" && (
          <section className="mt-8 grid gap-6 md:grid-cols-3">
            {/* Contact */}
            <motion.div variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {profile?.username || "user"}@learnz.dev</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {profile?.contact_number || "N/A"}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="px-2 py-1 rounded-xl border border-white/20 dark:border-white/10">Faculty: {profile?.faculty || "—"}</span>
                <span className="px-2 py-1 rounded-xl border border-white/20 dark:border-white/10">College: {profile?.college || "—"}</span>
                <span className="px-2 py-1 rounded-xl border border-white/20 dark:border-white/10">LCID: {profile?.lcid || "—"}</span>
                <span className="px-2 py-1 rounded-xl border border-white/20 dark:border-white/10">Gender: {profile?.gender || "—"}</span>
              </div>
            </motion.div>

            {/* Addresses */}
            <motion.div variants={card} initial="hidden" animate="show" className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
              <h3 className="text-lg font-semibold">Addresses</h3>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300"><span className="font-medium">Permanent:</span> {profile?.perm_address || "—"}</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300"><span className="font-medium">Temporary:</span> {profile?.temp_address || "—"}</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300"><span className="font-medium">School:</span> {profile?.school || "—"}</p>
            </motion.div>

            {/* Highlights */}
            <motion.div variants={card} initial="hidden" animate="show" className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-gradient-to-b from-white/70 to-white/40 dark:from-zinc-900/70 dark:to-zinc-900/40 p-6">
              <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-gradient-to-tr from-fuchsia-500/40 via-rose-500/30 to-amber-500/40 blur-2xl" />
              <div className="relative">
                <h3 className="text-lg font-semibold">Highlights</h3>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Completed 7 premium courses</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 20-day learning streak</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ranked top 12% this week</li>
                </ul>
              </div>
            </motion.div>
          </section>
        )}
       
      </motion.div>

      <UpdateProfileModal
        open={openModal}
        onUpdate={() => {
          toast.success("Profile updated successfully!");
          fetchprofile();
        }}
        onClose={() => setOpenModal(false)}
      />
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

function CircularProgress({ percent, size = 120, stroke = 12 }: { percent: number; size?: number; stroke?: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (clamped / 100) * c;

  return (
    <div className="relative grid place-items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" className="text-zinc-200/70 dark:text-white/10" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="url(#gradProfile)" strokeWidth={stroke} fill="none" strokeDasharray={`${dash} ${c - dash}`} strokeLinecap="round" />
        <defs>
          <linearGradient id="gradProfile" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-semibold">{clamped}%</div>
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">overall</div>
      </div>
    </div>
  );
}
