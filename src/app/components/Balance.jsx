"use client";

import { useEffect, useState } from "react";

// helper to read cookie by name
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export default function Balance() {
  const [balance, setBalance] = useState({ value: "0.00", currency: "USD" });

  useEffect(() => {
    const token = getCookie("access");
    if (!token) return;

    const wsUrl = `ws://127.0.0.1:8000/ws/balances/?token=${token}`;
    let ws;
    let reconnectTimeout;

    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("✅ Connected to Balance WS");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.value && data?.currency) {
            setBalance({
              value: parseFloat(data.value).toFixed(2),
              currency: data.currency,
            });
          }
        } catch (err) {
          console.error("⚠️ Failed to parse WS message", err);
        }
      };

      ws.onclose = () => {
        reconnectTimeout = setTimeout(connect, 2000);
      };

      ws.onerror = (err) => {
        console.error("WS error", err);
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, []);

  return (
    <div className="px-2 py-1 rounded bg-[#36C6E0]/20 text-[#36C6E0] font-medium text-sm flex items-center gap-1">
      <span>{balance.currency === "USD" ? "$" : "€"}</span>
      <span>{balance.value}</span>
    </div>
  );
}
