"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Trophy,
  User,
  ChevronRight,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mocked leaderboard data
const studentsData = [
  {
    id: "1",
    username: "Alice",
    avatar: "",
    rank: 1,
    stack: 95, // progress %
    achievements: ["Top Scorer", "7-day streak"],
  },
  {
    id: "2",
    username: "Bob",
    avatar: "",
    rank: 2,
    stack: 88,
    achievements: ["Fast Learner", "Badge: React Pro"],
  },
  {
    id: "3",
    username: "Charlie",
    avatar: "",
    rank: 3,
    stack: 80,
    achievements: ["Consistent", "Badge: TS Master"],
  },
  // Add more students here
];

export default function Leaderboard() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    return studentsData.filter((s) =>
      s.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const card = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <div className="min-h-screen pt-8 pb-16 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <section className="max-w-7xl sm:pt-16 mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-500" /> Leaderboard
        </h2>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full p-3 rounded-xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl text-sm outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Leaderboard Table */}
        <motion.ul
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {filteredStudents.map((student, i) => (
            <motion.li
              key={student.id}
              variants={card}
              className="group flex items-center justify-between rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-4 hover:bg-white/70 dark:hover:bg-zinc-900/70 cursor-pointer transition"
              onClick={() => router.push(`/profile/${student.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white text-lg font-bold shadow">
                  {student.username[0]}
                </div>
                <div>
                  <p className="font-medium">{student.username}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      {student.stack}%
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full text-[10px] font-medium">
                      Rank #{student.rank}
                    </span>
                  </div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {student.achievements.map((ach, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-500/20 text-zinc-800 dark:text-zinc-100"
                      >
                        {ach}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition" />
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </div>
  );
}
