"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlinePaperAirplane,
  HiOutlineChatAlt2,
  HiX,
  HiOutlinePaperClip,
} from "react-icons/hi";
import Image from "next/image";

export default function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "other", text: "Hey there! 👋" },
    { id: 2, sender: "me", text: "Hi! How’s it going?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "me", text: input },
    ]);
    setInput("");
  };

  // Auto-scroll to latest
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-24 left-6 z-50 p-4 rounded-full shadow-lg bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white hover:scale-105 transition"
      >
        <HiOutlineChatAlt2 size={24} />
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed z-10 bottom-23 right-6 w-80 sm:w-96 h-[500px] bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl flex flex-col overflow-hidden border border-white/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/profile2.jpg"
                  alt="User"
                  width={35}
                  height={35}
                  className="rounded-full border-2 border-white"
                />
                <div>
                  <h3 className="font-semibold">Priya Khadka</h3>
                  <p className="text-xs text-white/80">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <HiX size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-md ${
                      msg.sender === "me"
                        ? "bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white rounded-br-none"
                        : "bg-white/80 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-md border-t border-black/30">
              <div className="flex-1 flex items-center bg-black/10 rounded-full px-3 py-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent outline-none text-black placeholder-black text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
              </div>

              {/* Attachment button */}
              <button
                className="p-2 rounded-full bg-black/10 text-black hover:bg-black/20 transition"
                title="Attach file"
              >
                <HiOutlinePaperClip className="w-5 h-5" />
              </button>

              {/* Send button */}
              <button
                onClick={sendMessage}
                className="p-2 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white hover:opacity-90 transition"
              >
                <HiOutlinePaperAirplane className="w-5 h-5 rotate-45" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
