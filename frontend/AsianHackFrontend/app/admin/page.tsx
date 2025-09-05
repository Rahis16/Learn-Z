"use client";

import React, { JSX, useEffect, useState } from "react";
import {
  Home,
  BookOpen,
  Users,
  Settings,
  BarChart2,
  LogOut,
  GraduationCap,
  Trophy,
  Brain,
  FileText,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Dashboard from "@/adminComponents/Dashboard";
import Course from "@/adminComponents/Course";
import StudentProgress from "@/adminComponents/StudentProgress";
import AdminInstructorsPage from "@/adminComponents/InstructorContent";
import AdminAnalyticsPage from "@/adminComponents/Analytics";
import { FcFeedback } from "react-icons/fc";
import AchievementsPage from "@/adminComponents/Achievements";
import FeedbackPage from "@/adminComponents/Feedback";

// Media Query Hook
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

// Utility function for class names
function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

type NavItem = {
  label: string;
  icon: JSX.Element;
  key: string;
  badge?: number;
};

export default function AdminPage() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <Home size={18} />,
      key: "dashboard",
    },
    {
      label: "Courses",
      icon: <BookOpen size={18} />,
      key: "courses",
      badge: 12,
    },
    {
      label: "Students",
      icon: <GraduationCap size={18} />,
      key: "students",
      badge: 248,
    },
    {
      label: "Instructors",
      icon: <Brain size={18} />,
      key: "instructors",
      badge: 15,
    },
    {
      label: "Analytics",
      icon: <BarChart2 size={18} />,
      key: "analytics",
    },
    {
      label: "Achievements",
      icon: <Trophy size={18} />,
      key: "achievements",
    },
    {
      label: "Feedback",
      icon: <FcFeedback size={18} />,
      key: "feedback",
      badge: 7,
    },
    {
      label: "Reports",
      icon: <FileText size={18} />,
      key: "reports",
    },
    {
      label: "Settings",
      icon: <Settings size={18} />,
      key: "settings",
    },
  ];
  
    // Get the active nav item
  const activeNavItem = navItems.find((item) => item.key === activePage);

  const handleTouchStart = (e: TouchEvent) =>
    setTouchStartX(e.touches[0].clientX);
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (!isMobile) return;
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX < 50 && touchEndX - touchStartX > 100) setSidebarOpen(true);
    else if (touchStartX > 100 && touchStartX - touchEndX > 100)
      setSidebarOpen(false);
  };

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const handleTouchStartBound = (e: TouchEvent) => handleTouchStart(e);
    const handleTouchEndBound = (e: TouchEvent) => handleTouchEnd(e);
    
    window.addEventListener("touchstart", handleTouchStartBound);
    window.addEventListener("touchend", handleTouchEndBound);
    return () => {
      window.removeEventListener("touchstart", handleTouchStartBound);
      window.removeEventListener("touchend", handleTouchEndBound);
    };
  }, [touchStartX, isMobile]);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "courses":
        return <Course />;
      case "students":
        return <StudentProgress />;
      case "instructors":
        return <AdminInstructorsPage />;
      case "analytics":
        return <AdminAnalyticsPage />;
      case "achievements":
        return <AchievementsPage />;
      case "feedback":
        return <FeedbackPage />;
      default:
        return (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-8">
            <h2 className="text-3xl font-bold bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent mb-4">
              {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
            </h2>
            <p className="text-zinc-600">Content for {activePage} coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-3 bg-white/80 backdrop-blur-xl rounded-xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Floating Toggle Button for Desktop */}
      {!isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`fixed top-1/2 -translate-y-1/2 z-40 bg-white/80 backdrop-blur-xl shadow-xl rounded-r-2xl p-4 hover:shadow-2xl transition-all duration-300 ${sidebarOpen ? 'left-64' : 'left-0'}`}
        >
          <div className="p-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 rounded-xl text-white transform hover:scale-110 transition-transform duration-200">
            {activeNavItem?.icon || <Home size={18} />}
          </div>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 h-full bg-white/60 backdrop-blur-xl border-r border-white/30 shadow-2xl overflow-y-auto transition-all duration-300 z-40",
          isMobile ? "fixed" : "relative",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          {/* Logo Section */}
          <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex justify-center items-center w-full">
              <Image
              src="/icons/learnz-logo.png"
              alt="Learn-z Logo"
              width={100}
              height={100}
              className="rounded-full mb-2"
            />
            </div>
            <div className="bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent text-3xl font-black text-center py-4 pt-1">
              Learn-z
            </div>
            <div className="text-center text-sm text-zinc-600 mb-4">Admin Portal</div>
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.key}
                className={cn(
                  "flex items-center w-full gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-300 relative group animate-fadeInUp",
                  activePage === item.key
                    ? "bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-sky-500/10 text-indigo-700 font-semibold border border-indigo-200/50 shadow-lg"
                    : "text-zinc-700 hover:bg-white/40 hover:shadow-md"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => {
                  setActivePage(item.key);
                  if (isMobile) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <div
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    activePage === item.key
                      ? "bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow-lg"
                      : "bg-white/50 text-zinc-600 group-hover:bg-white/80 group-hover:scale-110"
                  )}
                >
                  {item.icon}
                </div>
                <span className="font-medium flex-1">{item.label}</span>
                
                {/* Badge */}
                {item.badge && (
                  <span className="bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
                
                {/* Active indicator */}
                {activePage === item.key && (
                  <div className="absolute right-2 w-2 h-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-6 mt-auto">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white/40 border border-white/30 text-zinc-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-300 hover:shadow-lg group">
            <LogOut size={16} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0px, 0px) scale(1.2); }
          50% { transform: translate(-40px, 40px) scale(1); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

function InstructorsContent() {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-8">
      <h2 className="text-3xl font-bold bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent mb-6">
        Instructor Dashboard 🧠
      </h2>
      <p className="text-zinc-600">Manage your teaching staff and their performance.</p>
    </div>
  );
}

function AnalyticsContent() {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-8">
      <h2 className="text-3xl font-bold bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent mb-6">
        Analytics & Reports 📊
      </h2>
      <p className="text-zinc-600">Deep insights into your learning platform performance.</p>
    </div>
  );
}