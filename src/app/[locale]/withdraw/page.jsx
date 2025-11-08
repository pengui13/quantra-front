"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  IsEnough,
  DepositPortfolio,
  WithdrawToAddress,
  validateWallet,
} from "../../../../api/ApiWrapper";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  ChevronDown,
  Search,
  ArrowDownToLine,
  ArrowUpToLine,
  Loader2,
} from "lucide-react";

const Decimal = require("decimal.js");

/* --- Theme like Deposit -------------------------------------------------- */
const ACCENT = "#2CA8B4";
const BG_PAGE = "#0b0b0e";
const BG_PANEL = "#101217";
const BG_PANEL_SOFT = "#12141a";
const BORDER = "rgba(255,255,255,0.08)";

export default function Withdraw() {
  const t = useTranslations("withdraw");
  const locale = useLocale() || "de-DE";
  const nf = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 8 }),
    [locale]
  );
  const searchParams = useSearchParams();
  const deepLinkSymbol = searchParams.get("key") || undefined;

  // portfolio
  const [coins, setCoins] = useState([]);
  const [query, setQuery] = useState("");

  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  // form
  const [addressTo, setAddressTo] = useState("");
  const [amount, setAmount] = useState("");
  const [validAddress, setValidAddress] = useState(null);
  const [isEnough, setIsEnough] = useState(null);
  const [fee, setFee] = useState("0");
  const [minWithdrawal, setMinWithdrawal] = useState("0");

  // tx result
  const [txSuccess, setTxSuccess] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  /* ---- load portfolio once ---- */
  useEffect(() => {
    DepositPortfolio((list) => {
      if (Array.isArray(list)) setCoins(list);
      else setCoins([]);
    });
  }, []);

  /* ---- init symbol ---- */
  useEffect(() => {
    if (!coins.length) return;
    const sym = deepLinkSymbol || coins[0].symbol;
    setSelectedSymbol(sym);
  }, [coins, deepLinkSymbol]);

  /* --- filtered coins --- */
  const filteredCoins = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coins;
    return coins.filter((c) => {
      const sym = (c.symbol || "").toString().toLowerCase();
      const name = (c.full_name || c.name || "").toString().toLowerCase();
      return sym.includes(q) || name.includes(q);
    });
  }, [coins, query]);

  /* --- current coin & networks --- */
  const currentCoin = useMemo(
    () => coins.find((c) => c.symbol === selectedSymbol) || null,
    [coins, selectedSymbol]
  );
  const networks =
    currentCoin && currentCoin.networks ? currentCoin.networks : [];

  /* --- pick network when coin changes --- */
  useEffect(() => {
    if (networks.length) {
      setSelectedNetwork((prev) => {
        if (prev && networks.some((n) => n.name === prev.name)) return prev;
        return networks[0];
      });
    } else {
      setSelectedNetwork(null);
    }
  }, [networks]);

  /* --- pick min & fee from network --- */
  useEffect(() => {
    if (!selectedNetwork) return;
    setMinWithdrawal(
      selectedNetwork.min_withdrawal_amount
        ? String(selectedNetwork.min_withdrawal_amount)
        : "0"
    );
    setFee(selectedNetwork.fee ? String(selectedNetwork.fee) : "0");
  }, [selectedNetwork]);

  /* --- handlers ---------------------------------------------------- */
  const handleAmountChange = (e) => {
    const numericValue = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/\.(?=.*\.)/g, "");
    setAmount(numericValue);
    setIsEnough(null);
  };

  const handleValidate = () => {
    if (!selectedSymbol || !selectedNetwork || !selectedNetwork.name) return;
    // validate address
    validateWallet(
      selectedSymbol,
      selectedNetwork.name,
      addressTo,
      setValidAddress
    );
    // check balance
    const amountToSend = Decimal(amount || 0).plus(fee || 0);
    IsEnough(selectedSymbol, amountToSend, setIsEnough);
  };

  // if both ok → withdraw
  useEffect(() => {
    if (validAddress && isEnough) {
      doWithdraw();
    }
  }, [validAddress, isEnough]);

  const doWithdraw = () => {
    if (!selectedNetwork || !selectedSymbol) return;
    const amountToSend = Decimal(amount || 0).plus(fee || 0);
    setWithdrawing(true);
    setTxSuccess(null);
    WithdrawToAddress(
      selectedNetwork,
      selectedSymbol,
      amountToSend,
      addressTo,
      (res) => {
        setTxSuccess(res);
        setWithdrawing(false);
      }
    );
  };

  const formatAmount = useCallback(
    (v) => {
      const n = Number(v);
      if (Number.isNaN(n)) return v ?? "";
      const trimmed = parseFloat(n.toFixed(8));
      return nf.format(trimmed);
    },
    [nf]
  );

  /* --- success/fail screen --- */
  if (txSuccess !== null) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center"
        style={{ backgroundColor: BG_PAGE }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-6 items-center"
          style={{ backgroundColor: BG_PANEL, border: `1px solid ${BORDER}` }}
        >
          {txSuccess === false ? (
            <>
              <Image
                src="/assets/icons/failed.svg"
                width={64}
                height={64}
                alt=""
              />
              <p className="text-white text-lg font-semibold">
                {t("txFailed")}
              </p>
              <button
                onClick={() => {
                  setTxSuccess(null);
                  setValidAddress(null);
                  setIsEnough(null);
                }}
                className="w-full py-3 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: ACCENT, color: "#fff" }}
              >
                {t("repAg")}
              </button>
            </>
          ) : (
            <>
              <Image
                src="/assets/icons/success.svg"
                width={64}
                height={64}
                alt=""
              />
              <p className="text-white text-lg font-semibold">
                {t("currentlyInProcess")}
              </p>
              <Link href="/dashboard" className="w-full">
                <button className="w-full py-3 rounded-xl text-sm font-semibold bg-white/10 text-white">
                  {t("continuewSaving")}
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  /* --- main withdraw screen --- */
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center py-10"
      style={{ backgroundColor: BG_PAGE }}
    >
      <div
        className="max-w-5xl w-full rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        style={{ backgroundColor: BG_PANEL, border: `1px solid ${BORDER}` }}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-[28px] font-semibold text-white">
            {t("header.title")}
          </h1>
          <div className="flex items-center gap-2">
            <Link href="/deposit">
              <button
                title={t("actions.deposit")}
                className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
                style={{
                  backgroundColor: BG_PANEL_SOFT,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <ArrowDownToLine size={18} color={ACCENT} />
              </button>
            </Link>
            <button
              title={t("actions.withdraw")}
              className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
              style={{
                backgroundColor: "rgba(44,168,180,0.18)",
                border: `1px solid ${BORDER}`,
              }}
            >
              <ArrowUpToLine size={18} color={ACCENT} />
            </button>
          </div>
        </div>

        {/* controls (coin + network) */}
        <div className="grid gap-4 mb-6">
          {/* coin */}
          <div className="relative">
            <div
              className="w-full px-4 py-3 flex items-center justify-between rounded-2xl"
              style={{
                backgroundColor: BG_PANEL_SOFT,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="text-[11px] font-semibold text-white/60">
                  {t("selectors.currency.label")}
                </div>
                <div className="flex items-center gap-2">
                  {selectedSymbol ? (
                    <img
                      src={`/assets/${selectedSymbol.toLowerCase()}.png`}
                      alt={selectedSymbol}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : null}
                  <span className="text-white font-medium">
                    {selectedSymbol || "—"}
                  </span>
                </div>
              </div>
              <ChevronDown size={18} color={ACCENT} />
            </div>

            {/* dropdown coins */}
            <div className="mt-2 rounded-2xl overflow-hidden">
              <div
                className="flex items-center gap-2 px-3 py-2"
                style={{ backgroundColor: BG_PANEL_SOFT, borderRadius: 12 }}
              >
                <Search size={16} className="text-white/70" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("inputs.search.placeholder")}
                  className="bg-transparent outline-none text-sm text-white placeholder:text-white/40 flex-1"
                />
              </div>
              <div
                className="max-h-40 overflow-y-auto mt-2 rounded-2xl"
                style={{ backgroundColor: BG_PANEL_SOFT }}
              >
                {filteredCoins.map((coin) => (
                  <button
                    key={coin.symbol}
                    onClick={() => setSelectedSymbol(coin.symbol)}
                    className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/5"
                  >
                    <img
                      src={`/assets/${coin.symbol.toLowerCase()}.png`}
                      width={20}
                      height={20}
                      alt={coin.symbol}
                      className="rounded-full"
                    />
                    <span className="text-white/90 text-sm">
                      {coin.full_name || coin.name}{" "}
                      <span className="text-white/40">({coin.symbol})</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* network */}
          {selectedNetwork && (
            <div className="relative">
              <div
                className="w-full px-4 py-3 flex items-center justify-between rounded-2xl"
                style={{
                  backgroundColor: BG_PANEL_SOFT,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-[11px] font-semibold text-white/60">
                    {t("selectors.network.label")}
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={`/assets/${selectedNetwork.name.toLowerCase()}.png`}
                      alt={selectedNetwork.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="text-white font-medium">
                      {selectedNetwork.name}
                    </span>
                  </div>
                </div>
              </div>
              {networks.length > 1 && (
                <div
                  className="mt-2 rounded-2xl overflow-hidden"
                  style={{ backgroundColor: BG_PANEL_SOFT }}
                >
                  {networks.map((net) => (
                    <button
                      key={net.name}
                      onClick={() => setSelectedNetwork(net)}
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/5"
                    >
                      <img
                        src={`/assets/${net.name.toLowerCase()}.png`}
                        width={20}
                        height={20}
                        alt={net.name}
                      />
                      <span className="text-white/90 text-sm">{net.name}</span>
                      <span className="text-white/40 text-xs">
                        {net.full_name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* body: left form + right info */}
        <div className="grid gap-6 xl:grid-cols-[minmax(340px,380px)_1fr]">
          {/* left form */}
          <div
            className="rounded-2xl p-4 flex flex-col gap-4"
            style={{
              backgroundColor: BG_PANEL_SOFT,
              border: `1px solid ${BORDER}`,
            }}
          >
            {/* amount */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-white/60">{t("amount")}</label>
              <input
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className={`w-full px-3 py-2 rounded-lg bg-[#0f1013] text-white outline-none ${
                  isEnough === false ? "border border-red-500" : ""
                }`}
              />
              {isEnough === false && (
                <span className="text-xs text-red-400">
                  {t("insuffFundsDescr")}
                </span>
              )}
            </div>

            {/* address */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-white/60">{t("wallet")}</label>
              <input
                value={addressTo}
                onChange={(e) => setAddressTo(e.target.value)}
                placeholder={t("invAddress")}
                className={`w-full px-3 py-2 rounded-lg bg-[#0f1013] text-white outline-none ${
                  validAddress === false ? "border border-red-500" : ""
                }`}
              />
              {validAddress === false && (
                <span className="text-xs text-red-400">
                  {t("invAddress")}
                </span>
              )}
            </div>

            {/* buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleValidate}
                disabled={!addressTo || !amount || withdrawing}
                className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ backgroundColor: ACCENT, color: "#fff" }}
              >
                {withdrawing && (
                  <Loader2 className="animate-spin" size={16} color="#fff" />
                )}
                {t("withdrawal")}
              </button>
            </div>
          </div>

          {/* right info */}
          <div className="grid gap-4 content-start">
            <GlassStat
              label={t("stats.minWithdrawal.label")}
              value={
                selectedNetwork
                  ? `${formatAmount(minWithdrawal)} ${selectedSymbol}`
                  : "—"
              }
            />
            <GlassStat
              label={t("stats.fee.label")}
              value={
                selectedNetwork
                  ? `${formatAmount(fee)} ${selectedSymbol}`
                  : "—"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* small glass stat like deposit */
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
        <span className="flex-1 min-w-0 truncate text-sm font-semibold text-white/70">
          {label}
        </span>
        <span className="text-sm font-semibold text-white whitespace-nowrap">
          {value}
        </span>
      </div>
    </div>
  );
}
