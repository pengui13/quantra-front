"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function CryptoBg() {
  const [opened, open] = useState(false);
  const t = useTranslations("aboutUs");

  return (
    <div className="relative w-full flex flex-col items-center justify-center h-[700px] md:h-[500px] bg-[#050a30] ">
      
      {/* Background Image with dark blue blend */}
      <div
        className="absolute inset-0 w-full h-full mix-blend-multiply bg-blue-900/70"
        style={{
          backgroundImage: "url('/quantra_logo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
            }}
      />

      {/* Text overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-7 text-center px-4">
        <div className="bg-root-green-8 px-4 py-1 flex flex-col items-center justify-center rounded-[14px]">
          <span className="font-medium text-sm text-root-green">
            {t("whoWeAre")}
          </span>
        </div>
        <span className="font-bold text-white text-[36px]">{t("about-quantra")}</span>
        <h5 className="w-[343px] lg:w-[780px] md:w-[708px] text-center text-gray-200 font-medium">
          {t("quantraIsCentralized")}
        </h5>
      </div>
    </div>
  );
}
