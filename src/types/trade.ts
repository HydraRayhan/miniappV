export type Trade = {
  /** Internal UI id (not blockchain hash) */
  id: string;

  /** buy | sell */
  type: "buy" | "sell";

  /** USD display string for Home list (kept for backward compatibility) */
  amount?: string;

  /** Numeric USD value (future use, optional) */
  usd_amount?: number | null;

  /** REAL COCOON amount for FocusedTrade popup */
  cocoon_amount?: number | null;

  /** Trade size classification */
  size: "Small" | "Medium" | "Whale" | "Mega" | "Godzilla";

  /** REAL blockchain transaction hash */
  tx_hash?: string | null;

  /** ISO string or epoch (handled by timeAgo) */
  timestamp: string | number;

  /** Whale flag */
  whale?: boolean;

  /** Optional label like "Whale Buy", "Mega Dump" */
  label?: string | null;
};
