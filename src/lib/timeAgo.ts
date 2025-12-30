import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function timeAgo(ts: unknown) {
  if (!ts) return "?";

  // 🔒 Normalize ts into ISO string
  let tsStr: string;

  if (typeof ts === "string") {
    tsStr = ts;
  } else if (typeof ts === "number") {
    // epoch seconds or ms
    tsStr =
      ts > 1e12
        ? new Date(ts).toISOString()
        : new Date(ts * 1000).toISOString();
  } else if (ts instanceof Date) {
    tsStr = ts.toISOString();
  } else {
    console.warn("Unknown timestamp type:", ts);
    return "?";
  }

  // 🔒 Normalize to UTC ISO
  const normalized = tsStr.endsWith("Z") ? tsStr : `${tsStr}Z`;
  const tradeTime = dayjs.utc(normalized);

  if (!tradeTime.isValid()) {
    console.warn("Invalid trade timestamp:", tsStr);
    return "?";
  }

  const now = dayjs.utc();

  let diffMin = now.diff(tradeTime, "minute");
  if (diffMin < 0) diffMin = 0; // future-safe

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = now.diff(tradeTime, "hour");
  if (diffHr < 24) return `${diffHr}h ago`;

  return tradeTime.format("DD MMM HH:mm UTC");
}
