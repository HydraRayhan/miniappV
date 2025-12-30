"use client";

import { useState } from "react";
import { useTelegram } from "@/lib/useTelegram";
import { saveSettings } from "@/lib/api";

type SettingsDraft = {
  pnlAlerts: boolean;
  tradeAlerts: boolean;
  limit: string;
};

type SettingsPanelProps = {
  onClose: () => void;
};

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  /* ───────── TELEGRAM USER (SAFE) ───────── */
  const { user } = useTelegram();
  const avatar = user?.photo_url;


  const displayName =
    user?.first_name
      ? `${user.first_name}${user.last_name ? " " + user.last_name : ""}`
      : "Telegram User";

  const tgId = user?.id ?? "-";

  /* ───────── SETTINGS STATE ───────── */
  const initialSettings: SettingsDraft = {
    pnlAlerts: true,
    tradeAlerts: false,
    limit: "100",
  };

  const [draft, setDraft] = useState<SettingsDraft>(initialSettings);

  const hasChanges =
    draft.pnlAlerts !== initialSettings.pnlAlerts ||
    draft.tradeAlerts !== initialSettings.tradeAlerts ||
    draft.limit !== initialSettings.limit;

  const limitValid =
    draft.limit !== "" &&
    !isNaN(Number(draft.limit)) &&
    Number(draft.limit) >= 0;

  const saveEnabled = hasChanges && limitValid;

  return (
    <div className="h-full flex flex-col text-white">
      {/* ───────── HEADER ───────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
       <div className="flex items-center gap-3">
        {avatar ? (
        <img
            src={avatar}
            alt={displayName}
            className="h-10 w-10 rounded-full object-cover"
        />
        ) : (
        <div className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10"/>
        )}

        <div>
        <div className="font-semibold leading-tight">
        {displayName}
        </div>
        <div className="text-xs text-neutral-400">
        TG ID: {tgId}
        </div>
        </div>
        </div>

        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* ───────── CONTENT ───────── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
        {/* BOT SETTINGS */}
        <section className="space-y-5">
          <h3 className="text-xs uppercase tracking-widest text-neutral-500">
            Bot Settings
          </h3>

          {/* PNL ALERTS */}
          <ToggleRow
            label="PNL Alerts"
            value={draft.pnlAlerts}
            onChange={(v) =>
              setDraft({ ...draft, pnlAlerts: v })
            }
          />

          {/* TRADE ALERTS */}
          <ToggleRow
            label="Trade Alerts"
            value={draft.tradeAlerts}
            onChange={(v) =>
              setDraft({ ...draft, tradeAlerts: v })
            }
          />

          {/* LIMIT */}
          <div className="space-y-1">
            <label className="text-sm text-neutral-300">
              Trade Alert Limit (USD)
            </label>
            <input
              type="number"
              value={draft.limit}
              onChange={(e) =>
                setDraft({ ...draft, limit: e.target.value })
              }
              className="w-full rounded-md bg-neutral-800 px-3 py-2 outline-none"
              placeholder="100"
            />
            <p className="text-xs text-neutral-500">
              Alerts trigger only when trade size exceeds this value
            </p>
            {!limitValid && (
              <p className="text-xs text-red-400">
                Enter a valid number ≥ 0
              </p>
            )}
          </div>
        </section>

        {/* ABOUT */}
        <section className="space-y-3 pt-4 border-t border-white/10">
          <button className="w-full text-left text-sm text-neutral-400 hover:text-white transition">
            About Us & It
          </button>

          <div className="text-sm text-neutral-400">
            Follow Us
            <div className="mt-1">
              <a
                href="#"
                className="text-purple-400 hover:text-purple-300 transition"
              >
                @CocoonBot
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* ───────── SAVE BAR ───────── */}
      <div className="border-t border-neutral-800 p-4">
        <button
  type="button"
  disabled={!saveEnabled}
  onClick={async () => {
    if (!user?.id) return;

    await saveSettings({
      tg_id: Number(tgId),
      pnl_alerts: draft.pnlAlerts,
      trade_alerts: draft.tradeAlerts,
      limit: Number(draft.limit),
    });

    onClose();
  }}
>
  Save
</button>

      </div>
    </div>
  );
}

/* ───────── TOGGLE ROW ───────── */

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-8 w-16 rounded-full transition
          ${value ? "bg-green-600" : "bg-red-500/80"}`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white transition
            ${value ? "right-1" : "left-1"}`}
        />
      </button>
    </div>
  );
}
