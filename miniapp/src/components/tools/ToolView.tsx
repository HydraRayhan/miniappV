export default function ToolView({
  type,
  onClose,
}: {
  type: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-80 rounded-2xl bg-black border border-white/10 p-6 text-center animate-fade-in-up"
      >
        <div className="text-lg font-semibold mb-2">
          {type}
        </div>
        <div className="text-xs opacity-60">
          Tool UI goes here
        </div>
      </div>
    </div>
  );
}
