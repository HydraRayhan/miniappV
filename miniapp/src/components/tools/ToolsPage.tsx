"use client";

import { useEffect, useRef, useState } from "react";
import BubbleView from "./BubbleView";
import ToolView from "./ToolView";
import ProMessage from "./ProMessage";


type BubbleType = "PNL" | "SR" | "TP" | "PRO";

type Bubble = {
  id: string;
  type: BubbleType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

const NAV_SAFE_HEIGHT = 80; // px

const WIDTH = typeof window !== "undefined" ? window.innerWidth : 360;
const HEIGHT =
  typeof window !== "undefined"
    ? window.innerHeight - NAV_SAFE_HEIGHT
    : 640;




export default function ToolsPage() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [activeTool, setActiveTool] = useState<BubbleType | null>(null);
  const [showPro, setShowPro] = useState(false);

  const raf = useRef<number | null>(null);
  /* ---------------- INIT ---------------- */

  useEffect(() => {
    spawnBubbles();
   return () => {
  if (raf.current) {
    cancelAnimationFrame(raf.current);
  }
    };

  }, []);

  const spawnBubbles = () => {
    const base: Bubble[] = [
      makeBubble("PNL", 96),
      makeBubble("SR", 92),
      makeBubble("TP", 88),
    ];

    // very rare premium bubble
    if (Math.random() < 0.15) {
      base.push(makeBubble("PRO", 90));
    }

    setBubbles(base);
    animate(base);
  };

  const makeBubble = (type: BubbleType, size: number): Bubble => ({
    id: crypto.randomUUID(),
    type,
    size,
    x: Math.random() * (WIDTH - size),
    y: Math.random() * (HEIGHT - size - 120) + 80,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
  });

  /* ---------------- PHYSICS ---------------- */

  const animate = (list: Bubble[]) => {
    raf.current = requestAnimationFrame(() => {
      const next = list.map((b) => {
        let { x, y, vx, vy, size } = b;

        x += vx;
        y += vy;

        // screen bounce
        if (x < 0 || x + size > WIDTH) vx *= -0.9;
        if (y < 0 || y + size > HEIGHT) vy *= -0.9;

        return { ...b, x, y, vx, vy };
      });

      // bubble collisions
      for (let i = 0; i < next.length; i++) {
        for (let j = i + 1; j < next.length; j++) {
          const a = next[i];
          const b = next[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const min = (a.size + b.size) / 2;

          if (dist < min) {
            a.vx *= -0.9;
            a.vy *= -0.9;
            b.vx *= -0.9;
            b.vy *= -0.9;
          }
        }
      }

      setBubbles(next);
      animate(next);
    });
  };

  /* ---------------- UI ---------------- */

  if (activeTool) {
    return (
      <ToolView
        type={activeTool}
        onClose={() => {
          setActiveTool(null);
          spawnBubbles();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {bubbles.map((b) => (
        <BubbleView
          key={b.id}
          bubble={b}
          onTap={() => {
            if (b.type === "PRO") {
              setShowPro(true);
            } else {
              setActiveTool(b.type);
            }
          }}
        />
      ))}

      {showPro && <ProMessage onClose={() => setShowPro(false)} />}
    </div>
  );
}
