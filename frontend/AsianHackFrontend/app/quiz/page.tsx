"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  Users,
  Timer,
  MessageCircle,
  Trophy,
  Award,
  Rocket,
  Clock,
  Crown,
  Target,
  BarChart2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RefreshCcw,
  History,
  Star,
  Medal,
  ShieldCheck,
  Flame,
  Search,
  X,
} from "lucide-react";

/*
  Learn‑Z Quiz Page
  — Same UI vibe as your dashboard/community (glassy, gradients, rounded‑3xl, borders)
  — Modes: Realtime Quiz, Assigned Quiz, Dashboard, Leaderboard (Top 100)
  — Dummy data + full simulation engine (timer, per‑question feedback, summary)
  — Plug in your backend later (TODO comments added)

  Drop in as: app/quiz/page.tsx (Next.js App Router)
*/

// ---------- Types ----------
type Question = {
  id: string;
  q: string;
  options: string[];
  answer: number; // index in options
  points?: number; // default 10
};

type QuizPack = {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  timePerQuestionSec: number; // e.g., 20
};

type AssignedQuiz = {
  id: string;
  title: string;
  due: string; // pretty time
  totalQs: number;
  status: "Not Started" | "In Progress" | "Completed";
  pack: QuizPack;
};

type Attempt = {
  id: string;
  quizTitle: string;
  mode: "Realtime" | "Assigned";
  score: number;
  total: number;
  correct: number;
  incorrect: number;
  startedAt: string; // timestamp
  durationSec: number;
};

type Rival = {
  id: string;
  name: string;
  avatar: string;
  score: number;
  progress: number;
};

// ---------- Dummy IT Questions ----------
const IT_QUESTIONS: Question[] = [
  {
    id: "q1",
    q: "Which HTTP status code indicates a resource was created?",
    options: ["200", "201", "301", "404"],
    answer: 1,
  },
  {
    id: "q2",
    q: "What does Big‑O notation O(n log n) usually represent?",
    options: [
      "Linear growth",
      "Logarithmic growth",
      "Quasi‑linear growth (e.g., mergesort)",
      "Exponential growth",
    ],
    answer: 2,
  },
  {
    id: "q3",
    q: "Which method is idempotent in REST?",
    options: ["POST", "PUT", "PATCH", "CONNECT"],
    answer: 1,
  },
  {
    id: "q4",
    q: "In React, what does an empty dependency array in useEffect mean?",
    options: [
      "Run on every render",
      "Run once after mount",
      "Run only on unmount",
      "Never run",
    ],
    answer: 1,
  },
  {
    id: "q5",
    q: "In SQL, the PRIMARY KEY constraint implies…",
    options: [
      "Column must be nullable",
      "Column is unique and not null",
      "Allows duplicates",
      "References another table",
    ],
    answer: 1,
  },
  {
    id: "q6",
    q: "git stash is used to…",
    options: [
      "Permanently delete changes",
      "Temporarily save and clear working changes",
      "Switch branches",
      "Rebase commits",
    ],
    answer: 1,
  },
  {
    id: "q7",
    q: "DNS translates domain names to…",
    options: ["MAC addresses", "IP addresses", "Ports", "Gateways"],
    answer: 1,
  },
  {
    id: "q8",
    q: "Layer 4 of the OSI model is…",
    options: ["Network", "Transport", "Session", "Application"],
    answer: 1,
  },
  {
    id: "q9",
    q: "Which is true about Docker vs VMs?",
    options: [
      "Docker containers include their own kernel",
      "VMs share the host kernel",
      "Containers share the host kernel",
      "VMs are always faster",
    ],
    answer: 2,
  },
  {
    id: "q10",
    q: "Which HTTP method is typically used to partially update a resource?",
    options: ["GET", "POST", "PUT", "PATCH"],
    answer: 3,
  },
];

// A couple of packs to reuse
const PACK_REALTIME: QuizPack = {
  id: "pack_rt",
  title: "Realtime IT Basics",
  description: "Fast‑paced IT fundamentals showdown",
  questions: IT_QUESTIONS,
  timePerQuestionSec: 20,
};

const PACK_ASSIGNED: QuizPack = {
  id: "pack_asg",
  title: "Assigned Quiz • Web & DB",
  description: "Mixed web/REST/DB basics",
  questions: IT_QUESTIONS.slice(0, 6),
  timePerQuestionSec: 25,
};

