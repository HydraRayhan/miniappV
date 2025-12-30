"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@/lib/useTelegram";
import { getSettings, saveSettings } from "@/lib/api";

type SettingsDraft = {
  pnlAlerts: boolean;
  tradeAlerts: boolean;
  limit: string;
};

type SettingsPanelProps = {
  onClose: () => void;
};

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  /* ───────── TELEGRAM USER ───────── */
  const { user } = useTelegram();
  const avatar = user?.photo_url;

  const displayName =
    user?.first_name
      ? `${user.first_name}${user.last_name ? " " + user.last_name : ""}`
      : "Telegram User";

  const tgId = user?.id;

  /* ───────── SERVER SETTINGS ───────── */
  const [serverSettings, setServerSettings] =
    useState<SettingsDraft | null>(null);

  /* ───────── DRAFT SETTINGS ───────── */
  const [draft, setDraft] = useState<SettingsDraft>({
    pnlAlerts: false,
    tradeAlerts: false,
    limit: "0",
  });

  /* ───────── LOAD SETTINGS ───────── */
  useEffect(() => {
    if (!tgId) return;

    getSettings(tgId)
      .then((data) => {
        const normalized: SettingsDraft = {
          pnlAlerts: data.pnl_alerts,
          tradeAlerts: data.trade_alerts,
          limit: String(data.limit),
        };

        setServerSettings(normalized);
        setDraft(normalized);
      })
      .catch((err) => {
        console.error("Failed to load settings", err);
      });
  }, [tgId]);

  /* ───────── VALIDATION ───────── */
  const limitValid =
    draft.limit !== "" &&
    !isNaN(Number(draft.limit)) &&
    Number(draft.limit) >= 0;

  const hasChanges =
    !!serverSettings &&
    (draft.pnlAlerts !== serverSettings.pnlAlerts ||
      draft.tradeAlerts !== serverSettings.tradeAlerts ||
      draft.limit !== serverSettings.limit);

  const saveEnabled = hasChanges && limitValid;

  /* ───────── SAVE ───────── */
  const handleSave = async () => {
    if (!tgId) return;

    try {
      await saveSettings({
        tg_id: tgId,
        pnl_alerts: draft.pnlAlerts,
        trade_alerts: draft.tradeAlerts,
        limit: Number(draft.limit),
      });

      setServerSettings(draft);
      onClose();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save settings");
    }
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
            <div className="text-xs text-neutral-400">TG ID: {tgId}</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-white/50 hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
        <section className="space-y-5">
          <h3 className="text-xs uppercase tracking-widest text-neutral-500">
            Bot Settings
          </h3>

          <ToggleRow
            label="PNL Alerts"
            value={draft.pnlAlerts}
            onChange={(v) => setDraft({ ...draft, pnlAlerts: v })}
          />

          <ToggleRow
            label="Trade Alerts"
            value={draft.tradeAlerts}
            onChange={(v) => setDraft({ ...draft, tradeAlerts: v })}
          />

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
            />
            {!limitValid && (
              <p className="text-xs text-red-400">
                Enter a valid number ≥ 0
              </p>
            )}
          </div>
        </section>
      </div>

      {/* SAVE BAR */}
      <div className="border-t border-neutral-800 p-4">
        <button
          disabled={!saveEnabled}
          onClick={handleSave}
          className={`w-full rounded-md py-3 font-semibold transition ${
            saveEnabled
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-neutral-700 cursor-not-allowed"
          }`}
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
        className={`relative h-8 w-16 rounded-full transition ${
          value ? "bg-green-600" : "bg-red-500/80"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
            value ? "right-1" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
