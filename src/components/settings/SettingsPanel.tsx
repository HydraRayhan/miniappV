"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@/lib/useTelegram";
import { getSettings } from "@/lib/api";

type BotSettings = {
  pnlAlerts: boolean;
  tradeAlerts: boolean;
  limit: string;
};

type HomeView = "trades" | "pnl";

type SettingsPanelProps = {
  onClose: () => void;
};

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { user } = useTelegram();
  const avatar = user?.photo_url;

  const displayName =
    user?.first_name
      ? `${user.first_name}${user.last_name ? " " + user.last_name : ""}`
      : "Telegram User";

  /* ───────── BOT SETTINGS (READ ONLY) ───────── */
  const [botSettings, setBotSettings] = useState<BotSettings | null>(null);

  /* ───────── MINI APP SETTINGS ───────── */
  const [homeView, setHomeView] = useState<HomeView>("trades");

  /* ───────── LOAD DATA ───────── */
  useEffect(() => {
    if (!user?.id) return;

    const tgId = user.id;

    getSettings(tgId)
      .then((data) => {
        setBotSettings({
          pnlAlerts: data.pnl_alerts,
          tradeAlerts: data.trade_alerts,
          limit: String(data.limit),
        });
      })
      .catch((err) => {
        console.error("Failed to load bot settings", err);
      });

    const saved = localStorage.getItem("miniapp_home_view");
    if (saved === "trades" || saved === "pnl") {
      setHomeView(saved);
    }
  }, [user]);

  const handleSave = () => {
    localStorage.setItem("miniapp_home_view", homeView);
    onClose();
  };

  /* ───────── ALERT SUMMARY RENDER ───────── */
  const renderAlertSummary = () => {
    if (!botSettings) return null;

    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-sm space-y-2">
        <div className="font-semibold text-white mb-2">
          Alert Summary
        </div>

        <div className="flex justify-between">
          <span>📈 Trade Alerts</span>
          <span className="font-medium">
            {botSettings.tradeAlerts ? "ON" : "OFF"}
            {botSettings.tradeAlerts && (
              <span className="text-neutral-400">
                {" "}(&gt;${botSettings.limit})
              </span>
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span>💼 PnL Alerts</span>
          <span className="font-medium">
            {botSettings.pnlAlerts ? "ON" : "OFF"}
          </span>
        </div>

        <div className="flex justify-between text-neutral-400">
          <span>🐋 Whale Alerts</span>
          <span className="font-medium">
            Managed via Bot
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-white/10" />
          )}

          <div>
            <div className="font-semibold">{displayName}</div>
            <div className="text-xs text-neutral-400">
              TG ID: {user?.id}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-white/50 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
        {/* BOT SETTINGS */}
        <section>
          <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
            Bot Settings
          </h3>

          {renderAlertSummary()}
        </section>

        {/* MINI APP HOME */}
        <section>
          <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
            Mini App Home
          </h3>

          <div className="space-y-3">
            <RadioRow
              label="Trades"
              active={homeView === "trades"}
              onClick={() => setHomeView("trades")}
            />

            <RadioRow
              label="PnL"
              active={homeView === "pnl"}
              onClick={() => setHomeView("pnl")}
            />

            {homeView === "pnl" && (
              <div className="text-sm text-yellow-400 pt-2">
                🚧 PnL dashboard is coming soon.
                <br />
                You’ll be notified when it’s ready.
              </div>
            )}
          </div>
        </section>

        {/* ABOUT */}
        <section className="pt-6 border-t border-white/10 text-sm text-neutral-400">
          <div className="mb-2">About</div>
          <div>
            Follow us{" "}
            <span className="text-purple-400">@TestCOCOONBot</span>
          </div>
        </section>
      </div>

      {/* SAVE BAR */}
      <div className="border-t border-neutral-800 p-4 space-y-2">
        <div className="text-right text-xs text-neutral-500">
          v0.1.0
        </div>

        <button
          onClick={handleSave}
          className="w-full rounded-md py-3 font-semibold bg-neutral-700 hover:bg-neutral-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}

/* ───────── RADIO ROW ───────── */

function RadioRow({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition ${
        active ? "bg-purple-600" : "bg-neutral-800"
      }`}
    >
      <span>{label}</span>
      <span className="text-sm">{active ? "✓" : ""}</span>
    </button>
  );
}
