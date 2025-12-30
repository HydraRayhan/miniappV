"use client";

import { usePathname, useRouter } from "next/navigation";

type BottomNavProps = {
  onOpenSettings: () => void;
};

export default function BottomNav({ onOpenSettings }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isTools = pathname === "/tools";
  const isSettings = false; // overlay, not route

  const item = (active: boolean) =>
    `transition-all duration-200 ${
      active
        ? "scale-110 opacity-100 font-semibold text-white"
        : "scale-95 opacity-50"
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-t border-white/10">
      <div className="flex justify-around py-3 text-xs">
        {/* TOOLS */}
        <button
          onClick={() => router.push("/tools")}
          className={item(isTools)}
        >
          🫧 Tools
        </button>

        {/* HOME */}
        <button
          onClick={() => router.push("/")}
          className={item(isHome)}
        >
          🏠 Home
        </button>

        {/* SETTINGS (OVERLAY) */}
        <button
          onClick={onOpenSettings}
          className={item(isSettings)}
        >
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
}
