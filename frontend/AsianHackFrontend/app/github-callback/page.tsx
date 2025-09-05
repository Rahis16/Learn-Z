"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";

export default function GitHubCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    console.log("Received GitHub code:", code);

    if (!code) {
      toast.error("No GitHub code found!");
      return;
    }

    const loginWithGitHub = async () => {
      try {
        // Just send the code to your backend — no direct call to GitHub API here!
        const res = await axiosWithCsrf.post(
          "/auth/github/",
          { code }, // send code directly
          { withCredentials: true }
        );

        console.log("✅ GitHub login success:", res.data);
        toast.success("Logged in via GitHub!");
        window.location.href = "/login/loading";
      } catch (err) {
        console.error("❌ GitHub login error:", err);
        toast.error("GitHub login failed!");
        router.push("/login");
      }
    };

    loginWithGitHub();
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 animate-pulse">Authorizing with GitHub...</p>
    </div>
  );
}