// Assigned list
const ASSIGNED: AssignedQuiz[] = [
  {
    id: "asg_1",
    title: "Module 1 Checkpoint",
    due: "Sep 15, 2025",
    totalQs: PACK_ASSIGNED.questions.length,
    status: "Not Started",
    pack: PACK_ASSIGNED,
  },
  {
    id: "asg_2",
    title: "Weekly Sprint Quiz",
    due: "Sep 20, 2025",
    totalQs: PACK_ASSIGNED.questions.length,
    status: "Not Started",
    pack: PACK_ASSIGNED,
  },
];

// ---------- Leaderboard dummy ----------
function seedLeaderboard(): { id: string; name: string; points: number }[] {
  const names = [
    "Aarav Shrestha",
    "Prisha Karki",
    "Nabin Rai",
    "Sujal KC",
    "Anusha Bista",
    "Kishor Lama",
    "Ritika Poudel",
    "Sagar Thapa",
    "Asmita Magar",
    "Rupesh Karki",
  ];
  const arr: { id: string; name: string; points: number }[] = [];
  for (let i = 0; i < 100; i++) {
    const n = names[i % names.length] + (i >= names.length ? ` ${i}` : "");
    arr.push({
      id: `lb_${i}`,
      name: n,
      points: Math.floor(1200 - i * 7 + Math.random() * 20),
    });
  }
  // sort desc
  arr.sort((a, b) => b.points - a.points);
  return arr;
}

