"use client";

import { useEffect, useState } from "react";
import { Trade } from "@/types/trade";
import { timeAgo } from "@/lib/timeAgo";
import Toast from "@/components/Toast";

const EXPLORER_BASE = "https://tonviewer.com/transaction/";

const GLOW_INTENSITY: Record<string, number> = {
  Small: 0.2,
  Medium: 0.3,
  Whale: 0.45,
  Mega: 0.6,
  Godzilla: 0.8,
};

export default function FocusedTrade({
  trade,
  closing,
}: {
  trade: Trade;
  closing?: boolean;
}) {
  const [toast, setToast] = useState(false);
  const [visible, setVisible] = useState(false);

  /* ───────── ENTER animation ───────── */
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  /* ───────── EXIT animation ───────── */
  useEffect(() => {
    if (closing) {
      setVisible(false);
    }
  }, [closing]);

  const isBuy = trade.type === "buy";
  const baseColor = isBuy ? "34,197,94" : "239,68,68";
  const intensity = GLOW_INTENSITY[trade.size] ?? 0.25;

  const pulse =
    trade.size === "Whale" ||
    trade.size === "Mega" ||
    trade.size === "Godzilla";

  const glowStyle = {
    background: `rgba(${baseColor}, ${intensity})`,
  };

  /* ───────── COCOON amount (popup only) ───────── */
  const cocoon =
    typeof trade.cocoon_amount === "number"
      ? trade.cocoon_amount.toLocaleString(undefined, {
          maximumFractionDigits: 4,
        })
      : "—";

  /* ───────── TX hash ───────── */
  const txHash = trade.tx_hash;
  const shortTx =
    txHash ? txHash.slice(0, 6) + "…" + txHash.slice(-4) : "—";

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!txHash) return;

    navigator.clipboard.writeText(txHash);
    setToast(true);

    setTimeout(() => {
      window.open(
        `${EXPLORER_BASE}${txHash}`,
        "_blank",
        "noopener,noreferrer"
      );
    }, 120);
  };

  return (
    <>
      {toast && (
        <Toast
          text="Transaction copied"
          onDone={() => setToast(false)}
        />
      )}

      {/* ───────── POPUP LAYER ───────── */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
        <div
          className={`
            relative pointer-events-auto
            transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)]
            ${
              visible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-3"
            }
          `}
        >
          {/* Glow */}
          <div
            className={`absolute inset-0 rounded-2xl blur-xl ${
              pulse ? "animate-glow-pulse" : ""
            }`}
            style={glowStyle}
          />

          {/* Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[300px] rounded-2xl border border-white/10 bg-black/85 p-5 text-center backdrop-blur"
          >
            {/* TYPE + LEVEL */}
            <div
              className={`text-xs font-semibold uppercase ${
                isBuy ? "text-green-400" : "text-red-400"
              }`}
            >
              {trade.type} · {trade.size}
            </div>

            {/* Optional label */}
            {trade.label && (
              <div className="mt-1 text-xs text-purple-400">
                {trade.label}
              </div>
            )}

            {/* COCOON AMOUNT */}
            <div className="mt-3 text-3xl font-bold">
              {cocoon} $COCOON
            </div>

            {/* TIME */}
            <div className="mt-2 text-xs opacity-60">
              {timeAgo(trade.timestamp)}
            </div>

            {/* TX HASH */}
            <button
              onClick={handleCopy}
              disabled={!txHash}
              className="mt-4 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono opacity-80 hover:opacity-100 active:scale-95 transition disabled:opacity-40"
            >
              {shortTx}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
