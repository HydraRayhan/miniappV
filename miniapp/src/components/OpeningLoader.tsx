"use client";

import { useEffect, useState } from "react";

export default function OpeningLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onDone, 250);
          return 100;
        }
        return p + 3;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-purple-500/10 blur-3xl" />

      {/* Center branding */}
      <div className="relative z-10 mb-16 text-center animate-fade-in-up">
        <div className="flex justify-center">
          <img
            src="/cocoon.jpg"
            alt="COCOON"
            className="h-12 w-12 rounded-full drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]"
          />
        </div>

        <div className="mt-3 text-lg font-semibold tracking-wide">
          COCOON Price Alert Bot
        </div>

        <div className="mt-1 text-xs opacity-60">
          Real-time market intelligence
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-24 w-3/4 max-w-xs z-10">
        <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 text-center text-xs opacity-60">
          Initializing market streams…
        </div>
      </div>
    </div>
  );
}
