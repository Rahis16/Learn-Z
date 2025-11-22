"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
// import { getAuthStatus, logout, UserAuthStatus } from '@/utils/auth';
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IoWalletOutline } from "react-icons/io5";
// import ThemeToggle from "./ThemeToggle";

import {
  HiHome,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiOutlineBell,
  HiOutlineUserCircle,
  HiX,
  HiOutlineCog,
  HiOutlineLogin,
  HiOutlineUserAdd,
  HiOutlineMenu,
  HiOutlineHome,
  HiOutlineLogout,
  HiOutlineShieldCheck, // Optional for admin panel icon
} from "react-icons/hi";
import {
  Users,
  BrainCircuit,
  PlaySquare,
  Crown,
  Trophy,
  Bell,
  CalendarDays,
  Handshake,
  LayoutDashboard,
  School,
  Youtube,
} from "lucide-react";
import Logo from "./LogoSwitcher";

import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/", icon: HiHome },
  { name: "Menu", href: "/menu", icon: HiOutlineShoppingBag },
  { name: "Wallet", href: "/wallet", icon: IoWalletOutline },
  { name: "Notifications", href: "/notifications", icon: HiOutlineBell },
  { name: "Cart", href: "/cart", icon: HiOutlineShoppingCart },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [user, setUser] = useState<UserAuthStatus | null>(null);
  const { user, logout } = useAuth();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const authData = await getAuthStatus();
  //     setUser(authData);
  //   };
  //   fetchUser();
  // }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    await logout();
    setIsSidebarOpen(false);
    window.location.href = "/login";
  };
  const router = useRouter();

  return (
    <>
      {/* Top Nav */}
      <header className="py-4 sticky top-0 z-40 backdrop-blur-xl bg-white/40 dark:bg-zinc-950/40 border-b border-white/20 dark:border-white/10 shadow-[0_20px_120px_rgba(99,102,241,0.35)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">
          <Image
            onClick={() => router.push("/")}
            src="/icons/logo12.png"
            alt="Learn-Z"
            width={130}
            height={130}
            className="cursor-pointer"
          />

          {/* Primary Nav (replaces Search) */}
          <div className="flex-1 hidden md:flex">
            <nav
              aria-label="Primary"
              className="w-full rounded-2xl justify-around bg-white/60 dark:bg-zinc-900/60 border border-white/30 dark:border-white/10 shadow-sm px-1 py-1 flex items-center gap-1"
            >
              <button
                onClick={() => router.push("/leaderboard")}
                className="group cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/80 dark:hover:bg-zinc-900/80 transition"
                title="Leaderboard"
              >
                <Users className="w-4 h-4 text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200" />
                <span className="text-sm">Leaderboard</span>
              </button>

              <button
                onClick={() => router.push("/classroom")}
                className="group cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/80 dark:hover:bg-zinc-900/80 transition"
                title="AI Classroom"
              >
                <BrainCircuit className="w-4 h-4 text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200" />
                <span className="text-sm">AI Classroom</span>
              </button>

              <button
                onClick={() => router.push("/freecourses")}
                className="group cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/80 dark:hover:bg-zinc-900/80 transition"
                title="LearnTube"
              >
                <PlaySquare className="w-4 h-4 text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200" />
                <span className="text-sm">LearnTube</span>
              </button>

              <button
                onClick={() => router.push("/premiumcourses")}
                className="group cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/80 dark:hover:bg-zinc-900/80 transition"
                title="Premium Courses"
              >
                <Crown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200" />
                <span className="text-sm">Premium Courses</span>
              </button>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 ml-auto">
            {/* Quiz (replaces Quick Actions) */}
            <button
              onClick={() => router.push("/quiz")}
              className="hidden cursor-pointer md:inline-flex items-center gap-1 rounded-xl px-3 py-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
              aria-label="Open Quiz"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Quiz</span>
            </button>

            <button
              onClick={() => {
                router.push("/notification");
              }}
              className="relative rounded-xl cursor-pointer p-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-fuchsia-500 shadow-[0_0_0_2px_rgba(255,255,255,0.75)] dark:shadow-[0_0_0_2px_rgba(24,24,27,1)]" />
            </button>

            {user ? (
              <button
                className="cursor-pointer flex items-center gap-2 rounded-2xl pl-2 pr-4 py-1 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
                aria-label="Open profile"
                onClick={toggleSidebar}
              >
                <img
                  src={
                    user.photo
                      ? `${BASE_URL}/${user.photo}`
                      : "/images/profile2.jpg"
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-xl object-cover cursor-pointer shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg border-2 border-white"
                />
                <div className="text-left leading-tight">
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                    Student
                  </span>
                  <span className="block text-sm font-medium">
                    {user?.username}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={toggleSidebar}
                className="flex items-center gap-2 rounded-2xl pl-1 pr-3 py-1 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
                aria-label="Open profile"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-500" />
                  <span className="absolute -bottom-1 -right-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                    U
                  </span>
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                    Student
                  </span>
                  <span className="block text-sm font-medium">user</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-55 md:w-60 lg:w-64 backdrop-blur-xl bg-white/40 dark:bg-zinc-950/40 border-l border-white/20 dark:border-white/10 shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-white/20 dark:border-white/10">
          <Image
            onClick={() => router.push("/")}
            src="/icons/logo12.png"
            alt="Learn-Z"
            width={130}
            height={130}
          />
          <button
            onClick={toggleSidebar}
            className="rounded-xl p-2 bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm text-gray-600 hover:text-red-500"
          >
            <HiX className="text-lg" />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 overflow-y-auto h-full pb-44 space-y-2">
          <Link
            href="/dashboard"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/dashboard"
                  ? "bg-indigo-500 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-indigo-600 hover:scale-110"
              )}
            >
              <LayoutDashboard className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/dashboard"
                  ? "text-indigo-500"
                  : "text-gray-700 hover:text-indigo-600"
              )}
            >
              Dashboard
            </span>
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/profile"
                  ? "bg-indigo-500 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-indigo-600 hover:scale-110"
              )}
            >
              <HiOutlineUserCircle className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/profile"
                  ? "text-indigo-500"
                  : "text-gray-700 hover:text-indigo-500"
              )}
            >
              My Profile
            </span>
          </Link>

          <Link
            href="/events"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/events"
                  ? "bg-indigo-500 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-indigo-600 hover:scale-110"
              )}
            >
              <CalendarDays className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/events"
                  ? "text-indigo-500"
                  : "text-gray-700 hover:text-indigo-600"
              )}
            >
              Events
            </span>
          </Link>

          <Link
            href="/community"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/Community"
                  ? "bg-indigo-500 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-indigo-600 hover:scale-110"
              )}
            >
              <Handshake className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/Community"
                  ? "text-indigo-500"
                  : "text-gray-700 hover:text-indigo-600"
              )}
            >
              Community
            </span>
          </Link>

          <Link
            href="/classroom"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/classroom"
                  ? "bg-indigo-500 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-indigo-600 hover:scale-110"
              )}
            >
              <School className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/classroom"
                  ? "text-indigo-500"
                  : "text-gray-700 hover:text-indigo-600"
              )}
            >
              ClassRoom
            </span>
          </Link>

          <Link
            href="/freecourses"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/freecourses"
                  ? "bg-indigo-500 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-indigo-500 hover:scale-110"
              )}
            >
              <Youtube className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/freecourses"
                  ? "text-indigo-500"
                  : "text-gray-700 hover:text-indigo-500"
              )}
            >
              LearnTube
            </span>
          </Link>
          <Link
            href="/premiumcourses"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/premiumcourses"
                  ? "bg-indigo-500 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-indigo-600 hover:scale-110"
              )}
            >
              <Crown className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/premiumcourses"
                  ? "text-indigo-500"
                  : "text-gray-700 hover:text-indigo-600"
              )}
            >
              Premium Courses
            </span>
          </Link>

          {/* Settings */}
          <Link
            href="/settings"
            onClick={toggleSidebar}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-zinc-900/80 transition shadow-sm"
          >
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200",
                pathname === "/settings"
                  ? "bg-indigo-500 text-white scale-105 shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-indigo-500 hover:scale-110"
              )}
            >
              <HiOutlineCog className="text-xl" />
            </div>
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === "/settings"
                  ? "text-indigo-500"
                  : "text-gray-700 hover:text-indigo-500"
              )}
            >
              Settings
            </span>
          </Link>

          {/* Role-specific Links */}
          {user?.is_superuser && (
            <Link
              href="/admin"
              onClick={toggleSidebar}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
            >
              <HiOutlineShieldCheck className="text-xl" />
              <span>Admin Panel</span>
            </Link>
          )}

          {user?.is_staff && !user.is_superuser && (
            <Link
              href="/staff/tools"
              onClick={toggleSidebar}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-purple-100 text-purple-800 hover:bg-purple-200 transition"
            >
              <HiOutlineShieldCheck className="text-xl" />
              <span>Staff Tools</span>
            </Link>
          )}

          <hr className="my-3 border-white/20 dark:border-white/10" />

          {/* Auth */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition shadow-sm"
            >
              <HiOutlineLogout className="text-xl" />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={toggleSidebar}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition shadow-sm"
              >
                <HiOutlineLogin className="text-xl" />
                <span>Login</span>
              </Link>
              <Link
                href="/signup"
                onClick={toggleSidebar}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition shadow-sm"
              >
                <HiOutlineUserAdd className="text-xl" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40" onClick={toggleSidebar} />
      )}
    </>
  );
}