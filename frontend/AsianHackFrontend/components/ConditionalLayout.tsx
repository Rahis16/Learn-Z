// app/components/ConditionalLayout.tsx (client component)
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatPopup from "@/components/SoloChatPopup";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isClassRoute = pathname?.startsWith("/classroom");
  const isCompleteProfileRoute = pathname?.startsWith("/completeprofile");
  const isCompleteSkillsRoute = pathname?.startsWith("/completeskills");

  return (
    <>
      {(!isAdminRoute && !isClassRoute && !isCompleteProfileRoute && !isCompleteSkillsRoute) && <Navbar />}
      {(!isAdminRoute && !isClassRoute && !isCompleteProfileRoute && !isCompleteSkillsRoute) && <ChatPopup />}

      {isAdminRoute ? (
        // For admin routes, render children directly or with a different wrapper
        <div className="min-h-screen p-1">
          {children}
        </div>
      ) : (
        // For non-admin routes, keep your normal main wrapper
        <div className="min-h-screen flex justify-center">
          <main className="w-full max-full">{children}</main>
        </div>
      )}

      {(!isAdminRoute && !isClassRoute && !isCompleteProfileRoute && !isCompleteSkillsRoute) && <Footer />}
    </>
  );
}
