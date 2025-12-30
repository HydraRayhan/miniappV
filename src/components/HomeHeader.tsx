type HomeHeaderProps = {
  onOpenSettings?: () => void;
};

export default function HomeHeader({ onOpenSettings }: HomeHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* LEFT: Logo + Title */}
      <div className="flex items-center gap-3">
        <a
          href="https://x.com/intent/follow?screen_name=COCOONONTON"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <img
            src="/cocoon.jpg"
            alt="COCOON"
            className="h-6 w-6 rounded-full drop-shadow-[0_0_6px_rgba(168,85,247,0.4)] transition-transform active:scale-95"
          />
        </a>

        <div className="flex flex-col leading-tight">
          <div className="font-semibold text-sm">
            COCOON Price Alert Bot
          </div>
        </div>
      </div>

      {/* RIGHT: Settings button (optional) */}
      {onOpenSettings && (
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-white/5 active:bg-white/10 transition"
          aria-label="Open Settings"
        >
                  <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-80"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
        </button>
      )}
    </div>
  );
}