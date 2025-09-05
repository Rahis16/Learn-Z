"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "LearnZ Platform",
    adminEmail: "admin@learnz.com",
    notifications: true,
    darkMode: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    toast.success("Settings updated successfully!");
    console.log("Saved settings:", settings);
  };

  return (
    <div className="min-h-screen px-6 py-10 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl rounded-3xl border border-white/30 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl p-10 space-y-10"
      >
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">
          Admin Settings
        </h1>

        {/* General Settings */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-300">
            General Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Site Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Admin Email</label>
              <input
                type="email"
                name="adminEmail"
                value={settings.adminEmail}
                onChange={handleChange}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-300">
            Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-700 accent-indigo-500"
              />
              <span className="text-gray-600 dark:text-gray-300">Enable Notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-700 accent-indigo-500"
              />
              <span className="text-gray-600 dark:text-gray-300">Enable Dark Mode</span>
            </label>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-300">
            Quick Actions
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <button className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white font-semibold hover:opacity-90 transition">
              Clear Cache
            </button>
            <button className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition">
              Delete Logs
            </button>
            <button className="flex-1 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition">
              Rebuild Index
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:opacity-90 transition"
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
}