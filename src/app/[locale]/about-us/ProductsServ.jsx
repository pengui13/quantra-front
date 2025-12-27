"use client";
import InfoBox from "./InfoBox";
import { useTranslations } from "next-intl";
import { Wallet, Activity, ArrowUpDown, CreditCard, Users } from "lucide-react";

export default function ProductsServ() {
  const t = useTranslations("productsServ");

  const boxes = [
    {
      header: t("quantrawallet"),
      text: t("allowsUsers"),
      icon: Wallet,
    },
    {
      header: t("spot"),
      text: t("tradeAnytime"),
      icon: Activity,
    },
    {
      header: t("buynSell"),
      text: t("buynSellInstant"),
      icon: ArrowUpDown,
    },
    {
      header: t("quantraCard"),
      text: t("useQuantra"),
      icon: CreditCard,
    },

  ];

  return (
    <div className="flex flex-col mb-[100px] items-center justify-center gap-7">
      <div className="bg-root-green-8 px-4 py-1 flex flex-col items-center justify-center rounded-[14px]">
        <span className="font-medium text-sm text-root-green">{t("whatWeOffer")}</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-10">
        <h5 className="font-bold text-center lg:text-left text-bl text-[36px]">{t("ourProducts")}</h5>
      </div>

      <div className="lg:gap-5 lg:grid lg:grid-cols-2 flex flex-col gap-4">
        {boxes.map((box, index) => (
          <InfoBox
            key={index}
            header={box.header}
            text={box.text}
            icon={box.icon} // Pass the Lucide icon
          />
        ))}
      </div>
    </div>
  );
}
