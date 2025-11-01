"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function CopyButton({ copy }) {
  const t = useTranslations("common"); // loads messages from common.json
  const [showNoti, setShowNoti] = useState(false);

  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      document.execCommand("copy", true, text);
    }
  };

  const handleClick = () => {
    copyTextToClipboard(copy)
      .then(() => {
        setShowNoti(true);
        setTimeout(() => setShowNoti(false), 2000);
      })
      .catch((err) => console.error("Copy failed", err));
  };

  return (
    <div className="relative inline-block">
      {/* Copy Button */}
      <button
        onClick={handleClick}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <Image
          width={16}
          height={16}
          src="/assets/clipboard.svg"
          alt="Copy"
        />
      </button>

      {/* Notification Tooltip */}
      <div
        className={`
          absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2
          bg-[#4FD1C5] text-black w-[120px] h-9 flex items-center justify-center gap-2
          shadow-lg rounded-lg px-2
          transition-all duration-200 ease-out
          ${
            showNoti
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }
        `}
      >
        <Image
          src="/assets/marki.svg"
          width={18}
          height={18}
          alt="Copied"
        />
        <span className="text-xs font-semibold">{t("copied")}</span>
      </div>
    </div>
  );
}
