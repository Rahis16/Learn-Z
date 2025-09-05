"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";


export default function EventsPage() {
  const [filter, setFilter] = useState("All");

  const events = [
    {
      id: 1,
      title: "AI Workshop",
      date: "Aug 25, 2025",
      location: "Kathmandu",
      category: "Workshop",
      description: "Hands-on session on AI tools and applications."
    },
    {
      id: 2,
      title: "Tech Meetup",
      date: "Sep 5, 2025",
      location: "Pokhara",
      category: "Meetup",
      description: "Networking and knowledge sharing with tech enthusiasts."
    },
    {
      id: 3,
      title: "Hackathon 2025",
      date: "Oct 10, 2025",
      location: "Lalitpur",
      category: "Hackathon",
      description: "48-hour coding marathon with exciting prizes."
    },
  ];

  const categories = ["All", "Workshop", "Meetup", "Hackathon"];
  const filteredEvents = filter === "All" ? events : events.filter(e => e.category === filter);

  return (
    <div className="min-h-screen dark:from-zinc-900 dark:to-zinc-950 py-10 px-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">Upcoming Events</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Explore and join events that match your interests.</p>
      </motion.div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat}
            onClick={() => setFilter(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              filter === cat
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                : "bg-white/60 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-800/80"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Events Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {filteredEvents.map(event => (
          <motion.div
            key={event.id}
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl shadow-md border border-white/20 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl"
          >
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{event.title}</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-sm">{event.description}</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-zinc-700 dark:text-zinc-300">
              <FaCalendarAlt /> <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <FaMapMarkerAlt /> <span>{event.location}</span>
            </div>
            <span className="inline-block mt-4 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {event.category}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Highlight Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="max-w-4xl mx-auto mt-16 p-8 rounded-3xl shadow-lg bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white text-center"
      >
        <h2 className="text-2xl font-bold">Don't Miss the Hackathon 2025!</h2>
        <p className="mt-2">Join the biggest coding marathon of the year with prizes and networking opportunities.</p>
      </motion.div>
    </div>
  );
}