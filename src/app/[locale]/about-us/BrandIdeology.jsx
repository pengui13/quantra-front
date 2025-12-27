"use client";
import { useTranslations } from "next-intl";
import { Shield, Users, Heart, Compass, Tv } from "lucide-react";

export default function BrandIdeology() {
  const t = useTranslations("brand");

  const cards = [
    { icon: Shield, title: t("reliability"), text: t("weAlways") },
    { icon: Users, title: t("cooperation"), text: t("weAim") },
    { icon: Heart, title: t("integrity"), text: t("honesty") },
    { icon: Compass, title: t("vision"), text: t("createYour") },
    { icon: Tv, title: t("mission"), text: t("weEmpower") },
  ];

  return (
    <div className="flex flex-col items-center justify-center lg:gap-7 gap-4">
      <div className="bg-root-green-8 px-4 py-1 flex flex-col items-center justify-center rounded-[14px]">
        <span className="font-medium text-sm text-root-green">{t("ourValues")}</span>
      </div>

      <div className="flex flex-col items-center justify-center md:gap-10 gap-4">
        <span className="font-bold text-bl text-[36px]">{t("brandIdeology")}</span>
      </div>

      <div className="md:gap-10 gap-4 flex flex-col items-center">
        <div className="flex flex-col lg:flex-row items-center md:gap-10 gap-4 flex-wrap justify-center">
          {cards.map((card, index) => (
            <div
              key={index}
              className="w-[343px] md:w-[728px] lg:w-[360px] lg:h-[264px] rounded-2xl bg-black border border-[#36C6E0]/20 p-7 flex flex-col gap-4"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-root-green-8">
                <card.icon className="w-6 h-6 text-root-green" />
              </div>
              <div className="flex flex-col gap-3">
                <h5 className="font-semibold text-bl text-2xl">{card.title}</h5>
                <span className="font-medium text-bl">{card.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
