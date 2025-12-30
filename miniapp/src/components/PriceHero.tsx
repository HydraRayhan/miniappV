"use client";

import { useEffect, useRef, useState } from "react";
import Toast from "./Toast";

const TOKEN_ADDRESS =
  "EQBiyZMUXvdnRYFUk3_R5uPdsR2ROI9mes_1S-jL1tIQDhDK";

type Snapshot = {
  price?: number;
  updated_at_pretty?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function PriceHero() {
  const [price, setPrice] = useState("—");
  const [change, setChange] = useState<number | null>(null);
  const [updated, setUpdated] = useState("");
  const [focused, setFocused] = useState(false);
  const [toast, setToast] = useState(false);

  const lastPrice = useRef<number | null>(null);
  const glowRef = useRef<"neutral" | "up" | "down">("neutral");

  const [floaters, setFloaters] = useState<
    { id: number; x: number }[]
  >([]);

  /* ---------------- PRICE POLL ---------------- */

  useEffect(() => {
    if (!API_BASE) return;

    const load = async () => {
      const r = await fetch(`${API_BASE}/market/snapshot`, {
        cache: "no-store",
      });
      if (!r.ok) return;
      const d: Snapshot = await r.json();

      if (typeof d.price === "number") {
        setPrice(`$${d.price.toFixed(8)}`);

        if (lastPrice.current !== null) {
          const pct =
            ((d.price - lastPrice.current) /
              lastPrice.current) *
            100;
          setChange(pct);
          glowRef.current =
            pct > 0 ? "up" : pct < 0 ? "down" : "neutral";
        }

        lastPrice.current = d.price;
      }

      if (d.updated_at_pretty) {
        setUpdated(`Updated ${d.updated_at_pretty}`);
      }
    };

    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, []);

  /* ---------------- COPY ---------------- */

  const handleCopy = () => {
    navigator.clipboard.writeText(TOKEN_ADDRESS);

    setToast(true);

    setFloaters((f) => {
      const id = Date.now();
      const x = Math.random() * 20 - 10;
      return [...f.slice(-2), { id, x }];
    });
  };

  const glowColor =
    glowRef.current === "up"
      ? "rgba(34,197,94,0.35)"
      : glowRef.current === "down"
      ? "rgba(239,68,68,0.35)"
      : "rgba(168,85,247,0.35)";

  const shortAddr =
    TOKEN_ADDRESS.slice(0, 6) +
    "…" +
    TOKEN_ADDRESS.slice(-4);

  return (
    <>
      {/* Blur overlay */}
      {focused && (
        <div
          onClick={() => setFocused(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity"
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          text="Address copied"
          onDone={() => setToast(false)}
        />
      )}

      {/* Card */}
      <div
        className={`relative mx-4 mt-4 z-40 transition-transform ${
          focused ? "scale-[1.01]" : ""
        }`}
        onClick={() => setFocused(true)}
      >
        {/* Glow */}
        {focused && (
          <div
            className="absolute inset-0 rounded-2xl blur-xl transition-all duration-200"
            style={{ background: glowColor }}
          />
        )}

        <div className="relative rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
          {/* NORMAL VIEW */}
          {!focused && (
            <>
              <div className="text-xs opacity-60 mb-1">
                $COCOON
              </div>

              <div className="text-3xl font-bold tracking-tight">
                {price}
              </div>

              {change !== null && (
                <div
                  className={`mt-1 text-sm ${
                    change > 0
                      ? "text-green-400"
                      : change < 0
                      ? "text-red-400"
                      : "text-white/60"
                  }`}
                >
                  {change > 0 && "+"}
                  {change.toFixed(2)}%
                </div>
              )}

              <div className="mt-2 text-xs opacity-50">
                {updated}
              </div>
            </>
          )}

          {/* FOCUSED VIEW */}
          {focused && (
            <div className="space-y-3 animate-fade-in-up">
              <div className="text-sm font-semibold">
                $COCOON
              </div>

              <div className="text-xs opacity-60">
                Token address
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono active:scale-95 transition"
              >
                {shortAddr}
              </button>
            </div>
          )}

          {/* Floating copy feedback */}
          {floaters.map((f) => (
            <div
              key={f.id}
              className="absolute left-1/2 -translate-x-1/2 text-xs opacity-70 animate-float-up"
              style={{ marginLeft: f.x }}
              onAnimationEnd={() =>
                setFloaters((x) =>
                  x.filter((i) => i.id !== f.id)
                )
              }
            >
              ✓ Copied
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
