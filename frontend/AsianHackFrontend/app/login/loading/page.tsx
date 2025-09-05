"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { Loader2, PartyPopper, Cookie, Sparkles } from "lucide-react";

export default function LoginRedirectPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Getting things ready...");
  const [retry, setRetry] = useState(false);

  function getCompletedFlag() {
    const value = localStorage.getItem("is_completed_flag");
    return value ? JSON.parse(value) : false; // default false if not set
  }

  useEffect(() => {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const confirmCookieSet = async () => {
      try {
        const res = await axiosWithCsrf.get("/auth/status/", {
          withCredentials: true,
        });

        if (res.data.user_status_encoded) {
          document.cookie = `user_status=${res.data.user_status_encoded}; path=/; max-age=86400; Secure; SameSite=None`;
          console.log("✅ Cookie set:", res.data.user_status_encoded);

          // Wait a bit for middleware to pick it up
          await delay(1500);
          if (getCompletedFlag()) {
            console.log("✅ User already completed profile");
            router.push("/dashboard");
          } else {
            router.push("/completeprofile");
          }
        } else {
          throw new Error("No encoded status");
        }
      } catch (err) {
        console.log("❌ Auth status error:", err);
        setRetry(true);
        setMessage("Hmm... taking longer than expected. Retrying...");
        await delay(1000);
        confirmCookieSet(); // Retry
      }
    };

    confirmCookieSet();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-indigo-100">
        <div className="flex justify-center mb-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{message}</h1>
        <p className="text-gray-600 text-sm">
          We're baking cookies{" "}
          <Cookie className="inline w-4 h-4 text-yellow-600" /> and brewing
          login magic <PartyPopper className="inline w-4 h-4 text-pink-500" />.
          Please hang tight{" "}
          <Sparkles className="inline w-4 h-4 text-indigo-500" />.
        </p>

        {retry && (
          <p className="mt-4 text-xs text-red-500 italic">
            If you're stuck here, try refreshing or clearing cookies.
          </p>
        )}

        <div className="mt-8">
          <span className="text-xs text-gray-400">
            Redirecting to home shortly...
          </span>
        </div>
      </div>
    </div>
  );
}
