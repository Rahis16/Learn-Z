"use client";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  MessageCircle,
  ThumbsUp,
  Share2,
  UserPlus,
  Search,
  Sparkles,
  Award,
  Rocket,
  ShieldCheck,
  Crown,
  Plus,
  Bookmark,
  MoreHorizontal,
  Tag,
  Clock,
} from "lucide-react";

/*
  Learn‑Z Community Page
  - Matches the glass/gradient UI vibe from your dashboard snippet
  - Students can: Post achievements / Ask questions, Like, Comment, Share
  - "Find Buddy" search + Friend Request
  - Create a Dream Team + Join teams
  - All interactions are mocked client‑side. Wire the TODOs to your backend.

  Drop this file as: app/community/page.tsx (App Router)
*/

// ---- Types ----
type User = {
  id: string;
  name: string;
  avatar: string; // path or URL
  title?: string;
  badges?: string[]; // e.g., ["Top 1%", "Helper"]
  skills?: string[];
};

type Comment = {
  id: string;
  user: User;
  content: string;
  createdAt: string; // ISO or pretty
};

type Post = {
  id: string;
  type: "achievement" | "question";
  author: User;
  title?: string; // used for questions
  content: string;
  media?: string[];
  likes: number;
  liked: boolean;
  comments: Comment[];
  tags?: string[];
  createdAt: string;
};

type Team = {
  id: string;
  name: string;
  purpose: string;
  members: number;
  openRoles: string[];
  tags: string[];
  isMember?: boolean;
};

// ---- Mock Data ----
const me: User = {
  id: "u_me",
  name: "You",
  avatar: "/images/profile2.jpg",
  title: "Student",
  badges: ["Helper", "Top 10%"],
  skills: ["React", "Next.js", "DSA"],
};

const mockUsers: User[] = [
  {
    id: "u_1",
    name: "Aarav Shrestha",
    avatar: "/images/u1.jpg",
    title: "Frontend Dev",
    badges: ["Top 1%", "Streak x21"],
    skills: ["React", "Tailwind", "UI/UX"],
  },
  {
    id: "u_2",
    name: "Prisha Karki",
    avatar: "/images/u2.jpg",
    title: "Data Wiz",
    badges: ["Helper"],
    skills: ["Python", "Pandas", "Stats"],
  },
  {
    id: "u_3",
    name: "Nabin Rai",
    avatar: "/images/u3.jpg",
    title: "Algo Explorer",
    badges: ["Top 10%"],
    skills: ["C++", "Graphs", "DP"],
  },
];

const initialPosts: Post[] = [
  {
    id: "p_1",
    type: "achievement",
    author: mockUsers[0],
    content:
      "Built a fully responsive dashboard with Next.js App Router + Framer Motion. Any suggestions to improve animation performance?",
    media: [],
    likes: 42,
    liked: false,
    comments: [
      {
        id: "c_1",
        user: mockUsers[1],
        content: "Try reducing layout thrash by grouping motions. Looks dope!",
        createdAt: "2h ago",
      },
    ],
    tags: ["nextjs", "ui", "performance"],
    createdAt: "3h ago",
  },
  {
    id: "p_2",
    type: "question",
    title: "How do I optimize Prisma queries on server actions?",
    author: mockUsers[2],
    content:
      "I am batching writes but still seeing long TTFB. Any real‑world patterns?",
    likes: 18,
    liked: false,
    comments: [],
    tags: ["prisma", "db", "server-actions"],
    createdAt: "5h ago",
  },
];

const initialTeams: Team[] = [
  {
    id: "t_1",
    name: "Dream Team: Frontend Titans",
    purpose: "Ship a polished component library for Learn‑Z community",
    members: 5,
    openRoles: ["Accessibility", "Docs"],
    tags: ["react", "design", "components"],
  },
  {
    id: "t_2",
    name: "Algo Avengers",
    purpose: "Daily DSA drills + weekly mock interviews",
    members: 12,
    openRoles: ["Coach", "Reviewer"],
    tags: ["cpp", "dsa", "interview"],
  },
];

