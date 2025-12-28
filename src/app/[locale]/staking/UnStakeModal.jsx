import Modal from "react-modal";
import { UnStake, GetStakeAssets } from "../../../../api/ApiWrapper";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X, LogOut, AlertCircle, Clock } from "lucide-react";

export default function UnStakeModal({ opened, open, symbol, setAssets }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetState = () => {
    setAmount("");
    setError(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    open(false);
    resetState();
  };

  const handleUnStake = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await UnStake(symbol, amount);
      await GetStakeAssets(setAssets);
      handleClose(); // Only close on SUCCESS
    } catch (err) {
      setError(err.message || "Unstake failed");
      setIsLoading(false);
      // Modal stays open to show the error
    }
  };

  useEffect(() => {
    if (!opened) resetState();
  }, [opened]);

  return (
    <Modal
      isOpen={opened}
      onRequestClose={handleClose}
      contentLabel="Unstake Modal"
      className="!outline-none"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10004]"
      style={{
        content: {
          position: "relative",
          maxWidth: "500px",
          width: "90%",
          padding: 0,
          border: "1px solid rgba(54, 198, 224, 0.2)",
          borderRadius: "16px",
          background: "#000",
          boxShadow: "0 20px 60px rgba(54, 198, 224, 0.1)",
        },
      }}
    >
      <div className="flex flex-col p-6 gap-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/50">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Unstake {symbol}</h2>
              <p className="text-xs text-gray-400">Withdraw your staked crypto</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-[#36C6E0]/10">
            <X className="w-5 h-5 text-gray-400 hover:text-[#36C6E0]" />
          </button>
        </div>

        <div className="h-px bg-[#36C6E0]/10" />

        {/* Asset */}
        <div className="border border-[#36C6E0]/20 rounded-xl p-4">
          <span className="text-xs text-gray-400 font-semibold block mb-2">Asset</span>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#36C6E0]/10 rounded-lg">
              <Image src={`/assets/${symbol.toLowerCase()}.png`} width={32} height={32} alt={symbol} />
            </div>
            <div>
              <p className="text-white font-bold">{symbol}</p>
              <p className="text-xs text-gray-500">Staked balance</p>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-2">
          <label className={`text-xs font-semibold ${error ? "text-red-400" : "text-gray-400"}`}>
            Unstaking Amount
          </label>
          <div className={`border rounded-xl px-4 py-3 flex gap-2 ${error ? "border-red-400/50 bg-red-400/5" : "border-[#36C6E0]/20"}`}>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError(null);
              }}
              placeholder="0.00"
              disabled={isLoading}
              className="w-full bg-transparent text-white text-lg font-bold outline-none"
            />
            <span className="text-gray-400 font-semibold">{symbol}</span>
          </div>
          {error && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400 font-semibold">{error}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-[#36C6E0]/20 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-[#36C6E0]" />
              <span className="text-xs text-gray-500">Processing</span>
            </div>
            <p className="text-white font-bold text-sm">Instant</p>
          </div>
          <div className="border border-red-500/20 rounded-lg p-3">
            <span className="text-xs text-gray-500">Penalties</span>
            <p className="text-sm font-bold text-red-400">None</p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-xs text-gray-400">
            Once you unstake, rewards stop immediately and funds return to your wallet.
          </p>
        </div>

        <div className="h-px bg-[#36C6E0]/10" />

        {/* Actions */}
        <button
          onClick={handleUnStake}
          disabled={isLoading || !amount}
          className={`w-full py-3 rounded-xl font-semibold flex justify-center gap-2 ${
            isLoading ? "bg-red-500/30 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 active:scale-95"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          className="w-full py-3 rounded-xl border border-[#36C6E0]/20 text-[#36C6E0] hover:bg-[#36C6E0]/5"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}