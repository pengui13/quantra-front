"use client";
import Modal from "react-modal";
import { UnStake, GetStakeAssets } from "../../../../api/ApiWrapper";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X, LogOut, AlertCircle, Clock } from "lucide-react";

export default function UnStakeModal({ opened, open, symbol, setAssets }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleUnStake() {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    await UnStake(symbol, amount, setError);
    setIsLoading(false);
  }

  useEffect(() => {
    if (error === null) {
      GetStakeAssets(setAssets);
      open(false);
      setError("");
      setAmount("");
    }
  }, [error, open, setAssets]);

  const handleClose = () => {
    open(false);
    setError("");
    setAmount("");
  };

  return (
    <Modal
      isOpen={opened}
      onRequestClose={handleClose}
      contentLabel="Unstake Modal"
      className="!outline-none"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex !outline-none justify-center items-center z-[10004]"
      style={{
        content: {
          position: "relative",
          maxWidth: "500px",
          width: "90%",
          margin: "0 auto",
          padding: 0,
          border: "1px solid rgba(54, 198, 224, 0.2)",
          borderRadius: "16px",
          background: "rgb(0, 0, 0)",
          boxShadow: "0 20px 60px rgba(54, 198, 224, 0.1)",
        },
      }}
    >
      <div className="flex flex-col h-full p-6 gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/50">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-white">Unstake {symbol}</h2>
              <p className="text-xs text-gray-400">Withdraw your staked crypto</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[#36C6E0]/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-[#36C6E0]" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#36C6E0]/10" />

        {/* Content */}
        <div className="flex flex-col gap-6">
          {/* Asset Display */}
          <div className="bg-black border border-[#36C6E0]/20 rounded-xl p-4 hover:border-[#36C6E0]/40 transition-colors">
            <span className="text-xs font-semibold text-gray-400 block mb-2">Asset</span>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#36C6E0]/10 rounded-lg">
                <Image
                  src={`/assets/${symbol.toLowerCase()}.png`}
                  width={32}
                  height={32}
                  alt={`${symbol} logo`}
                />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{symbol}</p>
                <p className="text-gray-500 text-xs">Staked balance</p>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <label className={`text-xs font-semibold transition-colors ${
              error ? "text-red-400" : "text-gray-400"
            }`}>
              Unstaking Amount
            </label>
            <div className={`bg-black border rounded-xl px-4 py-3 flex items-center gap-2 transition-colors ${
              error ? "border-red-400/50 bg-red-400/5" : "border-[#36C6E0]/20 hover:border-[#36C6E0]/40"
            }`}>
              <input
                type="number"
                placeholder="0.00"
                className="w-full outline-none bg-transparent font-bold text-white placeholder-gray-600 text-lg"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  if (error) setError("");
                }}
                disabled={isLoading}
              />
              <span className="text-gray-400 font-semibold text-sm">{symbol}</span>
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-1">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-red-400 font-semibold text-xs">{error}</span>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Processing Time */}
            <div className="bg-black border border-[#36C6E0]/20 rounded-lg p-3 hover:border-[#36C6E0]/40 transition-colors">
              <div className="flex items-center gap-1 mb-2">
                <Clock className="w-3 h-3 text-[#36C6E0]" />
                <p className="text-gray-500 text-xs font-medium">Processing</p>
              </div>
              <p className="text-white font-bold text-sm">Instant</p>
              <p className="text-gray-600 text-xs mt-1">Immediate unstaking</p>
            </div>

            {/* Penalties */}
            <div className="bg-black border border-red-500/20 rounded-lg p-3 hover:border-red-500/40 transition-colors">
              <p className="text-gray-500 text-xs font-medium mb-2">Penalties</p>
              <p className="text-red-400 font-bold text-sm">None</p>
              <p className="text-gray-600 text-xs mt-1">No withdrawal fee</p>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white mb-1">Important Notice</p>
              <p className="text-xs text-gray-400">Once you unstake, you will stop earning rewards on the unstaked amount. The amount will be transferred to your wallet immediately.</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#36C6E0]/10" />

        {/* Footer Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleUnStake}
            disabled={isLoading || !amount}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              isLoading || !amount
                ? "bg-red-500/30 text-white cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Unstaking...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Unstake {symbol}
              </>
            )}
          </button>

          <button
            onClick={handleClose}
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold border border-[#36C6E0]/20 text-[#36C6E0] hover:border-[#36C6E0]/50 hover:bg-[#36C6E0]/5 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}