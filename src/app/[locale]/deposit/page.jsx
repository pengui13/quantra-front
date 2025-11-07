"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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

/* --- Theme --------------------------------------------------------------- */
const ACCENT = "#2CA8B4";        // new accent
const BG_PAGE = "#0b0b0e";       // darker page background
const BG_PANEL = "#101217";      // darker panels
const BG_PANEL_SOFT = "#12141a"; // menus, sticky bars
const BORDER = "rgba(255,255,255,0.08)";

/* --- Utils --------------------------------------------------------------- */
const shortAddress = (addr) => {
  if (!addr) return "";
  const s = String(addr);
  return s.length <= 10 ? s : `${s.slice(0, 5)}…${s.slice(-5)}`; // first 5 / last 5
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};

/* --- Component ----------------------------------------------------------- */
export default function Deposit() {
  const t = useTranslations("deposit");
  const locale = useLocale() || "de-DE";
  const nf = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 8 }),
    [locale]
  );
  const nbsp = "\u00A0";

  const formatAmount = useCallback(
    (v) => {
      const n = toNumber(v);
      if (n === undefined) return String(v ?? "");
      const trimmed = parseFloat(n.toFixed(8));
      return nf.format(trimmed);
    },
    [nf]
  );

  /* search param */
  const searchParams = useSearchParams();
  const deepLinkSymbol = searchParams.get("key") ?? undefined;

  /* state */
  const [coins, setCoins] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [coinMenuOpen, setCoinMenuOpen] = useState(false);
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  /* data: load portfolio once */
  useEffect(() => {
    DepositPortfolio((list) => setCoins(Array.isArray(list) ? list : []));
  }, []);

  /* initialize symbol from URL or first coin once coins arrive */
  useEffect(() => {
    if (!coins.length) return;
    setSelectedSymbol((curr) => deepLinkSymbol || curr || coins[0].symbol);
  }, [coins, deepLinkSymbol]);

  /* derived coin + networks */
  const selectedCoin = useMemo(
    () => coins.find((c) => c.symbol === selectedSymbol) || null,
    [coins, selectedSymbol]
  );

  const availableNetworks = selectedCoin?.networks ?? [];

  /* choose first available network when coin changes */
  useEffect(() => {
    if (availableNetworks.length) {
      setSelectedNetwork((prev) => {
        const stillExists = prev && availableNetworks.some((n) => n.name === prev.name);
        return stillExists ? prev : availableNetworks[0];
      });
    } else {
      setSelectedNetwork(null);
    }
  }, [availableNetworks]);

  /* fetch deposit address when symbol or network changes */
  useEffect(() => {
    if (!selectedNetwork?.name || !selectedSymbol) return;
    setCopied(false);
    getAddress(setAddress, selectedSymbol, selectedNetwork.name, setLoading);
  }, [selectedNetwork?.name, selectedSymbol]);

  /* filtering */
  const filteredCoins = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coins;
    return coins.filter(
      (c) =>
        c.symbol.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
    );
  }, [coins, query]);

  /* copy full address, show short on screen */
  const handleCopy = useCallback(async () => {
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
    } catch {
    }
  }, [address]);

  return (
    <div className="w-full items-center flex h-[100vh] justify-center flex-col" style={{ backgroundColor: BG_PAGE }}>
      {/* Outer card */}
      <div
        className=" max-w-5xl  rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        style={{ backgroundColor: BG_PANEL, border: `1px solid ${BORDER}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-[28px] font-semibold text-white">
            {t("header.title")}
          </h1>
          <div className="flex items-center gap-2">
            <button
              title={t("actions.deposit")}
              className="w-9 h-9 rounded-xl transition inline-flex items-center justify-center"
              style={{
                backgroundColor: "rgba(44,168,180,0.18)",
                border: `1px solid ${BORDER}`,
              }}
              type="button"
            >
              <ArrowDownToLine size={18} color={ACCENT} />
            </button>
            <Link href="/withdraw">
              <button
                title={t("actions.withdraw")}
                className="w-9 h-9 rounded-xl transition inline-flex items-center justify-center"
                style={{
                  backgroundColor: BG_PANEL_SOFT,
                  border: `1px solid ${BORDER}`,
                }}
                type="button"
              >
                <ArrowUpToLine size={18} color={ACCENT} />
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
              className="w-full px-4 py-3 transition flex items-center justify-between rounded-2xl"
              style={{
                backgroundColor: BG_PANEL_SOFT,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="text-[11px] font-semibold tracking-wide"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
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
                color={ACCENT}
              />
            </button>

            {coinMenuOpen && (
              <div
                className="absolute mt-2 w-full rounded-2xl overflow-hidden z-50 shadow-2xl"
                style={{ backgroundColor: BG_PANEL, border: `1px solid ${BORDER}` }}
              >
                {/* sticky search */}
                <div
                  className="sticky top-0 px-3 py-2 flex items-center gap-2"
                  style={{
                    backgroundColor: BG_PANEL_SOFT,
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  <Search size={16} style={{ color: "rgba(255,255,255,0.7)" }} />
                  <input
                    type="text"
                    placeholder={t("inputs.search.placeholder")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/50"
                  />
                </div>
                <div className="max-h-72 overflow-y-auto" style={{ borderColor: BORDER }}>
                  {filteredCoins.map((coin) => (
                    <button
                      key={coin.symbol}
                      onClick={() => {
                        setSelectedSymbol(coin.symbol);
                        setCoinMenuOpen(false);
                      }}
                      className="w-full px-3 py-2.5 transition flex items-center gap-2 text-left hover:bg-white/5"
                    >
                      <img
                        width={20}
                        height={20}
                        src={`/assets/${coin.symbol.toLowerCase()}.png`}
                        alt={coin.name}
                        className="rounded-full"
                      />
                      <span className="text-white/90 text-sm">
                        {coin.name} <span style={{ color: "rgba(255,255,255,0.55)" }}>({coin.symbol})</span>
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
                className="w-full px-4 py-3 transition flex items-center justify-between rounded-2xl"
                style={{
                  backgroundColor: BG_PANEL_SOFT,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="text-[11px] font-semibold tracking-wide"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
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
                  color={ACCENT}
                />
              </button>

              {availableNetworks.length > 1 && networkMenuOpen && (
                <div
                  className="absolute mt-2 w-full rounded-2xl overflow-hidden z-50 shadow-2xl"
                  style={{ backgroundColor: BG_PANEL, border: `1px solid ${BORDER}` }}
                >
                  <div className="max-h-64 overflow-y-auto">
                    {availableNetworks.map((net) => (
                      <button
                        key={net.name}
                        onClick={() => {
                          setSelectedNetwork(net);
                          setNetworkMenuOpen(false);
                        }}
                        className="w-full px-3 py-2.5 transition text-left hover:bg-white/5"
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

        {/* Content */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(300px,360px)_1fr]">
          {/* Left: QR & address */}
          <div
            className="rounded-2xl p-4 md:p-5"
            style={{ backgroundColor: BG_PANEL_SOFT, border: `1px solid ${BORDER}` }}
          >
            {loading ? (
              <div className="h-[120px] flex items-center justify-center">
                <Loader2 className="animate-spin" size={22} style={{ color: "rgba(255,255,255,0.7)" }} />
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
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 active:scale-[0.98] transition disabled:opacity-50"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: `1px solid ${BORDER}`,
                      color: ACCENT,
                    }}
                    aria-label={copied ? "Copied" : "Copy address"}
                    data-tooltip-id="amount-tooltip"
                    data-tooltip-content={copied ? "Copied" : "Copy"}
                  >
                    {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                    <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <span
                    className="flex-1 truncate text-sm font-medium font-mono"
                    style={{ color: "rgba(255,255,255,0.92)" }}
                    title={address}
                  >
                    {shortAddress(address)}
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
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>{selectedSymbol}</span>
                  </>
                }
              />
              <GlassStat
                label={t("stats.arrivalAfter.label")}
                value={
                  <>
                    {selectedNetwork.confirmations}
                    {nbsp}
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("stats.confirmations.suffix")}
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

/* Stat tile */
function GlassStat({ label, value }) {
  return (
    <div
      className="rounded-2xl px-4 py-3"
      style={{
        backgroundColor: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(6px)",
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="flex items-center gap-3">
        <span className="flex-1 min-w-0 truncate text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
          {label}
        </span>
        <span className="text-sm font-semibold whitespace-nowrap tabular-nums text-white">
          {value}
        </span>
      </div>
    </div>
  );
}
