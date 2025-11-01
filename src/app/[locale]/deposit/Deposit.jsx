"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CopyButton from "./CopyButton";
import { getAddress, DepositPortfolio } from "../../../../api/ApiWrapper";
import QRCode from "qrcode.react";
import { Tooltip } from "react-tooltip";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  Search,
  ArrowDownToLine,
  ArrowUpToLine,
  Loader2,
} from "lucide-react";

export default function Deposit() {
  const t = useTranslations("common");
  const searchParams = useSearchParams();

  const [data, setData] = useState([]);
  const [selectedCurr, setSelectedCurr] = useState("BTC");
  const [networks, setSelectedNetworks] = useState([]);
  const [network, setNetwork] = useState(null);
  const [depo, setDepo] = useState("");
  const [spinner, setSpinner] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch deposit portfolio
  useEffect(() => {
    DepositPortfolio(setData);
  }, []);

  // ✅ Set currency if ?key= param is passed
  useEffect(() => {
    const key = searchParams.get("key");
    if (key) setSelectedCurr(key);
  }, [searchParams]);

  // ✅ Default to first currency
  useEffect(() => {
    if (data.length > 0 && data[0].symbol) {
      setSelectedCurr((curr) => curr || data[0].symbol);
    }
  }, [data]);

  // ✅ Update networks when currency changes
  useEffect(() => {
    const selected = data.find((c) => c.symbol === selectedCurr);
    if (selected?.networks) setSelectedNetworks(selected.networks);
  }, [selectedCurr, data]);

  // ✅ Default network
  useEffect(() => {
    if (networks.length > 0) setNetwork(networks[0]);
  }, [networks]);

  // ✅ Fetch deposit address
  useEffect(() => {
    if (network?.name && selectedCurr) {
      getAddress(setDepo, selectedCurr, network.name, setSpinner);
    }
  }, [network, selectedCurr]);

  // ✅ Filtered list
  const filteredData = searchTerm
    ? data.filter(
        (coin) =>
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data;

  return (
    <div className="flex flex-col w-full bg-bkg rounded-2xl p-7">
      <div className="flex flex-col w-full items-center justify-center gap-4">
        {/* Header */}
        <div className="flex w-full items-center justify-between">
          <h5 className="text-bl font-semibold text-xl">{t("depoDetails")}</h5>
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center bg-root-green-8 rounded-lg w-8 h-8">
              <ArrowDownToLine size={20} color="#4FD1C5" />
            </button>
            <Link href="/withdraw">
              <button className="flex items-center justify-center bg-log-bkg rounded-lg w-8 h-8">
                <ArrowUpToLine size={20} color="#4FD1C5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="flex flex-col w-full gap-[30px]">
          <div className="inline-block w-full relative">
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex cursor-pointer bg-log-bkg w-full items-center gap-2 px-4 py-2 justify-between rounded-xl"
            >
              <div className="flex flex-col">
                <span className="text-xs text-gr font-semibold">
                  {t("Choose currency")}
                </span>
                <div className="flex items-center gap-2">
                  <img
                    width={24}
                    height={24}
                    src={`/assets/${selectedCurr.toLowerCase()}.png`}
                    alt={selectedCurr}
                  />
                  <span className="font-medium text-bl">{selectedCurr}</span>
                </div>
              </div>
              <ChevronDown size={20} color="#4FD1C5" />
            </div>

            {/* Dropdown with sticky Search */}
            {showDropdown && (
              <div className="absolute rounded-xl shadow-lg w-full overflow-y-auto max-h-[320px] bg-bkg z-50">
                {/* Sticky Search Bar */}
                <div className="sticky top-0 z-10 bg-log-bkg px-4 py-2 rounded-t-xl border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Search size={18} color="#4FD1C5" />
                    <input
                      type="text"
                      placeholder={t("search")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="outline-none bg-log-bkg placeholder:text-gr text-bl font-medium text-sm w-full"
                    />
                  </div>
                </div>

                {/* Currency list */}
                <div className="divide-y divide-white/5">
                  {filteredData.map((coin) => (
                    <div
                      key={coin.symbol}
                      onClick={() => {
                        setShowDropdown(false);
                        setSelectedCurr(coin.symbol);
                        setSelectedNetworks(coin.networks);
                      }}
                      className="flex cursor-pointer bg-bkg hover:bg-root-green-8 justify-between py-3 px-3 transition"
                    >
                      <div className="flex gap-2 items-center">
                        <img
                          src={`/assets/${coin.symbol.toLowerCase()}.png`}
                          width={24}
                          height={24}
                          alt={coin.name}
                        />
                        <span className="text-bl font-medium">
                          {coin.name} ({coin.symbol})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Network Selector */}
          {network && (
            <div className="relative w-full">
              <div
                onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                className="w-full cursor-pointer px-4 py-2 bg-log-bkg rounded-xl"
              >
                <div className="flex flex-col">
                  <span className="text-gr text-xs font-medium">
                    {t("Choose network")}
                  </span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        width={24}
                        height={24}
                        src={`/assets/${network.name.toLowerCase()}.png`}
                        alt={network.name}
                      />
                      <span className="font-medium text-bl">{network.name}</span>
                    </div>
                    {networks.length > 1 && (
                      <ChevronDown size={20} color="#4FD1C5" />
                    )}
                  </div>
                </div>
              </div>

              {networks.length > 1 && showNetworkDropdown && (
                <div className="absolute rounded-xl shadow-lg w-full overflow-y-auto max-h-[300px] bg-bkg z-50">
                  {networks.map((net) => (
                    <div
                      key={net.name}
                      onClick={() => {
                        setNetwork(net);
                        setShowNetworkDropdown(false);
                      }}
                      className="flex cursor-pointer bg-bkg hover:bg-root-green-8 py-4 px-2 transition"
                    >
                      <span className="text-bl font-medium">{net.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Deposit Address */}
          {spinner ? (
            <div className="w-full bg-log-bkg h-[68px] rounded-xl flex items-center justify-center">
              <Loader2 size={24} className="animate-spin" color="#4FD1C5" />
            </div>
          ) : (
            <div className="flex gap-8 bg-log-bkg flex-col md:flex-row w-full rounded-xl items-center p-4">
              <div className="flex flex-col gap-2 items-center justify-center">
                <span className="text-bl text-sm font-medium">{t("address")}</span>
                <div className="flex items-center justify-center rounded-xl bg-white p-3">
                  <QRCode value={depo} size={88} bgColor="#ffffff" fgColor="#000000" />
                </div>
                <div className="flex items-center gap-2">
                  {depo && <CopyButton copy={depo} />}
                  <span className="w-[92px] truncate font-medium text-sm text-bl">
                    {depo}
                  </span>
                </div>
              </div>

              {network && (
                <div className="flex flex-col w-full gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-gr">
                      {t("minDepo")}
                    </span>
                    <span className="font-semibold text-sm text-bl">
                      {network.min_deposit_amount} {selectedCurr}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-gr">
                      {t("depoArr")}
                    </span>
                    <span className="font-semibold text-sm text-bl">
                      {network.confirmations} {t("confirmations")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-gr">
                      {t("depoTime")}
                    </span>
                    <span className="font-semibold text-sm text-bl">
                      {network.min_deposit_time} {t("min.")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Tooltip id="amount-tooltip" />
    </div>
  );
}
