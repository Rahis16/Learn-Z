"use client";

import * as React from "react";

export function Avatar({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
      {children}
    </div>
  );
}

export function AvatarImage({ src }: { src: string }) {
  return <img src={src} alt="avatar" className="h-full w-full object-cover" />;
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-full w-full items-center justify-center bg-gray-300 text-sm font-medium text-gray-700">
      {children}
    </span>
  );
}