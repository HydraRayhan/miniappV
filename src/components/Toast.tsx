"use client";

import { useEffect } from "react";

export default function Toast({
  text,
  onDone,
}: {
  text: string;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="px-4 py-2 rounded-full bg-black/80 border border-white/10 text-xs text-white backdrop-blur">
        {text}
      </div>
    </div>
  );
}
