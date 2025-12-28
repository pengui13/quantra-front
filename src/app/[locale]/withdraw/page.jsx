"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Search, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { GetWithdrawAssets, ValidateAddress, Withdraw } from "../../../../api/ApiWrapper";
const Decimal = require("decimal.js");

export default function Withdrawly() {
  const [coins, setCoins] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(true);

  const [query, setQuery] = useState("");
  const [showCoinList, setShowCoinList] = useState(false);

  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [showNetworkList, setShowNetworkList] = useState(false);

  const [amount, setAmount] = useState("");
  const [addressTo, setAddressTo] = useState("");

  const [validAddress, setValidAddress] = useState(null);
  const [isEnough, setIsEnough] = useState(null);

  const [withdrawing, setWithdrawing] = useState(false);
  const [txSuccess, setTxSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load withdrawal assets
  useEffect(() => {
    setLoadingAssets(true);
    GetWithdrawAssets((data) => {
      setCoins(data);
      if (data.length > 0) setSelectedSymbol(data[0].symbol);
      setLoadingAssets(false);
    });
  }, []);

  const filteredCoins = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coins;
    return coins.filter(c => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
  }, [coins, query]);

  const currentCoin = useMemo(() => coins.find(c => c.symbol === selectedSymbol) || null, [coins, selectedSymbol]);
  const networks = currentCoin?.networks || [];
  const currentBalance = useMemo(() => new Decimal(currentCoin?.balance || 0), [currentCoin]);

  useEffect(() => {
    if (!networks.length) return setSelectedNetwork(null);
    if (!selectedNetwork) setSelectedNetwork(networks[0]);
  }, [networks, selectedNetwork]);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "").replace(/\.(?=.*\.)/g, "");
    setAmount(value);
    setIsEnough(null);
    setValidAddress(null);
  };

  const handleAddressChange = (e) => {
    setAddressTo(e.target.value);
    setValidAddress(null);
  };

  const handleValidate = () => {
    if (!selectedNetwork || !amount || !addressTo) return;

    const total = new Decimal(amount || 0);
    if (total.gt(currentBalance)) {
      setIsEnough(false);
      return;
    }

    setValidAddress(null);
    ValidateAddress(
      selectedSymbol,
      addressTo,
      selectedNetwork.name,
      (result) => {
        if (result.valid) {
          setValidAddress(true);
          setIsEnough(true);
          doWithdraw();
        } else {
          setValidAddress(false);
          setIsEnough(null);
        }
      },
      (error) => {
        console.error("Address validation error:", error);
        setValidAddress(false);
        setIsEnough(null);
      }
    );
  };

  const doWithdraw = () => {
    if (!selectedNetwork || !amount || !addressTo || !selectedSymbol) return;

    setWithdrawing(true);
    setTxSuccess(null);
    setErrorMessage(null);
// Correct usage
Withdraw(
  selectedSymbol,     // symbol
  addressTo,          // address
  selectedNetwork.name, // network
  amount,             // amount
  (response) => {     // onSuccess
    setTxSuccess(true);
    setWithdrawing(false);
    setAmount("");
    setAddressTo("");
    setValidAddress(null);
    setIsEnough(null);
  },
  (error) => {        // onError
    console.error("Withdrawal error:", error);
    setTxSuccess(false);
    setWithdrawing(false);
    setErrorMessage(error?.message || "Withdrawal failed");
  }
);

  };

  if (txSuccess !== null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="mb-6">
            {txSuccess ? (
              <CheckCircle size={64} className="text-[#36C6E0] mx-auto" />
            ) : (
              <AlertCircle size={64} className="text-red-500 mx-auto" />
            )}
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            {txSuccess ? "Withdrawal Submitted" : "Withdrawal Failed"}
          </h2>
          <p className="text-gray-400 mb-8">
            {txSuccess
              ? "Your withdrawal is being processed. You'll receive the funds shortly."
              : "Something went wrong. Please try again."}
          </p>
          <button
            onClick={() => {
              setTxSuccess(null);
              setAmount("");
              setAddressTo("");
              setValidAddress(null);
              setIsEnough(null);
            }}
            className="w-full py-3 bg-[#36C6E0] text-black font-semibold rounded-lg hover:scale-105 transition-transform"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (loadingAssets) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#36C6E0] mx-auto mb-4" />
          <p className="text-gray-400">Loading withdrawal assets...</p>
        </div>
      </div>
    );
  }

  if (!coins.length) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">No withdrawal assets available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Withdraw</h1>
          <p className="text-gray-400">Send your crypto to any address</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Coin Selector */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-3">Select Coin</label>
            <button
              onClick={() => setShowCoinList(!showCoinList)}
              className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-800 rounded-lg flex items-center justify-between hover:border-gray-700 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`/assets/${currentCoin?.symbol.toLowerCase()}.png`}
                  alt={currentCoin?.symbol}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <span className="font-semibold">{currentCoin?.name} ({currentCoin?.symbol})</span>
              </div>
              <ChevronDown size={18} className="text-gray-600" />
            </button>

            {showCoinList && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d0d] border border-gray-800 rounded-lg z-10 overflow-hidden">
                <div className="p-3 border-b border-gray-800">
                  <div className="flex items-center gap-2 bg-black rounded px-3 py-2">
                    <Search size={16} className="text-gray-600" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search"
                      className="bg-transparent outline-none text-sm flex-1"
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredCoins.map((c) => (
                    <button
                      key={c.symbol}
                      onClick={() => {
                        setSelectedSymbol(c.symbol);
                        setShowCoinList(false);
                        setQuery("");
                      }}
                      className="w-full px-4 py-3 hover:bg-[#1a1a1a] text-left transition-colors border-b border-gray-900 last:border-0 flex items-center gap-3"
                    >
                      <img
                        src={`/assets/${c.symbol.toLowerCase()}.png`}
                        alt={c.symbol}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <div className="flex-1 flex justify-between min-w-0">
                        <span className="font-semibold">{c.name}</span>
                        <span className="text-gray-400 text-sm ml-2">{c.balance} {c.symbol}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Network Selector */}
          {networks.length > 1 ? (
            <div className="relative">
              <label className="block text-sm text-gray-400 mb-3">Select Network</label>
              <button
                onClick={() => setShowNetworkList(!showNetworkList)}
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-800 rounded-lg flex items-center justify-between hover:border-gray-700 transition-colors text-left"
              >
                <span className="font-semibold">{selectedNetwork?.name || "Select network"}</span>
                <ChevronDown size={18} className="text-gray-600" />
              </button>

              {showNetworkList && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d0d] border border-gray-800 rounded-lg z-10">
                  {networks.map((n) => (
                    <button
                      key={n.name}
                      onClick={() => {
                        setSelectedNetwork(n);
                        setShowNetworkList(false);
                        setValidAddress(null);
                        setIsEnough(null);
                      }}
                      className={`w-full px-4 py-3 text-left transition-colors border-b border-gray-900 last:border-0 font-semibold ${
                        selectedNetwork?.name === n.name
                          ? "bg-[#36C6E0] text-black"
                          : "hover:bg-[#1a1a1a]"
                      }`}
                    >
                      {n.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm text-gray-400 mb-3">Network</label>
              <div className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-800 rounded-lg text-left">
                <span className="font-semibold">{selectedNetwork?.name}</span>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-gray-400">Amount</label>
              <span className="text-xs text-gray-500">Balance: {currentBalance.toString()} {selectedSymbol}</span>
            </div>
            <input
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-800 rounded-lg focus:outline-none focus:border-[#36C6E0] transition-colors"
            />
          </div>

          {/* Fee Info */}
          {selectedNetwork && amount && (
            <div className="p-3 bg-[#0d0d0d] border border-gray-800 rounded-lg text-sm">
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Fee</span>
                <span>0 {selectedSymbol}</span>
              </div>
              <div className="flex justify-between border-t border-gray-800 pt-2">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-semibold">{new Decimal(amount || 0).toString()} {selectedSymbol}</span>
              </div>
            </div>
          )}

          {/* Address Input */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">Recipient Address</label>
            <div className="relative">
              <input
                value={addressTo}
                onChange={handleAddressChange}
                placeholder="Enter wallet address"
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-800 rounded-lg focus:outline-none focus:border-[#36C6E0] transition-colors pr-10"
              />
              {validAddress === true && (
                <CheckCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#36C6E0]" />
              )}
              {validAddress === false && (
                <AlertCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
              )}
              {validAddress === null && addressTo && (
                <Loader2 size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
              )}
            </div>
          </div>

          {/* Validation Messages */}
          {isEnough === false && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
              Insufficient balance for this withdrawal
            </div>
          )}
          {isEnough === true && validAddress === true && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-400">
              Ready to withdraw
            </div>
          )}
          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          {/* Withdraw Button */}
          <button
            onClick={handleValidate}
            disabled={withdrawing || !selectedNetwork || !amount || !addressTo}
            className="w-full py-3 bg-[#36C6E0] text-black font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {withdrawing && <Loader2 size={18} className="animate-spin" />}
            {withdrawing ? "Processing" : "Withdraw"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-8">
          Make sure the address belongs to you. Transfers cannot be reversed.
        </p>
      </div>
    </div>
  );
}
