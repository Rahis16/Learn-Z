"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineBell, HiX } from "react-icons/hi";

export default function NotificationSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // Dummy notification data
  const notifications = [
    {
      id: 1,
      title: "New Friend Request",
      message: "Aarav Sharma sent you a friend request.",
      time: "2 mins ago",
    },
    {
      id: 2,
      title: "New Message",
      message: "Priya Khadka: Hey, how’s your project going?",
      time: "10 mins ago",
    },
    {
      id: 3,
      title: "Classroom Invite",
      message: "You’ve been added to Web Dev Group.",
      time: "1 hr ago",
    },
  ];

  return (
    <>
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 p-4 rounded-full shadow-lg bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white hover:scale-105 transition z-50"
      >
        <HiOutlineBell size={24} />
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 w-80 sm:w-96 h-full bg-white/10 backdrop-blur-lg border-l border-white/20 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <button onClick={() => setIsOpen(false)}>
                <HiX size={22} />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-lg bg-white/80 text-gray-800 shadow-sm hover:bg-white transition"
                >
                  <h4 className="font-semibold text-sm">{note.title}</h4>
                  <p className="text-xs text-gray-600">{note.message}</p>
                  <span className="text-[10px] text-gray-500">{note.time}</span>
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
