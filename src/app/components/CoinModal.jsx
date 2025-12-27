"use client";

import { useEffect, useState } from "react";
import { SetFiat, GetAssets } from "../../../api/ApiWrapper";
import { Bitcoin, Check } from "lucide-react"; // Default coin icon

export default function CoinModal() {
  const [open, setOpen] = useState(false);
  const [fiat, setFiat] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // Load fiat coins
  useEffect(() => {
    GetAssets(setFiat);
  }, []);

  // Set preferred fiat
  const handleSetFiat = async (assetId) => {
    try {
      setLoadingId(assetId);
      await SetFiat({ asset_id: assetId });

      setFiat((prev) =>
        prev.map((f) => ({ ...f, preferred: f.id === assetId }))
      );
    } finally {
      setLoadingId(null);
      setOpen(false);
    }
  };

  // Preferred coin fallback
  const preferredCoin = fiat.find((f) => f.preferred) || {
    symbol: "BTC",
    rate: null,
  };

  return (
    // Wrap both button and dropdown in a parent div
    <div
      className="relative inline-block z-50"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* MAIN BUTTON */}
      <div className="flex items-center gap-2 px-2 py-1 rounded bg-[#36C6E0]/20 text-[#36C6E0] font-medium text-sm cursor-pointer">
        <span>{preferredCoin.symbol}</span>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 top-full mt-1 w-[100px] rounded-xl backdrop-blur-2xl bg-log-bkg-68 shadow-xl">
          <div className="flex flex-col gap-1 p-2">
            {fiat.map((item) => (
              <button
                key={item.id}
                disabled={loadingId === item.id}
                onClick={() => handleSetFiat(item.id)}
                className={`
                  flex items-center justify-between
                  px-3 py-2 rounded-lg text-sm font-semibold
                  transition
                  ${
                    item.preferred
                      ? "bg-root-green-8 text-root-green-9"
                      : "hover:bg-root-green-8/60"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span>{item.symbol}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.preferred && <Check className="w-4 h-4" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