// ---------- Page ----------
export default function QuizPage() {
  const router = useRouter();
  const [tab, setTab] = useState<
    "realtime" | "assigned" | "dashboard" | "leaderboard"
  >("realtime");
  const [assigned, setAssigned] = useState<AssignedQuiz[]>(ASSIGNED);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [leaderboard] = useState(seedLeaderboard());
  const me = { id: "you", name: "You" };

  const card = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  } as const;

  // rank calc from attempts (simple sum)
  const myPoints = useMemo(
    () => attempts.reduce((a, x) => a + x.score, 0),
    [attempts]
  );

  // ---------- Handlers ----------
  function recordAttempt(a: Attempt) {
    setAttempts((prev) => [a, ...prev]);
  }

  function markAssignedInProgress(id: string) {
    setAssigned((list) =>
      list.map((q) => (q.id === id ? { ...q, status: "In Progress" } : q))
    );
  }

  function markAssignedCompleted(id: string) {
    setAssigned((list) =>
      list.map((q) => (q.id === id ? { ...q, status: "Completed" } : q))
    );
  }

  return (
    <div className="pt-6 pb-24 min-h-screen dark:from-zinc-950 dark:via-slate-950 dark:to-indigo-950 text-zinc-900 dark:text-zinc-100">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={card}
          initial="hidden"
          animate="show"
          className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40 blur-3xl" />
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Learn‑Z Quizzes
                </p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
                  Play, compete, and{" "}
                  <span className="bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
                    climb the ranks
                  </span>
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-2xl">
                  Jump into realtime battles or finish your assigned quizzes.
                  Track your performance and challenge the leaderboard.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <HeroButton
                  icon={<Play className="w-4 h-4" />}
                  onClick={() => setTab("realtime")}
                >
                  Realtime
                </HeroButton>
                <HeroButton
                  icon={<Clock className="w-4 h-4" />}
                  onClick={() => setTab("assigned")}
                >
                  Assigned
                </HeroButton>
                <HeroButton
                  icon={<BarChart2 className="w-4 h-4" />}
                  onClick={() => setTab("dashboard")}
                >
                  Dashboard
                </HeroButton>
                <HeroButton
                  icon={<Trophy className="w-4 h-4" />}
                  onClick={() => setTab("leaderboard")}
                >
                  Leaderboard
                </HeroButton>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 inline-flex items-center gap-1 rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-1">
              {(
                [
                  { k: "realtime", label: "Realtime Quiz" },
                  { k: "assigned", label: "Assigned" },
                  { k: "dashboard", label: "Dashboard" },
                  { k: "leaderboard", label: "Leaderboard" },
                ] as { k: typeof tab; label: string }[]
              ).map((t) => (
                <button
                  key={t.k}
                  onClick={() => setTab(t.k)}
                  className={`px-3 py-1.5 rounded-xl text-sm transition ${
                    tab === t.k
                      ? "bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow"
                      : "hover:bg-white/70 dark:hover:bg-zinc-900/70"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {tab === "realtime" && (
              <motion.div
                key="rt"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <RealtimeArea pack={PACK_REALTIME} onFinish={recordAttempt} />
              </motion.div>
            )}
            {tab === "assigned" && (
              <motion.div
                key="asg"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <AssignedArea
                  items={assigned}
                  onStart={(id) => markAssignedInProgress(id)}
                  onFinish={(id, attempt) => {
                    markAssignedCompleted(id);
                    recordAttempt(attempt);
                  }}
                />
              </motion.div>
            )}
            {tab === "dashboard" && (
              <motion.div
                key="dash"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <DashboardArea attempts={attempts} myPoints={myPoints} />
              </motion.div>
            )}
            {tab === "leaderboard" && (
              <motion.div
                key="lb"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <LeaderboardArea
                  data={leaderboard}
                  you={me}
                  myPoints={myPoints}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <aside className="space-y-6">
          {/* Tips / Rules */}
          <motion.section
            variants={card}
            initial="hidden"
            animate="show"
            className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Fair Play Tips
            </h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-2">
              <li>Each question has a timer. Answer before it runs out.</li>
              <li>Correct = +10 pts, Wrong = 0 (no negative marks in demo).</li>
              <li>Realtime rooms simulate 4–6 rivals for practice.</li>
            </ul>
          </motion.section>

          {/* Quick Stats */}
          <motion.section
            variants={card}
            initial="hidden"
            animate="show"
            className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Flame className="w-5 h-5" /> Quick Stats
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <KPI
                icon={<Trophy className="w-4 h-4" />}
                label="Total Points"
                value={String(myPoints)}
                sub="Sum of scores"
              />
              <KPI
                icon={<Star className="w-4 h-4" />}
                label="Attempts"
                value={String(attempts.length)}
                sub="Played quizzes"
              />
            </div>
            <Link
              href="#"
              className="inline-flex items-center gap-1 text-xs mt-3 rounded-xl px-3 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"
            >
              See detailed analytics <ChevronRight className="w-3 h-3" />
            </Link>
          </motion.section>
        </aside>
      </main>
    </div>
  );
}

/* ---------------- Realtime Area ---------------- */
function RealtimeArea({
  pack,
  onFinish,
}: {
  pack: QuizPack;
  onFinish: (a: Attempt) => void;
}) {
  const [phase, setPhase] = useState<
    "lobby" | "countdown" | "playing" | "summary"
  >("lobby");
  const [rivals, setRivals] = useState<Rival[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);

  // prepare quiz engine when playing
  const [startEngine, setStartEngine] = useState(false);
  const engineRef = useRef<{
    getSummary: () => {
      score: number;
      correct: number;
      incorrect: number;
      durationSec: number;
    };
  } | null>(null);

  function seedRivals() {
    const pool = [
      "Aarav",
      "Prisha",
      "Nabin",
      "Isha",
      "Ravi",
      "Asmita",
      "Sagar",
      "Ritika",
      "Kishor",
      "Anusha",
    ];
    const count = 4 + Math.floor(Math.random() * 3); // 4-6
    const arr: Rival[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: `rv_${i}`,
        name: pool[i],
        avatar: "/images/profile2.jpg",
        score: 0,
        progress: 0,
      });
    }
    setRivals(arr);
  }

  function startMatch() {
    seedRivals();
    setPhase("countdown");
    setTimeout(() => {
      setPhase("playing");
      setStartEngine(true);
    }, 3000);
  }

  function onEngineComplete(summary: {
    score: number;
    correct: number;
    incorrect: number;
    durationSec: number;
  }) {
    // Simulate rivals final scores
    const rivalBoost = rivals.map((r) => ({
      ...r,
      score: summary.score + Math.floor(Math.random() * 15) - 5,
    }));
    setRivals(rivalBoost);

    const a: Attempt = {
      id: `rt_${Date.now()}`,
      quizTitle: pack.title,
      mode: "Realtime",
      score: summary.score,
      total: pack.questions.length * 10,
      correct: summary.correct,
      incorrect: summary.incorrect,
      startedAt: new Date().toISOString(),
      durationSec: summary.durationSec,
    };
    setAttempt(a);
    onFinish(a);
    setPhase("summary");
  }

  return (
    <div className="space-y-6">
      {phase === "lobby" && (
        <div className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6">
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-gradient-to-tr from-fuchsia-500/40 via-rose-500/30 to-amber-500/40 blur-2xl" />
          <div className="relative">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" /> Realtime Lobby
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
              Get matched with peers and race against the clock.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={startMatch}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white text-sm shadow hover:opacity-90"
              >
                <Play className="w-4 h-4" /> Start Matchmaking
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60 text-sm">
                <Search className="w-4 h-4" /> Enter Room Code
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === "countdown" && (
        <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Timer className="w-5 h-5" /> Starting in…
          </h3>
          <Countdown seconds={3} />
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">
            Matched players: {rivals.length}
          </p>
        </div>
      )}

      {phase === "playing" && (
        <QuizEngine
          key="rt_engine"
          pack={pack}
          onComplete={onEngineComplete}
          setExternalRef={(api) => (engineRef.current = api)}
          simulateRivals={(qIdx) => {
            // update rivals progress/score while you play
            // simplistic: every question some rivals get it right
            const hit = Math.floor(Math.random() * rivals.length);
            setRivals((rs) =>
              rs.map((r, i) => ({
                ...r,
                progress: Math.max(
                  r.progress,
                  ((qIdx + 1) / pack.questions.length) * 100
                ),
                score: i === hit ? r.score + 10 : r.score,
              }))
            );
          }}
        />
      )}

      {phase === "summary" && attempt && (
        <div className="space-y-6">
          <SummaryCard attempt={attempt} />
          <Podium rivals={rivals} youScore={attempt.score} />
        </div>
      )}
    </div>
  );
}

/* ---------------- Assigned Area ---------------- */
function AssignedArea({
  items,
  onStart,
  onFinish,
}: {
  items: AssignedQuiz[];
  onStart: (id: string) => void;
  onFinish: (id: string, attempt: Attempt) => void;
}) {
  const [active, setActive] = useState<AssignedQuiz | null>(null);

  return (
    <div className="space-y-6">
      {!active && (
        <div className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6">
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-gradient-to-tr from-fuchsia-500/40 via-rose-500/30 to-amber-500/40 blur-2xl" />
          <div className="relative">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" /> Assigned Quizzes
            </h3>
            <ul className="mt-4 space-y-3">
              {items.map((q) => (
                <li
                  key={q.id}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-4 hover:bg-white/70 dark:hover:bg-zinc-900/70 transition"
                >
                  <div>
                    <p className="font-medium">{q.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Target className="w-3 h-3" /> {q.totalQs} questions
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Due {q.due}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> {q.status}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onStart(q.id);
                      setActive(q);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium rounded-xl px-3 py-1.5 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90"
                  >
                    Start <ChevronRight className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {active && (
        <QuizEngine
          key={active.id}
          pack={active.pack}
          onComplete={(sum) => {
            const attempt: Attempt = {
              id: `asg_${Date.now()}`,
              quizTitle: active.title,
              mode: "Assigned",
              score: sum.score,
              total: active.pack.questions.length * 10,
              correct: sum.correct,
              incorrect: sum.incorrect,
              startedAt: new Date().toISOString(),
              durationSec: sum.durationSec,
            };
            onFinish(active.id, attempt);
            setActive(null);
          }}
        />
      )}
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function DashboardArea({
  attempts,
  myPoints,
}: {
  attempts: Attempt[];
  myPoints: number;
}) {
  const totalCorrect = attempts.reduce((a, x) => a + x.correct, 0);
  const totalQs = attempts.reduce((a, x) => a + x.total / 10, 0);
  const accuracy = totalQs > 0 ? Math.round((totalCorrect / totalQs) * 100) : 0;
  const best = attempts[0]?.score ?? 0;

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);

  // Build review payload.
  // If your Attempt already stores detailed per-question data (recommended), use that.
  // Otherwise, we synthesize from the quiz packs you used.
  function openReview(a: Attempt) {
    // If you saved `a.detail` from QuizEngine, prefer it:
    const detail = (a as any).detail as ReviewItem[] | undefined;
    if (detail?.length) {
      setReviewItems(detail);
      setReviewOpen(true);
      return;
    }

    // Fallback: map from a pack by title (adjust this mapping for your app)
    const pack = a.quizTitle.includes("Assigned")
      ? PACK_ASSIGNED
      : PACK_REALTIME;

    const items: ReviewItem[] = pack.questions.map((q, i) => ({
      id: q.id,
      question: q.q,
      options: q.options,
      correctIndex: q.answer,
      // Without stored user choices we fake it: 60% chance you picked correct
      chosenIndex:
        Math.random() < 0.6 ? q.answer : (q.answer + 1) % q.options.length,
      distribution: synthesizeDistribution(q.options.length, q.answer),
    }));

    setReviewItems(items);
    setReviewOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-gradient-to-b from-white/70 to-white/40 dark:from-zinc-900/70 dark:to-zinc-900/40 backdrop-blur-xl shadow-xl p-6">
        <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-gradient-to-tr from-fuchsia-500/40 via-rose-500/30 to-amber-500/40 blur-2xl" />
        <div className="relative">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart2 className="w-5 h-5" /> Performance Overview
          </h3>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <KPI
              icon={<Trophy className="w-4 h-4" />}
              label="Total Points"
              value={String(myPoints)}
              sub="Sum of all quizzes"
            />
            <KPI
              icon={<Target className="w-4 h-4" />}
              label="Accuracy"
              value={`${accuracy}%`}
              sub="Correct answers"
            />
            <KPI
              icon={<Medal className="w-4 h-4" />}
              label="Best Score"
              value={String(best)}
              sub="Highest game"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History className="w-5 h-5" /> Past Attempts
        </h3>
        {attempts.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">
            No attempts yet. Play a quiz to see your history.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {attempts.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-4"
              >
                <div>
                  <p className="font-medium">
                    {a.quizTitle}{" "}
                    <span className="text-xs text-zinc-500">• {a.mode}</span>
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {Math.round(a.durationSec)}s
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {a.correct} correct
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {a.incorrect} wrong
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-lg font-semibold">{a.score}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      / {a.total}
                    </p>
                  </div>
                  <button
                    onClick={() => openReview(a)}
                    className="text-xs rounded-xl px-3 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"
                  >
                    Review
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ReviewModal
        open={reviewOpen}
        items={reviewItems}
        onClose={() => setReviewOpen(false)}
      />
    </div>
  );
}

/* ---------------- Leaderboard ---------------- */
function LeaderboardArea({
  data,
  you,
  myPoints,
}: {
  data: { id: string; name: string; points: number }[];
  you: { id: string; name: string };
  myPoints: number;
}) {
  // insert you somewhere realistically
  const withYou = useMemo(() => {
    const arr = [...data];
    const idx = arr.findIndex((x) => myPoints > x.points);
    arr.splice(idx >= 0 ? idx : arr.length, 0, {
      id: you.id,
      name: you.name,
      points: myPoints,
    });
    return arr.slice(0, 100);
  }, [data, myPoints, you.id, you.name]);

  return (
    <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Trophy className="w-5 h-5" /> Top 100 Leaderboard
      </h3>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 dark:text-zinc-400">
              <th className="py-2 pr-3">#</th>
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Points</th>
            </tr>
          </thead>
          <tbody>
            {withYou.map((row, i) => {
              const isMe = row.id === you.id;
              return (
                <tr
                  key={row.id}
                  className={`border-t border-white/20 dark:border-white/10 ${
                    isMe
                      ? "bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-sky-500/10"
                      : ""
                  }`}
                >
                  <td className="py-2 pr-3 font-mono">{i + 1}</td>
                  <td className="py-2 pr-3 flex items-center gap-2">
                    {i < 3 && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white text-[11px]">
                        {i + 1}
                      </span>
                    )}
                    <span
                      className={`font-medium ${
                        isMe ? "text-indigo-600 dark:text-indigo-300" : ""
                      }`}
                    >
                      {row.name}
                    </span>
                    {isMe && (
                      <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        You
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Quiz Engine ---------------- */
function QuizEngine({
  pack,
  onComplete,
  setExternalRef,
  simulateRivals,
}: {
  pack: QuizPack;
  onComplete: (summary: {
    score: number;
    correct: number;
    incorrect: number;
    durationSec: number;
  }) => void;
  setExternalRef?: (api: {
    getSummary: () => {
      score: number;
      correct: number;
      incorrect: number;
      durationSec: number;
    };
  }) => void;
  simulateRivals?: (qIdx: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(pack.timePerQuestionSec);
  const [done, setDone] = useState(false);
  const [startedAt] = useState<number>(Date.now());

  const total = pack.questions.length;
  const q = pack.questions[idx];

  // expose API
  useEffect(() => {
    setExternalRef?.({
      getSummary: () => ({
        score,
        correct,
        incorrect,
        durationSec: (Date.now() - startedAt) / 1000,
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, correct, incorrect]);

  useEffect(() => {
    setTimeLeft(pack.timePerQuestionSec);
  }, [idx, pack.timePerQuestionSec]);

  // countdown per question
  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [done]);

  useEffect(() => {
    if (timeLeft < 0) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  function handleSubmit(choice?: number) {
    const picked = choice ?? selected;
    const isCorrect = picked === q.answer;
    if (picked != null) {
      if (isCorrect) {
        setScore((s) => s + (q.points ?? 10));
        setCorrect((c) => c + 1);
      } else {
        setIncorrect((c) => c + 1);
      }
    } else {
      // skipped -> count as incorrect in demo
      setIncorrect((c) => c + 1);
    }

    if (simulateRivals) simulateRivals(idx);

    if (idx + 1 < total) {
      setIdx((i) => i + 1);
      setSelected(null);
    } else {
      const durationSec = (Date.now() - startedAt) / 1000;
      setDone(true);
      onComplete({ score, correct, incorrect, durationSec });
    }
  }

  const pct = Math.round((idx / total) * 100);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6">
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/30 via-violet-500/20 to-sky-500/30 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Rocket className="w-5 h-5" /> {pack.title}
          </h3>
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1">
              <Timer className="w-4 h-4" /> {Math.max(0, timeLeft)}s
            </span>
            <span className="inline-flex items-center gap-1">
              <Target className="w-4 h-4" /> {idx + 1}/{total}
            </span>
          </div>
        </div>

        <div className="mt-3 h-2 w-full rounded-full bg-zinc-200/70 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Question */}
        <div className="mt-5">
          <p className="text-base font-medium">{q.q}</p>
          <ul className="mt-3 grid sm:grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              const isPicked = selected === i;
              const isCorrect = done ? i === q.answer : false;
              return (
                <li key={i}>
                  <button
                    onClick={() => setSelected(i)}
                    className={`w-full text-left rounded-2xl px-3 py-3 border transition ${
                      isPicked
                        ? "bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-sky-500/15 border-white/30 dark:border-white/10"
                        : "bg-white/50 dark:bg-zinc-900/50 border-white/30 dark:border-white/10 hover:bg-white/70 dark:hover:bg-zinc-900/70"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : isPicked ? (
                        <Target className="w-4 h-4" />
                      ) : null}
                      {opt}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => handleSubmit(undefined)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60 text-sm"
            >
              Skip
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelected(null);
                  setTimeLeft(pack.timePerQuestionSec);
                }}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60 text-sm"
              >
                <RefreshCcw className="w-4 h-4" /> Reset
              </button>
              <button
                onClick={() => handleSubmit(selected ?? undefined)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white text-sm shadow hover:opacity-90"
              >
                Submit <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Small Components ---------------- */

/* ==================== Question Review Modal ==================== */

type ReviewItem = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  chosenIndex: number | null; // user's pick for that attempt
  distribution: number[]; // percentages for each option (sum ~100)
};

function ReviewModal({
  open,
  items,
  onClose,
}: {
  open: boolean;
  items: ReviewItem[];
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-16 -translate-x-1/2 w-[92vw] max-w-3xl rounded-3xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl p-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Question Review</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 max-h-[70vh] overflow-y-auto space-y-4 pr-1">
          {items.map((it, idx) => (
            <div
              key={it.id}
              className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-4"
            >
              <p className="text-sm font-medium">
                Q{idx + 1}. {it.question}
              </p>

              <ul className="mt-3 space-y-2">
                {it.options.map((opt, i) => {
                  const isCorrect = i === it.correctIndex;
                  const isChosen = i === it.chosenIndex;
                  const pct = Math.max(
                    0,
                    Math.min(100, Math.round(it.distribution[i] ?? 0))
                  );
                  return (
                    <li key={i}>
                      <OptionBar
                        label={opt}
                        percent={pct}
                        isCorrect={isCorrect}
                        isChosen={isChosen}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OptionBar({
  label,
  percent,
  isCorrect,
  isChosen,
}: {
  label: string;
  percent: number; // 0..100
  isCorrect?: boolean;
  isChosen?: boolean;
}) {
  const width = Math.max(4, percent); // keep tiny values visible
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/30 dark:border-white/10">
      {/* fill bar */}
      <div
        className={`absolute inset-y-0 left-0 ${
          isCorrect
            ? "bg-emerald-500/25"
            : "bg-gradient-to-r from-indigo-500/15 via-violet-500/15 to-sky-500/15"
        }`}
        style={{ width: `${width}%` }}
      />
      {/* content */}
      <div className="relative flex items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-2">
          {isCorrect && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          )}
          <span
            className={`text-sm ${
              isCorrect
                ? "text-emerald-700 dark:text-emerald-300 font-medium"
                : ""
            }`}
          >
            {label}
          </span>
          {isChosen && !isCorrect && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Your pick
            </span>
          )}
          {isChosen && isCorrect && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              You
            </span>
          )}
        </div>
        <span className="text-sm font-mono">{percent}%</span>
      </div>
    </div>
  );
}

/* --- helper to synthesize distribution if your attempt lacks it --- */
function synthesizeDistribution(
  optionCount: number,
  correctIndex: number
): number[] {
  // simple plausible distribution: random others, correct gets the remainder (>=30%)
  const arr = new Array(optionCount).fill(0);
  let otherTotal = 0;
  for (let i = 0; i < optionCount; i++) {
    if (i === correctIndex) continue;
    const v = Math.floor(Math.random() * 20) + 5; // 5..24
    arr[i] = v;
    otherTotal += v;
  }
  arr[correctIndex] = Math.max(30, 100 - otherTotal);
  // normalize to exactly 100
  const sum = arr.reduce((a, b) => a + b, 0);
  let scaled = arr.map((v) => Math.floor((v / sum) * 100));
  let diff = 100 - scaled.reduce((a, b) => a + b, 0);
  // distribute remainder
  for (let i = 0; diff > 0; i = (i + 1) % optionCount) {
    scaled[i] += 1;
    diff--;
  }
  return scaled;
}

function Countdown({ seconds }: { seconds: number }) {
  const [s, setS] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setS((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, []);
  return <div className="mt-2 text-3xl font-semibold">{Math.max(0, s)}</div>;
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

function SummaryCard({ attempt }: { attempt: Attempt }) {
  const pct = Math.round((attempt.score / attempt.total) * 100);
  return (
    <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-gradient-to-b from-white/70 to-white/40 dark:from-zinc-900/70 dark:to-zinc-900/40 p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Award className="w-5 h-5" /> Summary
      </h3>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI
          icon={<Trophy className="w-4 h-4" />}
          label="Score"
          value={`${attempt.score} / ${attempt.total}`}
          sub={`${pct}%`}
        />
        <KPI
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Correct"
          value={String(attempt.correct)}
          sub="Well done"
        />
        <KPI
          icon={<XCircle className="w-4 h-4" />}
          label="Wrong"
          value={String(attempt.incorrect)}
          sub="Review later"
        />
        <KPI
          icon={<Timer className="w-4 h-4" />}
          label="Duration"
          value={`${Math.round(attempt.durationSec)}s`}
          sub="Total time"
        />
      </div>
    </div>
  );
}

function Podium({ rivals, youScore }: { rivals: Rival[]; youScore: number }) {
  const all = useMemo(() => {
    const arr = [
      ...rivals,
      {
        id: "you",
        name: "You",
        avatar: "/images/profile2.jpg",
        score: youScore,
        progress: 100,
      },
    ];
    arr.sort((a, b) => b.score - a.score);
    return arr;
  }, [rivals, youScore]);

  return (
    <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Crown className="w-5 h-5" /> Podium
      </h3>
      <ul className="mt-4 space-y-2">
        {all.map((p, i) => (
          <li
            key={p.id}
            className={`flex items-center justify-between gap-3 rounded-2xl border border-white/30 dark:border-white/10 p-3 ${
              i === 0
                ? "bg-gradient-to-tr from-amber-500/15 via-yellow-500/10 to-amber-500/15"
                : "bg-white/50 dark:bg-zinc-900/50"
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white text-xs">
                {i + 1}
              </span>
              <span
                className={`font-medium ${
                  p.id === "you" ? "text-indigo-600 dark:text-indigo-300" : ""
                }`}
              >
                {p.name}
              </span>
            </span>
            <span className="font-semibold">{p.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HeroButton({
  icon,
  children,
  onClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-medium rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90"
    >
      <span className="grid place-items-center w-5 h-5 rounded-md bg-white/20">
        {icon}
      </span>
      {children}
    </button>
  );
}