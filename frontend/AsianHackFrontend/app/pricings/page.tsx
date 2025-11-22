"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Crown,
  Rocket,
  Shield,
  CreditCard,
  ChevronRight,
  Info,
  BookOpen,
  MessagesSquare,
  FolderOpen,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Plan = {
  id: "free" | "starter" | "pro" | "eager";
  name: string;
  price: number; // Rs
  dailyTokens: number;
  monthlyTokens: number;
  courses: string; // "100 free video courses", "Unlimited", etc.
  contextsDocs: string; // "with contexts and docs", "Unlimited", etc.
  highlight?: boolean;
  badge?: string;
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    dailyTokens: 5_000,
    monthlyTokens: 1_50_000,
    courses: "5 free video courses",
    contextsDocs: "Docs included",
  },
  {
    id: "starter",
    name: "Starter",
    price: 499,
    dailyTokens: 100_000,
    monthlyTokens: 3_000_000,
    courses: "100 free video courses",
    contextsDocs: "Contexts & docs included",
  },
  {
    id: "pro",
    name: "Pro",
    price: 999,
    dailyTokens: 200_000,
    monthlyTokens: 6_000_000,
    courses: "200 free video courses",
    contextsDocs: "Contexts & docs included",
    highlight: true,
    badge: "Most Popular",
  },
  {
    id: "eager",
    name: "Eager to Learn",
    price: 1599,
    dailyTokens: 500_000,
    monthlyTokens: 15_000_000,
    courses: "Unlimited video courses",
    contextsDocs: "Unlimited contexts & docs",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Plan["id"]>("pro");

  const card = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  const onPurchase = (plan: Plan) => {
    // TODO: hook into your checkout
    router.push(`/checkout?plan=${plan.id}`);
  };

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="min-h-screen pb-16 bg-white/40 backdrop-blur-2xl text-slate-900">
      {/* Top / Hero */}
      {/* <div className="mx-auto max-w-7xl px-4 pt-10 mb-16">
        <div className="rounded-3xl flex justify-between px-8 py-4 md:py-6 bg-white/40 backdrop-blur-2xl ring-1 ring-white/50 shadow-[0_20px_120px_rgba(168,85,247,0.35)]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40 ring-1 ring-white/60 shadow-[0_8px_30px_rgba(99,102,241,0.35)]" />
            <span className="font-semibold tracking-tight">Learn-Z Pricing</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/classroom"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 shadow-[0_10px_36px_rgba(99,102,241,0.45)] hover:opacity-95"
            >
              <MessagesSquare className="h-4 w-4" />
              Open Classroom
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-indigo-700 bg-white/70 ring-1 ring-white/60 hover:bg-white"
            >
              <FolderOpen className="h-4 w-4" />
              Dashboard
            </Link>
          </div>
        </div>
      </div> */}

      {/* Intro */}
      <section className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 backdrop-blur-2xl p-6 shadow-[0_20px_120px_rgba(99,102,241,0.18)]">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/40 via-violet-500/30 to-sky-500/40 blur-3xl" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Choose a plan,{" "}
                <span className="bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
                  learn faster
                </span>
                .
              </h1>
              <p className="mt-2 text-slate-700 max-w-2xl">
                All plans include **AI chat** access. Token credits reset daily & monthly. Manage courses with
                contexts and docs in your classroom.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="text-sm text-slate-700">Secure payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isHot = !!plan.highlight;
            return (
              <motion.div
                key={plan.id}
                variants={card}
                initial="hidden"
                animate="show"
                className={`relative overflow-hidden rounded-3xl border ring-1 p-6 backdrop-blur-2xl transition
                  ${isHot
                    ? "border-white/60 ring-white/60 bg-white/70 shadow-[0_20px_120px_rgba(168,85,247,0.25)]"
                    : "border-white/50 ring-white/50 bg-white/60 shadow-[0_14px_80px_rgba(0,0,0,0.06)]"
                  } ${isHot ? "scale-103" : ""}`}
              >
                {plan.badge && (
                  <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-500/20 border border-white/40">
                    {plan.badge}
                  </span>
                )}

                <div className={`flex ${plan.badge === "Most Popular" ? "mt-2" : ""} items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    {plan.id === "free" && <BadgeCheck className="h-5 w-5 text-indigo-600" />}
                    {plan.id === "starter" && <Sparkles className="h-5 w-5 text-indigo-600" />}
                    {plan.id === "pro" && <Crown className="h-5 w-5 text-amber-500" />}
                    {plan.id === "eager" && <Rocket className="h-5 w-5 text-violet-600" />}
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">Rs. {plan.price}</div>
                    <div className="text-xs text-slate-600">per month</div>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-slate-800">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <span>
                      <strong>{fmt(plan.dailyTokens)}</strong> tokens/credits per day
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <span>
                      <strong>{fmt(plan.monthlyTokens)}</strong> tokens/credits per month
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <span>{plan.courses}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <span>{plan.contextsDocs}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <span>Chat with AI every day (daily limit applies)</span>
                  </li>
                </ul>

                {/* Mini circular stats */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MiniCircleStat label="Daily Tokens" value={plan.dailyTokens} />
                  <MiniCircleStat
                    label="Monthly Tokens"
                    value={plan.monthlyTokens}
                    max={plan.id === "eager" ? plan.monthlyTokens : plan.monthlyTokens}
                  />
                </div>

                <button
                  onClick={() => {
                    setSelected(plan.id);
                    onPurchase(plan);
                  }}
                  className={`mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold shadow
                    ${isHot
                      ? "text-white bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 hover:opacity-95"
                      : "text-indigo-700 bg-white/80 ring-1 ring-white/60 hover:bg-white"
                    }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Purchase {plan.name}
                  <ChevronRight className="h-4 w-4" />
                </button>

                <p className="mt-2 text-[11px] text-slate-600 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  Taxes may apply
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_20px_120px_rgba(99,102,241,0.18)]">
          <div className="px-6 py-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Plan Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-white/60">
                  <th className="px-6 py-3">Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.id} className="px-6 py-3">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/60">
                <TR label="Monthly Price">
                  {PLANS.map((p) => <TD key={p.id}>Rs. {p.price}</TD>)}
                </TR>
                <TR label="Daily Tokens">
                  {PLANS.map((p) => <TD key={p.id}>{fmt(p.dailyTokens)}</TD>)}
                </TR>
                <TR label="Monthly Tokens">
                  {PLANS.map((p) => <TD key={p.id}>{fmt(p.monthlyTokens)}</TD>)}
                </TR>
                <TR label="Video Courses">
                  {PLANS.map((p) => <TD key={p.id}>{p.courses}</TD>)}
                </TR>
                <TR label="Contexts & Docs">
                  {PLANS.map((p) => <TD key={p.id}>{p.contextsDocs}</TD>)}
                </TR>
                <TR label="AI Chat Access">
                  {PLANS.map((p) => (
                    <TD key={p.id} icon>
                      <Check className="h-4 w-4 text-emerald-600" />
                    </TD>
                  ))}
                </TR>
                <TR label="Best For">
                  <TD>Getting started</TD>
                  <TD>Regular learners</TD>
                  <TD>Power learners</TD>
                </TR>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Summary Docs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-2xl p-6 shadow-[0_20px_120px_rgba(99,102,241,0.18)]">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Summary
            </h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-2">
              <li>Daily & monthly tokens auto-reset; unused tokens don’t roll over.</li>
              <li>Starter: 100k/day, 3M/month, 100 courses with contexts & docs.</li>
              <li>Pro: 200k/day, 6M/month, 200 courses with contexts & docs.</li>
              <li>Eager to Learn: 500k/day, 15M/month, unlimited everything.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-2xl p-6 shadow-[0_20px_120px_rgba(99,102,241,0.18)]">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing & Support
            </h3>
            <p className="mt-3 text-sm text-slate-700">
              You can upgrade/downgrade anytime. Pro-rated refunds apply on downgrades. Need help choosing?{" "}
              <Link href="/classroom" className="text-indigo-600 underline">Ask AI</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */

function MiniCircleStat({
  label,
  value,
  max,
  size = 76,
  stroke = 8,
}: {
  label: string;
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
}) {
  const denom = max ?? value || 1;
  const percent = Math.max(0, Math.min(100, (value / denom) * 100));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;

  return (
    <div className="flex items-center gap-3">
      <div className="relative grid place-items-center">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="currentColor"
            className="text-zinc-200/70"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="url(#gradMini)"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradMini" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <div className="text-xs font-semibold">{Math.round(percent)}%</div>
        </div>
      </div>
      <div className="leading-tight">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm font-semibold">{value.toLocaleString()}</div>
      </div>
    </div>
  );
}

function TR({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="align-top">
      <th className="px-6 py-3 text-left w-48 text-slate-700">{label}</th>
      {children}
    </tr>
  );
}
function TD({ children, icon = false }: { children: React.ReactNode; icon?: boolean }) {
  return (
    <td className={`px-6 py-3 ${icon ? "w-28" : ""}`}>
      <div className="inline-flex items-center gap-2">{children}</div>
    </td>
  );
}