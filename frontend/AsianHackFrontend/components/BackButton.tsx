'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <div className="w-full flex justify-end mb-4">
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow transition"
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
