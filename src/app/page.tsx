"use client";

import { useEffect, useRef, useState } from "react";
import OpeningLoader from "@/components/OpeningLoader";
import HomeHeader from "@/components/HomeHeader";
import PriceHero from "@/components/PriceHero";
import RecentTrades from "@/components/RecentTrades";
import FocusedTrade from "@/components/FocusedTrade";
import Portal from "@/components/Portal";
import { Trade } from "@/types/trade";

const SESSION_KEY = "cocoon_home_loaded";

type FocusState =
  | { type: "trade"; trade: Trade }
  | null;

export default function Page() {
  const [ready, setReady] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [focus, setFocus] = useState<FocusState>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollPos = useRef(0);

  /* ───────── Restore session ───────── */
  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen) {
      setReady(true);
      setShowHome(true);
    }
  }, []);

  /* ───────── Loader exit (once) ───────── */
  useEffect(() => {
    if (ready && !showHome) {
      sessionStorage.setItem(SESSION_KEY, "1");
      const t = setTimeout(() => setShowHome(true), 300);
      return () => clearTimeout(t);
    }
  }, [ready, showHome]);

  /* ───────── Scroll + body lock for trade focus ───────── */
  useEffect(() => {
    const el = scrollRef.current;

    if (focus) {
      if (el) {
        scrollPos.current = el.scrollTop;
        el.style.overflow = "hidden";
      }
      document.body.style.overflow = "hidden";
    } else {
      if (el) {
        el.style.overflow = "auto";
        el.scrollTo({ top: scrollPos.current });
      }
      document.body.style.overflow = "";
    }
  }, [focus]);

  /* ───────── Loader hard gate ───────── */
  if (!showHome) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <OpeningLoader onDone={() => setReady(true)} />
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black text-white overflow-hidden">
      {/* ───────── HOME ───────── */}
      <div className="relative h-full flex flex-col animate-home-enter">
        <div className="relative z-10 bg-black">
          {/* HomeHeader is DISPLAY ONLY now */}
          <HomeHeader />

          <div className="px-4">
            <PriceHero />
          </div>

          <div className="px-4 pt-4 pb-2 text-xs uppercase tracking-wide opacity-60">
            Recent Activity (last 15 min)
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Trades */}
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-y-auto overscroll-contain"
          >
            <RecentTrades
              onTradeClick={(trade) =>
                setFocus({ type: "trade", trade })
              }
            />
            <div className="h-24" />
          </div>

          <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black to-transparent z-10" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black to-transparent z-10" />
        </div>
      </div>

      {/* ───────── TRADE BLUR ───────── */}
      {focus && (
        <div
          onClick={() => setFocus(null)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />
      )}

      {/* ───────── FOCUSED TRADE ───────── */}
      {focus?.type === "trade" && (
        <Portal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <FocusedTrade trade={focus.trade} />
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
