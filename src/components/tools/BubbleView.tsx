export default function BubbleView({
  bubble,
  onTap,
}: {
  bubble: any;
  onTap: () => void;
}) {
  return (
    <div
      onClick={onTap}
      className="absolute rounded-full flex items-center justify-center text-sm font-medium select-none cursor-pointer"
      style={{
        width: bubble.size,
        height: bubble.size,
        left: bubble.x,
        top: bubble.y,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 0 24px rgba(168,85,247,0.25)",
      }}
    >
      {bubble.type === "SR" ? "S&R" : bubble.type}
    </div>
  );
}
