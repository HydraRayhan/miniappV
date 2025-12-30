import { useEffect, useState } from "react";

export function useTelegram() {
  const [ready, setReady] = useState(false);
  const [initData, setInitData] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    import("@twa-dev/sdk").then(({ default: WebApp }) => {
      WebApp.ready();
      WebApp.expand();

      setInitData(WebApp.initData);
      setUser(WebApp.initDataUnsafe?.user ?? null);
      setReady(true);
    });
  }, []);

  return {
    ready,
    initData,
    user,
  };
}
