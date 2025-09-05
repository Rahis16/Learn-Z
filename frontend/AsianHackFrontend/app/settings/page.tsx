"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@headlessui/react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-tr from-indigo-50 via-sky-50 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl rounded-3xl border border-white/30 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl p-10"
      >
        <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500">
          Settings
        </h1>

        {/* Profile Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Profile Settings
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-zinc-900/70"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-zinc-900/70"
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-zinc-900/70"
            />
          </div>
        </div>

        {/* Account Security */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Account Security
          </h2>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-zinc-900/70"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-zinc-900/70"
            />
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Preferences
          </h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">
                Dark Mode
              </span>
              <Switch
                checked={darkMode}
                onChange={setDarkMode}
                className={`${
                  darkMode ? "bg-indigo-500" : "bg-gray-300"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">
                Email Notifications
              </span>
              <Switch
                checked={emailNotif}
                onChange={setEmailNotif}
                className={`${
                  emailNotif ? "bg-indigo-500" : "bg-gray-300"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${
                    emailNotif ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">
                SMS Notifications
              </span>
              <Switch
                checked={smsNotif}
                onChange={setSmsNotif}
                className={`${
                  smsNotif ? "bg-indigo-500" : "bg-gray-300"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${
                    smsNotif ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button className="px-8 py-3 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white font-semibold shadow-lg hover:opacity-90 transition">
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}