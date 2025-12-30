"use client";

import { useEffect, useRef, useState } from "react";
import TradeCard from "./TradeCard";
import { Trade } from "@/types/trade";

const WINDOW_MINUTES = 15;
const MAX_ITEMS = 10;

export default function RecentTrades({
  onTradeClick,
}: {
  onTradeClick?: (trade: Trade) => void;
}) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTrades = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/trades`,
        { cache: "no-store", signal: controller.signal }
      );

      clearTimeout(timeout);
      if (!res.ok) return;

      const data: Trade[] = await res.json();
      if (!Array.isArray(data)) return;

      const now = Date.now();
      const cutoff = now - WINDOW_MINUTES * 60 * 1000;

      const recent = data
        .filter(t => {
          const ts =
            typeof t.timestamp === "number"
              ? t.timestamp
              : Date.parse(t.timestamp);

          return !Number.isNaN(ts) && ts >= cutoff;
        })
        .slice(0, MAX_ITEMS);

      setTrades(recent);
    } catch (err) {
      console.error("RecentTrades fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
    pollRef.current = setInterval(fetchTrades, 10000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  /* LOADING */
  if (loading) {
    return (
      <div className="mx-4 mt-6 space-y-3">
        {[1, 2].map(i => (
          <div
            key={i}
            className="h-16 rounded-xl bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* EMPTY */
  if (!trades.length) {
    return (
      <div className="mx-4 mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-center">
        <div className="text-sm text-white/80">
          No trades in the last 15 minutes
        </div>

        <div className="mt-1 text-xs opacity-60">
          Watching the market in real time
        </div>

        <div className="mt-3 flex justify-center items-center gap-2 text-xs opacity-50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
          Live monitoring
        </div>

        <div className="mt-3 text-[11px] opacity-40">
          Real-time buy & sell alerts · Whale detection · Market snapshots
        </div>
      </div>
    );
  }

  /* LIST */
  return (
    <div className="mt-6 px-4 space-y-3">
      {trades.map(trade => (
        <TradeCard
          key={trade.id}
          {...trade}
          onClick={() => onTradeClick?.(trade)}
        />
      ))}
    </div>
  );
}
