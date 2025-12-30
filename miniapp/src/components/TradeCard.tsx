"use client";

import { Trade } from "@/types/trade";
import { timeAgo } from "@/lib/timeAgo";

type TradeCardProps = Trade & {
  onClick?: () => void;
};

const VISIBLE_WINDOW_MS = 15 * 60 * 1000;
const FADE_WINDOW_MS = 60 * 1000;

const GLOW_MAP: Record<string, string> = {
  Small: "transparent",
  Medium: "rgba(34,197,94,0.15)",
  Whale: "rgba(168,85,247,0.35)",
  Mega: "rgba(236,72,153,0.45)",
  Godzilla: "rgba(239,68,68,0.55)",
};

function getFadeStyle(timestamp: string | number) {
  const now = Date.now();
  const ts = typeof timestamp === "number" ? timestamp : Date.parse(timestamp);
  if (Number.isNaN(ts)) return { opacity: 1, scale: 1 };

  const age = now - ts;

  if (age < VISIBLE_WINDOW_MS - FADE_WINDOW_MS) {
    return { opacity: 1, scale: 1 };
  }

  if (age <= VISIBLE_WINDOW_MS) {
    const progress =
      (age - (VISIBLE_WINDOW_MS - FADE_WINDOW_MS)) / FADE_WINDOW_MS;

    return {
      opacity: Math.max(0, 1 - progress),
      scale: Math.max(0.96, 1 - progress * 0.04),
    };
  }

  return { opacity: 0, scale: 0.96 };
}

export default function TradeCard({
  type,
  amount,
  size,
  timestamp,
  label,
  onClick,
}: TradeCardProps) {
  const isBuy = type === "buy";
  const fade = getFadeStyle(timestamp);
  const glow = GLOW_MAP[size] ?? "transparent";

  const isWhaleLevel =
    size === "Whale" || size === "Mega" || size === "Godzilla";

  return (
    <div
      onClick={onClick}
      style={{
        opacity: fade.opacity,
        transform: `scale(${fade.scale})`,
        boxShadow:
          glow !== "transparent"
            ? `0 0 0 1px ${glow}, 0 10px 28px ${glow}`
            : undefined,
      }}
      className={`
        relative rounded-xl border border-white/10
        bg-gradient-to-br from-white/[0.06] to-white/[0.02]
        p-4 transition-all duration-300 ease-out
        ${onClick ? "cursor-pointer hover:bg-white/10 active:scale-[0.985]" : ""}
      `}
    >
      {/* ROW 1 */}
      <div className="flex justify-between items-start">
        {/* LEFT */}
        <div
          className={`text-xs font-semibold uppercase tracking-wide ${
            isBuy ? "text-green-400" : "text-red-400"
          }`}
        >
          {type}
        </div>

        {/* RIGHT */}
        <div className="text-xs opacity-50">
          {timeAgo(timestamp)}
        </div>
      </div>

      {/* ROW 2 */}
      <div className="flex justify-between items-end mt-1">
        {/* AMOUNT */}
        <div className="text-xl font-bold tracking-tight">
          {amount}
        </div>

        {/* SIZE / LEVEL */}
        <div className="text-xs font-medium opacity-65">
          {isWhaleLevel ? label : size}
        </div>
      </div>
    </div>
  );
}
