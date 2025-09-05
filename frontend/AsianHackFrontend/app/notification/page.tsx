"use client";

import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, AlertCircle, X, Trash2, Check } from "lucide-react";

export default function Notification() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Course Completed! 🎉",
      message: "Congratulations! You've successfully completed 'Advanced React Patterns'",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      type: "warning",
      title: "Assignment Due Soon ⏰",
      message: "Your JavaScript fundamentals assignment is due in 2 hours",
      time: "15 min ago",
      unread: true,
    },
    {
      id: 3,
      type: "info",
      title: "New Learning Path Available ✨",
      message: "Check out our new 'Full-Stack Development' learning path with AI assistance!",
      time: "1 hr ago",
      unread: false,
    },
    {
      id: 4,
      type: "success",
      title: "Achievement Unlocked! 🏆",
      message: "You've earned the 'Code Warrior' badge for completing 10 coding challenges",
      time: "3 hr ago",
      unread: false,
    },
    {
      id: 5,
      type: "info",
      title: "Study Streak: 7 Days! 🔥",
      message: "Amazing! You're on a 7-day learning streak. Keep it up!",
      time: "1 day ago",
      unread: false,
    },
  ]);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-emerald-500 w-6 h-6" />;
      case "warning":
        return <AlertCircle className="text-amber-500 w-6 h-6" />;
      case "info":
        return <Bell className="text-indigo-500 w-6 h-6" />;
      default:
        return <Bell className="text-gray-500 w-6 h-6" />;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case "success":
        return "from-emerald-50 to-green-50 border-emerald-200/50";
      case "warning":
        return "from-amber-50 to-yellow-50 border-amber-200/50";
      case "info":
        return "from-indigo-50 to-violet-50 border-indigo-200/50";
      default:
        return "from-gray-50 to-slate-50 border-gray-200/50";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="overflow-hidden">
     
      <div className="min-h-screen text-zinc-900 relative z-10 p-6">
        <div className="max-w-4xl mx-auto bg-white/50 shadow-xl rounded-2xl p-12 mt-3 mb-12">
          
          {/* Header */}
          <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-8 overflow-hidden relative">
              {/* Header pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
                  backgroundSize: '20px 20px'
                }} />
              </div>
              
              <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent flex items-center gap-3 mb-2">
                    <Bell className="w-8 h-8 text-indigo-500" /> 
                    Notifications
                    {unreadCount > 0 && (
                      <span className="bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white text-sm px-3 py-1 rounded-full animate-pulse">
                        {unreadCount} new
                      </span>
                    )}
                  </h1>
                  <p className="text-zinc-600">Stay updated with your learning journey</p>
                </div>
                
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <Check className="w-4 h-4" />
                    Mark all as read
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`group relative animate-fadeInUp hover:scale-[1.02] transition-all duration-500 ${notification.unread ? 'transform translate-x-2' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glow effect for unread notifications */}
                {notification.unread && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400/30 to-violet-400/30 rounded-3xl blur opacity-75 animate-pulse" />
                )}
                
                <div className={`relative bg-gradient-to-r ${getGradient(notification.type)} backdrop-blur-xl rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${notification.unread ? 'ring-2 ring-indigo-200/50' : ''}`}>
                  {/* Card pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.2) 1px, transparent 0)`,
                      backgroundSize: '16px 16px'
                    }} />
                  </div>
                  
                  <div className="relative z-10 flex items-start gap-4 p-6">
                    {/* Icon with animation */}
                    <div className="shrink-0 p-2 rounded-xl bg-white/50 group-hover:scale-110 transition-transform duration-300">
                      {getIcon(notification.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-zinc-800 mb-1 ${notification.unread ? 'text-zinc-900' : 'text-zinc-700'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-zinc-600 text-sm leading-relaxed mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400">{notification.time}</span>
                            {notification.unread && (
                              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                            )}
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {notification.unread && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
                              title="Mark as read"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {notifications.length === 0 && (
            <div className="text-center py-12 animate-fadeInUp">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-12">
                <Bell className="w-16 h-16 text-indigo-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-zinc-700 mb-2">All caught up!</h3>
                <p className="text-zinc-500">No new notifications at the moment.</p>
              </div>
            </div>
          )}
        </div>
      </div>

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
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}