"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import SettingsPanel from "@/components/settings/SettingsPanel";

const SESSION_KEY = "cocoon_home_loaded";

export default function BottomNavGate() {
  const [ready, setReady] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [renderSettings, setRenderSettings] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      setReady(true);
      return;
    }

    const onReady = () => setReady(true);
    window.addEventListener("cocoon:home-ready", onReady);

    return () => {
      window.removeEventListener("cocoon:home-ready", onReady);
    };
  }, []);

  // Mount overlay before animating in
  useEffect(() => {
    if (settingsOpen) {
      setRenderSettings(true);
    } else {
      const t = setTimeout(() => setRenderSettings(false), 300);
      return () => clearTimeout(t);
    }
  }, [settingsOpen]);

  if (!ready) return null;

  return (
    <>
      <BottomNav onOpenSettings={() => setSettingsOpen(true)} />

      {renderSettings && (
        <div className="fixed inset-0 z-[10000]">
          {/* BACKDROP */}
          <div
            onClick={() => setSettingsOpen(false)}
            className={`
              absolute inset-0
              bg-black/20 backdrop-blur-md
              transition-opacity duration-300
              ${settingsOpen ? "opacity-100" : "opacity-0"}
            `}
          >
            <div className="absolute bottom-6 left-6 text-xs text-white/30">
              Tap anywhere to close
            </div>
          </div>

          {/* SETTINGS SHEET */}
          <div
            className={`
              absolute right-0 top-0 h-full
              w-[70%] max-w-[420px]
              bg-neutral-900/95 backdrop-blur-xl
              shadow-2xl shadow-black/40
              transform transition-transform duration-300 ease-out
              ${settingsOpen ? "translate-x-0" : "translate-x-full"}
            `}
          >
            <SettingsPanel onClose={() => setSettingsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
