"use client";
import Modal from "react-modal";
import { UnStake, GetStakeAssets } from "../../../../api/ApiWrapper";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ArrowDownToLine } from "lucide-react"; // ✅ Lucide Icons

export default function UnStakeModal({ opened, open, symbol, setAssets }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  async function handleUnStake() {
    await UnStake(symbol, amount, setError);
  }

  useEffect(() => {
    if (error === null) {
      GetStakeAssets(setAssets);
      open(false);
      setError("");
    }
  }, [error]);

  return (
    <Modal
      isOpen={opened}
      onRequestClose={() => {
        open(false), setError("");
      }}
      contentLabel="Unstake Modal"
      className="w-[500px] flex gap-4 !outline-none flex-col bg-bkg justify-between rounded-2xl p-7"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex !outline-none justify-center items-center z-[10004]"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h5 className="font-semibold text-2xl text-bl flex items-center gap-2">
          <ArrowDownToLine className="w-5 h-5 text-root-green" />
          Unstake
        </h5>
        <button
          onClick={() => {
            open(false), setError("");
          }}
          className="flex items-center justify-center w-7 h-7 bg-log-bkg rounded-full"
        >
          <X className="w-4 h-4 text-gr" /> {/* ✅ Lucide Close Icon */}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[30px] w-full">
        {/* Asset Info */}
        <div className="w-full bg-log-bkg rounded-xl px-4 py-2 flex justify-between">
          <div className="flex flex-col">
            <span className="font-medium text-xs text-gr">Asset</span>
            <div className="flex items-center gap-2">
              <Image
                src={`/assets/${symbol.toLowerCase()}.png`}
                width={24}
                height={24}
                alt={`${symbol} logo`}
              />
              <span className="font-medium text-bl">{symbol}</span>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-1">
          <div className="w-full bg-log-bkg rounded-xl px-4 py-2 flex justify-between">
            <div className="flex flex-col w-full">
              <span
                className={`font-medium text-xs ${
                  error ? "text-root-red" : "text-gr"
                }`}
              >
                Amount
              </span>
              <input
                type="text"
                className="w-full h-full outline-none bg-log-bkg font-medium text-bl"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
          </div>
          {error && (
            <span className="text-root-red ml-4 font-semibold text-xs">
              {error}
            </span>
          )}
        </div>
      </div>

      {/* Footer Button */}
      <button
        onClick={handleUnStake}
        className="w-[444px] h-[46px] rounded-xl text-sm font-semibold bg-root-green-8 text-root-green"
      >
        Unstake
      </button>
    </Modal>
  );
}
