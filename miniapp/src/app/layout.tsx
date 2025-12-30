import "./globals.css";
import BottomNavGate from "@/components/BottomNavGate";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <div className="min-h-screen pb-20">
          {children}
        </div>

        <BottomNavGate />
      </body>
    </html>
  );
}