export default function CommunityPage() {
  const router = useRouter();

  // State
  const [tab, setTab] = useState<"feed" | "questions" | "achievements">(
    "feed"
  );
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [buddies, setBuddies] = useState<User[]>(mockUsers);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [searchBuddy, setSearchBuddy] = useState("");

  const filteredBuddies = useMemo(() => {
    const q = searchBuddy.trim().toLowerCase();
    if (!q) return buddies;
    return buddies.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.skills || []).some((s) => s.toLowerCase().includes(q))
    );
  }, [searchBuddy, buddies]);

  const card = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  } as const;

  // ---- Handlers (mocked) ----
  function onToggleLike(id: string) {
    setPosts((ps) =>
      ps.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }

  function onAddComment(id: string, text: string) {
    if (!text.trim()) return;
    setPosts((ps) =>
      ps.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `c_${Date.now()}`,
                  user: me,
                  content: text,
                  createdAt: "now",
                },
              ],
            }
          : p
      )
    );
  }

  async function onShare(post: Post) {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/community?post=${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied ✨");
    } catch {
      alert("Could not copy link, sorry!");
    }
  }

  function onSendFriendRequest(u: User) {
    // TODO: call your API here
    alert(`Friend request sent to ${u.name}`);
  }

  function onCreateTeam(name: string, purpose: string, tags: string[]) {
    if (!name.trim()) return;
    const team: Team = {
      id: `t_${Date.now()}`,
      name,
      purpose,
      members: 1,
      openRoles: [],
      tags,
      isMember: true,
    };
    setTeams((ts) => [team, ...ts]);
  }

  function onJoinTeam(teamId: string) {
    setTeams((ts) =>
      ts.map((t) => (t.id === teamId ? { ...t, isMember: true, members: t.members + 1 } : t))
    );
  }

  function onCreatePost(newPost: Omit<Post, "id" | "likes" | "liked" | "comments" | "createdAt">) {
    const post: Post = {
      id: `p_${Date.now()}`,
      likes: 0,
      liked: false,
      comments: [],
      createdAt: "just now",
      ...newPost,
    };
    setPosts((ps) => [post, ...ps]);
  }

  const feed = useMemo(() => {
    if (tab === "feed") return posts;
    return posts.filter((p) => (tab === "questions" ? p.type === "question" : p.type === "achievement"));
  }, [tab, posts]);

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
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Learn‑Z Community</p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
                  Share wins, ask smart, build your <span className="bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">dream team</span>
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-2xl">
                  Post achievements, ask questions, and collaborate with peers. Find a study buddy or form a team for your next project.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <HeroButton icon={<Sparkles className="w-4 h-4" />} onClick={() => document.getElementById("composer")?.scrollIntoView({ behavior: "smooth" })}>
                  Create Post
                </HeroButton>
                <HeroButton icon={<MessageCircle className="w-4 h-4" />} onClick={() => setTab("questions")}>Ask Question</HeroButton>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 inline-flex items-center gap-1 rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-1">
              {([
                { k: "feed", label: "All" },
                { k: "achievements", label: "Achievements" },
                { k: "questions", label: "Questions" },
              ] as { k: typeof tab; label: string }[]).map((t) => (
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

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid gap-6 lg:grid-cols-3">
        {/* Feed */}
        <section className="lg:col-span-2 space-y-6">
          {/* Composer */}
          <motion.div variants={card} initial="hidden" animate="show" id="composer">
            <Composer onCreate={onCreatePost} />
          </motion.div>

          {/* Posts */}
          <AnimatePresence initial={false}>
            {feed.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <PostCard post={p} onLike={() => onToggleLike(p.id)} onComment={(txt) => onAddComment(p.id, txt)} onShare={() => onShare(p)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Find Buddy */}
          <motion.section
            variants={card}
            initial="hidden"
            animate="show"
            className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" /> Find Buddy
            </h3>
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10">
              <Search className="w-4 h-4 text-zinc-400" />
              <input
                value={searchBuddy}
                onChange={(e) => setSearchBuddy(e.target.value)}
                placeholder="Search students or skills (e.g., React, DSA)"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
            <ul className="mt-4 space-y-3">
              {filteredBuddies.map((b) => (
                <li
                  key={b.id}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={b.avatar} alt={b.name} className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow" />
                    <div>
                      <p className="font-medium leading-tight">{b.name}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                        {b.title}
                        {(b.badges || []).slice(0, 1).map((bdg) => (
                          <span
                            key={bdg}
                            className="px-1.5 py-0.5 rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-sky-500/15 border border-white/20 dark:border-white/10"
                          >
                            {bdg}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSendFriendRequest(b)}
                      className="inline-flex items-center gap-1 text-xs font-medium rounded-xl px-3 py-1.5 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90"
                    >
                      <UserPlus className="w-3 h-3" /> Add
                    </button>
                    <Link
                      href={`/profile/${b.id}`}
                      className="text-xs rounded-xl px-3 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60"
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Dream Team */}
          <motion.section
            variants={card}
            initial="hidden"
            animate="show"
            className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Rocket className="w-5 h-5" /> Dream Team
            </h3>
            <TeamCreator onCreate={onCreateTeam} />
            <div className="mt-4 space-y-3">
              {teams.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold flex items-center gap-2">
                        {t.name}
                        {t.isMember && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" /> Member
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">{t.purpose}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {t.tags.map((tg) => (
                          <span key={tg} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-sky-500/15 border border-white/20 dark:border-white/10">
                            <Tag className="w-3 h-3" /> {tg}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                        <Users className="w-3 h-3" /> {t.members} members
                        {t.openRoles.length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            • <Crown className="w-3 h-3" /> Open: {t.openRoles.join(", ")}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/team/${t.id}`} className="text-xs rounded-xl px-3 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">
                        View
                      </Link>
                      {!t.isMember && (
                        <button
                          onClick={() => onJoinTeam(t.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium rounded-xl px-3 py-1.5 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </aside>
      </main>
    </div>
  );
}

/* ---------------- Components ---------------- */
function HeroButton({ icon, children, onClick }: { icon: React.ReactNode; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-medium rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90"
    >
      <span className="grid place-items-center w-5 h-5 rounded-md bg-white/20">{icon}</span>
      {children}
    </button>
  );
}

function Composer({ onCreate }: { onCreate: (p: Omit<Post, "id" | "likes" | "liked" | "comments" | "createdAt">) => void }) {
  const [mode, setMode] = useState<Post["type"]>("achievement");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string>("");

  function submit() {
    if (!content.trim() && !title.trim()) return;
    onCreate({
      type: mode,
      author: me,
      title: mode === "question" ? title.trim() : undefined,
      content: content.trim(),
      media: [],
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setTitle("");
    setContent("");
    setTags("");
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-5">
      <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-gradient-to-tr from-fuchsia-500/40 via-rose-500/30 to-amber-500/40 blur-2xl" />
      <div className="relative">
        {/* Toggle */}
        <div className="flex items-center gap-1 rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-1 w-fit">
          {([
            { k: "achievement", label: "Share Achievement", icon: <Award className="w-4 h-4" /> },
            { k: "question", label: "Ask Question", icon: <MessageCircle className="w-4 h-4" /> },
          ] as { k: Post["type"]; label: string; icon: React.ReactNode }[]).map((t) => (
            <button
              key={t.k}
              onClick={() => setMode(t.k)}
              className={`px-3 py-1.5 rounded-xl text-sm inline-flex items-center gap-1 transition ${
                mode === t.k
                  ? "bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow"
                  : "hover:bg-white/70 dark:hover:bg-zinc-900/70"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="mt-4 grid gap-3">
          {mode === "question" && (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Question title (e.g., How to optimize Prisma queries?)"
              className="w-full rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/30 dark:border-white/10 outline-none"
            />
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={mode === "question" ? "Describe your problem, share context/code…" : "Share your win, what you built/learned…"}
            className="min-h-[96px] w-full rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/30 dark:border-white/10 outline-none"
          />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma‑separated): nextjs, dsa, prisma"
            className="w-full rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/30 dark:border-white/10 outline-none"
          />
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Plus className="w-4 h-4" /> Attachments (coming soon)
            </div>
            <button onClick={submit} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white text-sm shadow hover:opacity-90">
              <Sparkles className="w-4 h-4" /> Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, onLike, onComment, onShare }: { post: Post; onLike: () => void; onComment: (text: string) => void; onShare: () => void }) {
  const [comment, setComment] = useState("");
  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-5">
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/30 via-violet-500/20 to-sky-500/30 blur-3xl" />
      <div className="relative">
        {/* Header */}
        <div className="flex items-start gap-3">
          <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/profile/${post.author.id}`} className="font-semibold hover:underline">
                {post.author.name}
              </Link>
              {(post.author.badges || []).slice(0, 1).map((bdg) => (
                <span key={bdg} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-sky-500/15 border border-white/20 dark:border-white/10">
                  <Crown className="w-3 h-3" /> {bdg}
                </span>
              ))}
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {post.createdAt}</span>
            </div>
            {post.type === "question" && post.title && (
              <h4 className="text-base font-semibold mt-1">{post.title}</h4>
            )}
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line">{post.content}</p>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {post.tags.map((tg) => (
                  <span key={tg} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-sky-500/15 border border-white/20 dark:border-white/10">
                    <Tag className="w-3 h-3" /> {tg}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button className="p-2 rounded-xl border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Media (optional) */}
        {post.media && post.media.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {post.media.map((src) => (
              <Image key={src} src={src} alt="media" width={640} height={360} className="rounded-xl border border-white/20" />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onLike}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 border border-white/20 dark:border-white/10 transition ${
              post.liked ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "hover:bg-white/60 dark:hover:bg-zinc-900/60"
            }`}
            aria-label="Like"
          >
            <ThumbsUp className="w-4 h-4" /> {post.likes}
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60" aria-label="Comment" onClick={() => {
            const el = document.getElementById(`c_${post.id}`);
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}>
            <MessageCircle className="w-4 h-4" /> {post.comments.length}
          </button>
          <button onClick={onShare} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60" aria-label="Share">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-zinc-900/60" aria-label="Save">
            <Bookmark className="w-4 h-4" /> Save
          </button>
        </div>

        {/* Comments */}
        <div id={`c_${post.id}`} className="mt-4 space-y-3">
          {post.comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <img src={c.user.avatar} alt={c.user.name} className="w-8 h-8 rounded-lg object-cover border border-white/20" />
              <div className="flex-1">
                <p className="text-sm"><span className="font-medium">{c.user.name}</span> <span className="text-zinc-500 dark:text-zinc-400">• {c.createdAt}</span></p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{c.content}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <img src={me.avatar} alt="me" className="w-8 h-8 rounded-lg object-cover border border-white/20" />
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment…"
              className="flex-1 rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/30 dark:border-white/10 outline-none text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onComment(comment);
                  setComment("");
                }
              }}
            />
            <button onClick={() => { onComment(comment); setComment(""); }} className="text-xs rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90">
              Post
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function TeamCreator({ onCreate }: { onCreate: (name: string, purpose: string, tags: string[]) => void }) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tags, setTags] = useState("");
  return (
    <div className="mt-3 rounded-2xl border border-white/30 dark:border-white/10 p-4 bg-white/60 dark:bg-zinc-900/50">
      <div className="grid gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team name (e.g., Frontend Titans)"
          className="w-full rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/30 dark:border-white/10 outline-none text-sm"
        />
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Purpose (what will you build/learn?)"
          className="min-h-[72px] w-full rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/30 dark:border-white/10 outline-none text-sm"
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma‑separated): react, dsa, docs"
          className="w-full rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/30 dark:border-white/10 outline-none text-sm"
        />
      </div>
      <div className="mt-3 flex items-center justify-end">
        <button
          onClick={() => {
            onCreate(
              name.trim(),
              purpose.trim(),
              tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            );
            setName("");
            setPurpose("");
            setTags("");
          }}
          className="inline-flex items-center gap-2 text-xs rounded-xl px-3 py-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Create Team
        </button>
      </div>
    </div>
  );
}