"use client";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Lock, Send, ChevronDown, TrendingUp, MessageCircle } from "lucide-react";

export default function OTCTrading() {
  const [sell, selectSell] = useState(false);
  const [dropdown, showDropDown] = useState(false);
  const [baseAsset, selectBaseAsset] = useState("BTC");
  const [quoteAsset, selectQuoteAsset] = useState("CAD");
  const t = useTranslations("OTC");

  const pairs = [
    { base: "BTC", quotes: ["EUR", "USD", "AUD", "USDT"] },
    { base: "ETH", quotes: ["EUR", "USD", "AUD", "USDT"] },
    { base: "USDT", quotes: ["EUR", "USD", "AUD"] },
  ];

  function selectPair(base, quote) {
    showDropDown(false);
    selectBaseAsset(base);
    selectQuoteAsset(quote);
  }

  return (
    <div className="flex flex-col mt-[60px] pt-20 bg-black min-h-screen items-center">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="flex flex-col max-w-[1440px] w-full px-4 gap-8">
        {/* Header */}
        <div className="flex flex-col gap-6 w-full">
          <div className="w-full py-4 px-5 rounded-xl flex items-center gap-4 bg-red-500/10 border border-red-500/20">
            <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0">
              <Lock className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex flex-col flex-1">
              <h5 className="font-semibold text-white">{t("restricted")}</h5>
              <p className="font-medium text-gray-400 text-sm">{t("contact-access")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#36C6E0]/20 rounded-lg border border-[#36C6E0]/50">
                <TrendingUp className="w-6 h-6 text-[#36C6E0]" />
              </div>
              <h1 className="font-bold text-3xl text-white">{t("otc")}</h1>
            </div>
            <p className="font-medium text-gray-400 max-w-2xl">{t("quantra-otc")}</p>
          </div>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row w-full">
          <div className="w-full rounded-2xl bg-black border border-[#36C6E0]/20 px-6 py-6 flex flex-col gap-6">
            {/* Trade Section */}
            <div className="flex flex-col gap-2">
              <h2 className="text-white font-bold text-xl">{t("request-quote")}</h2>
              <p className="text-gray-400 text-sm font-medium">{t("compet-price")}</p>
              <p className="text-gray-400 text-sm font-medium">{t("submit-request")}</p>
            </div>

            {/* Buy/Sell Switch */}
            <div className="flex items-center gap-3">
              <div className="flex w-auto bg-black border border-[#36C6E0]/20 rounded-lg p-1">
                <button
                  onClick={() => selectSell(false)}
                  className={`rounded-md px-6 py-2 font-semibold text-sm transition-all ${
                    !sell ? "bg-[#36C6E0] text-black shadow-lg shadow-[#36C6E0]/30" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t("Buy")}
                </button>
                <button
                  onClick={() => selectSell(true)}
                  className={`rounded-md px-6 py-2 font-semibold text-sm transition-all ${
                    sell ? "bg-red-500 text-white shadow-lg shadow-red-500/30" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t("Sell")}
                </button>
              </div>

              {/* Pair Dropdown */}
              <div className="relative w-full">
                <button
                  onClick={() => showDropDown(!dropdown)}
                  className="bg-black border border-[#36C6E0]/20 hover:border-[#36C6E0]/40 cursor-pointer w-full rounded-lg px-4 py-3 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-[#36C6E0]/10 rounded">
                      <Image
                        src={`/assets/${baseAsset.toLowerCase()}.png`}
                        width={20}
                        height={20}
                        alt={baseAsset}
                      />
                    </div>
                    <span className="font-bold text-white">
                      {baseAsset}
                      <span className="text-gray-400 font-medium">/{quoteAsset}</span>
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${dropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 max-h-[320px] overflow-y-auto bg-black border border-[#36C6E0]/20 rounded-lg z-50">
                    {pairs.map((pair) =>
                      pair.quotes.map((quote) => (
                        <button
                          key={`${pair.base}-${quote}`}
                          onClick={() => selectPair(pair.base, quote)}
                          className="flex w-full h-12 items-center gap-3 px-4 hover:bg-[#36C6E0]/10 transition-colors border-b border-[#36C6E0]/10 last:border-0"
                        >
                          <div className="p-1.5 bg-[#36C6E0]/10 rounded">
                            <Image
                              src={`/assets/${pair.base.toLowerCase()}.png`}
                              width={20}
                              height={20}
                              alt={pair.base}
                            />
                          </div>
                          <span className="font-semibold text-white text-sm">
                            {pair.base}
                            <span className="text-gray-400 font-medium">/{quote}</span>
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              {["quantity", "amount"].map((label, i) => (
                <div key={i} className="bg-black border border-[#36C6E0]/20 rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-400 text-sm font-medium">{t(label)}</label>
                    <span className="text-gray-400 font-medium text-sm">{i === 0 ? baseAsset : quoteAsset}</span>
                  </div>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full outline-none bg-transparent font-bold text-white text-lg placeholder-gray-600 cursor-not-allowed"
                    disabled
                  />
                </div>
              ))}
            </div>

            {/* Get Quote Button */}
            <button
              className={`py-3 w-full font-bold rounded-xl transition-all flex items-center justify-center gap-2 opacity-50 cursor-not-allowed ${
                sell ? "bg-red-500 text-white" : "bg-[#36C6E0] text-black"
              }`}
              disabled
            >
              <Send className="w-4 h-4" />
              {t("get-quote")} {sell ? t("selling") : t("buying")} {baseAsset}
            </button>
          </div>
          <div className="bg-black border border-[#36C6E0]/20 rounded-2xl p-6 flex flex-col justify-between gap-6 w-full lg:max-w-sm h-fit">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#36C6E0]/20 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-[#36C6E0]" />
                </div>
                <h3 className="text-white font-bold text-lg">Large Trades?</h3>
              </div>
              <p className="text-gray-400 text-sm font-medium">{t("execute-large")}</p>
            </div>

            <Link href="http://wa.me/" className="w-full">
              <button className="bg-[#36C6E0] hover:bg-[#36C6E0]/90 rounded-xl w-full text-black text-sm font-bold px-6 py-3 transition-all hover:shadow-lg hover:shadow-[#36C6E0]/30 active:scale-95 flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {t("become-otc")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
