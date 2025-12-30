export default function ProMessage({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-80 rounded-xl bg-black border border-white/10 p-5 text-center animate-fade-in-up"
      >
        <div className="text-sm font-semibold mb-2">
          Unlock more features
        </div>

        <div className="text-xs opacity-70 mb-4">
          Advanced tools are available in the bot.
          Contact admin to activate.
        </div>

        <a
          href="https://t.me/Hydra_Rayhan"
          target="_blank"
          className="text-purple-400 text-sm"
        >
          Contact admin
        </a>
      </div>
    </div>
  );
}
