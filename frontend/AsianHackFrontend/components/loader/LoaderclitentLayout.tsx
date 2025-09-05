'use client';

import { useEffect, useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import GlobalLoader from "@/components/loader/GlobalLoader";
import useMediaQuery from "@/hooks/useMediaQuery";


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isLoading || isSmallScreen) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "auto";
      body.style.overflow = "auto";
    }

    return () => {
      html.style.overflow = "auto";
      body.style.overflow = "auto";
    };
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500); // loader visible for 500ms

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div className="relative min-h-screen">
      {isLoading && (
        <div className="absolute inset-0 z-100">
          <GlobalLoader />
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
