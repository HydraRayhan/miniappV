export async function saveSettings(payload: {
  tg_id: number;
  pnl_alerts: boolean;
  trade_alerts: boolean;
  limit: number;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/settings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Save settings failed:", err);
    throw new Error("Failed to save settings");
  }

  return res.json();
}
