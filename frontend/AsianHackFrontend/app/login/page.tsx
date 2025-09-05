"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf"; // ✅ use helper
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { Github } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loggingIn, setLogin] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLogin(true);
      const res = await axiosWithCsrf.post("/auth/login/", {
        email: email.trim(),
        password,
      });

      toast.success("Logged in successfully!");
      console.log("Login successful:", res.data);
      window.location.href = "/login/loading"; // redirect on success
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.non_field_errors) {
        setError(err.response.data.non_field_errors.join(" "));
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLogin(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axiosWithCsrf.post(
          "/auth/google/",
          {
            access_token: tokenResponse.access_token,
          },
          { withCredentials: true } // needed to receive cookies!
        );

        console.log("✅ Google login success:", res.data);
        toast.success("Logged in successfully!");
        window.location.href = "/login/loading";
        // maybe trigger AuthProvider refetch or redirect here
      } catch (err) {
        console.error("❌ Google login failed:", err);
        toast.error("Google login failed!");
      }
    },
    onError: (err) => console.error("❌ Google login error:", err),
  });

  const handleGithubLogin = () => {
    const clientId = "Ov23li2EaARy6c1mz8NK"; // Replace with your real GitHub client ID
    const redirectUri = "http://localhost:3000/github-callback"; // Must match GitHub App setting
    // const redirectUri = "https://cms-nextapp-sandy.vercel.app/github-callback"; // Must match GitHub App setting

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email`;

    // ✅ Redirect the whole page (no popup)
    window.location.href = githubAuthUrl;
  };

  // Motion helpers
  const card = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-tr from-indigo-50 via-sky-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900">
  <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl p-6">
    <h2 className="text-2xl font-bold text-center bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
      Welcome Back
    </h2>

    {/* Google Login */}
    <Button
      onClick={() => handleGoogleLogin()}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/20 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 hover:bg-white/70 dark:hover:bg-zinc-900/70 shadow-sm transition"
      variant="outline"
    >
      <FcGoogle size={20} /> Continue with Google
    </Button>

    {/* GitHub Login */}
    <button
      onClick={handleGithubLogin}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-gray-900 to-black text-white px-6 py-3 shadow hover:opacity-90 transition"
    >
      <Github size={20} className="text-white" />
      <span className="font-medium">Continue with GitHub</span>
    </button>

    {/* Divider */}
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/20 dark:border-white/10" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white/60 dark:bg-zinc-900/60 px-3 text-sm text-gray-500 dark:text-gray-400">
          or
        </span>
      </div>
    </div>

    <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
      Login with email
    </div>

    {/* Form */}
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          required
          onChange={(e: any) => setEmail(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 shadow-sm"
          placeholder="you@example.com"
        />
      </div>

      <div className="relative">
        <label
          htmlFor="password"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          required
          onChange={(e: any) => setPassword(e.target.value)}
          className="w-full mt-1 pr-10 px-3 py-2 rounded-xl bg-white/50 dark:bg-zinc-900/50 border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 shadow-sm"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-[38px] right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-sky-500 text-white shadow hover:opacity-90 transition"
      >
        {loggingIn ? "Logging in..." : "Login"}
      </Button>
    </form>

    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
      Don't have an account?{" "}
      <Link
        href="/signup"
        className="text-indigo-500 hover:underline hover:text-indigo-600"
      >
        Sign up here
      </Link>
    </p>
  </div>
</div>



  );
}
 