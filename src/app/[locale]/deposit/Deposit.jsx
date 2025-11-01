"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getAddress, DepositPortfolio } from "../../../../api/ApiWrapper";
import { QRCodeSVG } from "qrcode.react";
import { Tooltip } from "react-tooltip";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

import {
  ChevronDown,
  Search,
  ArrowDownToLine,
  ArrowUpToLine,
  Loader2,
  Copy as CopyIcon,
  Check as CheckIcon,
} from "lucide-react";

export default function Deposit() {
  const t = useTranslations("deposit");
  const locale = useLocale() || "de-DE";
  const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 8 });

  const nbsp = "\u00A0";
  const formatAmount = (v) => {
    const n = Number(v);
    if (Number.isNaN(n)) return v;
    // drop trailing zeros up to 8 decimals, then format in locale
    const trimmed = parseFloat(n.toFixed(8));
    return nf.format(trimmed);
  };

  const searchParams = useSearchParams();

  const [coins, setCoins] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [availableNetworks, setAvailableNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const [coinMenuOpen, setCoinMenuOpen] = useState(false);
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  /* data */
  useEffect(() => {
    DepositPortfolio(setCoins);
  }, []);

  useEffect(() => {
    const key = searchParams.get("key");
    if (key) setSelectedSymbol(key);
  }, [searchParams]);

  useEffect(() => {
    if (coins.length > 0 && coins[0]?.symbol) {
      setSelectedSymbol((curr) => curr || coins[0].symbol);
    }
  }, [coins]);

  useEffect(() => {
    const chosen = coins.find((c) => c.symbol === selectedSymbol);
    setAvailableNetworks(chosen?.networks || []);
  }, [selectedSymbol, coins]);

  useEffect(() => {
    if (availableNetworks.length > 0) setSelectedNetwork(availableNetworks[0]);
  }, [availableNetworks]);

  useEffect(() => {
    if (selectedNetwork?.name && selectedSymbol) {
      setCopied(false);
      getAddress(setAddress, selectedSymbol, selectedNetwork.name, setLoading);
    }
  }, [selectedNetwork, selectedSymbol]);

  const filteredCoins = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coins;
    return coins.filter(
      (c) =>
        c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [coins, query]);

  const handleCopy = async () => {
    if (!address) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
      } else {
        const ta = document.createElement("textarea");
        ta.value = address;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="w-full">
      {/* Outer card */}
      <div className="relative rounded-3xl bg-bkg p-6 md:p-8 border border-white/5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-[28px] font-semibold text-white">
            {t("header.title")}
          </h1>
          <div className="flex items-center gap-2">
            <button
              title={t("actions.deposit")}
              className="w-9 h-9 rounded-xl bg-root-green-8/20 hover:bg-root-green-8/35 transition inline-flex items-center justify-center border border-white/10"
              type="button"
            >
              <ArrowDownToLine size={18} />
            </button>
            <Link href="/withdraw">
              <button
                title={t("actions.withdraw")}
                className="w-9 h-9 rounded-xl bg-log-bkg hover:bg-log-bkg/80 transition inline-flex items-center justify-center border border-white/10"
                type="button"
              >
                <ArrowUpToLine size={18} />
              </button>
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 gap-4">
          {/* Currency */}
          <div className="relative">
            <button
              onClick={() => setCoinMenuOpen((o) => !o)}
              className="w-full rounded-2xl bg-log-bkg px-4 py-3 border border-white/10 hover:border-white/20 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="text-[11px] font-semibold tracking-wide text-gr">
                  {t("selectors.currency.label")}
                </div>
                <div className="flex items-center gap-2">
                  <img
                    width={20}
                    height={20}
                    src={`/assets/${selectedSymbol.toLowerCase()}.png`}
                    alt={selectedSymbol}
                    className="rounded-full"
                  />
                  <span className="text-white/95 font-medium">
                    {selectedSymbol}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`transition ${coinMenuOpen ? "rotate-180" : ""}`}
                size={18}
              />
            </button>

            {coinMenuOpen && (
              <div className="absolute mt-2 w-full rounded-2xl bg-bkg border border-white/10 shadow-2xl overflow-hidden z-50">
                {/* sticky search */}
                <div className="sticky top-0 bg-log-bkg px-3 py-2 border-b border-white/10 flex items-center gap-2">
                  <Search size={16} className="text-white/70" />
                  <input
                    type="text"
                    placeholder={t("inputs.search.placeholder")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-white placeholder:text-gr"
                  />
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                  {filteredCoins.map((coin) => (
                    <button
                      key={coin.symbol}
                      onClick={() => {
                        setSelectedSymbol(coin.symbol);
                        setAvailableNetworks(coin.networks);
                        setCoinMenuOpen(false);
                      }}
                      className="w-full px-3 py-2.5 hover:bg-root-green-8/20 transition flex items-center gap-2 text-left"
                    >
                      <img
                        width={20}
                        height={20}
                        src={`/assets/${coin.symbol.toLowerCase()}.png`}
                        alt={coin.name}
                        className="rounded-full"
                      />
                      <span className="text-white/90 text-sm">
                        {coin.name} <span className="text-gr">({coin.symbol})</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Network */}
          {selectedNetwork && (
            <div className="relative">
              <button
                onClick={() => setNetworkMenuOpen((o) => !o)}
                className="w-full rounded-2xl bg-log-bkg px-4 py-3 border border-white/10 hover:border-white/20 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="text-[11px] font-semibold tracking-wide text-gr">
                    {t("selectors.network.label")}
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      width={20}
                      height={20}
                      src={`/assets/${selectedNetwork.name.toLowerCase()}.png`}
                      alt={selectedNetwork.name}
                      className="rounded-full"
                    />
                    <span className="text-white/95 font-medium">
                      {selectedNetwork.name}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`transition ${networkMenuOpen ? "rotate-180" : ""}`}
                  size={18}
                />
              </button>

              {availableNetworks.length > 1 && networkMenuOpen && (
                <div className="absolute mt-2 w-full rounded-2xl bg-bkg border border-white/10 shadow-2xl overflow-hidden z-50">
                  <div className="max-h-64 overflow-y-auto">
                    {availableNetworks.map((net) => (
                      <button
                        key={net.name}
                        onClick={() => {
                          setSelectedNetwork(net);
                          setNetworkMenuOpen(false);
                        }}
                        className="w-full px-3 py-2.5 hover:bg-root-green-8/20 transition text-left"
                      >
                        <span className="text-white/90 text-sm">{net.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content – one col until xl, then split */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(300px,360px)_1fr]">
          {/* Left: QR & address */}
          <div className="rounded-2xl bg-log-bkg p-4 md:p-5 border border-white/10">
            {loading ? (
              <div className="h-[120px] flex items-center justify-center">
                <Loader2 className="animate-spin text-white/70" size={22} />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-2xl bg-white p-3 shadow">
                  <QRCodeSVG
                    value={address || ""}
                    size={116}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>

                <div className="w-full flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!address}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition border border-white/10 disabled:opacity-50"
                    aria-label={copied ? "Copied" : "Copy address"}
                    data-tooltip-id="amount-tooltip"
                    data-tooltip-content={copied ? "Copied" : "Copy"}
                  >
                    {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                    <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <span
                    className="flex-1 truncate text-sm font-medium text-white/90"
                    title={address}
                  >
                    {address}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: stats */}
          {selectedNetwork && (
            <div className="grid gap-4 content-start">
              <GlassStat
                label={t("stats.minDeposit.label")}
                value={
                  <>
                    {formatAmount(selectedNetwork.min_deposit_amount)}
                    {nbsp}
                    <span className="text-white/70">{selectedSymbol}</span>
                  </>
                }
              />
              <GlassStat
                label={t("stats.arrivalAfter.label")}
                value={
                  <>
                    {selectedNetwork.confirmations}
                    {nbsp}
                    <span className="text-white/70">
                      {t("stats.confirmations.suffix")}
                    </span>
                  </>
                }
              />
              <GlassStat
                label={t("stats.eta.label")}
                value={
                  <>
                    {formatAmount(selectedNetwork.min_deposit_time)}
                    {nbsp}
                    <span className="text-white/70">
                      {t("stats.minutes.suffix")}
                    </span>
                  </>
                }
              />
            </div>
          )}
        </div>
      </div>

      <Tooltip id="amount-tooltip" />
    </div>
  );
}

/* Stat tile: label flexes, value never wraps */
function GlassStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex-1 min-w-0 truncate text-sm font-semibold text-white/70">
          {label}
        </span>
        <span className="text-sm font-semibold text-white whitespace-nowrap tabular-nums">
          {value}
        </span>
      </div>
    </div>
  );
}
