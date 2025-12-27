"use client";
import "../globals.css";

import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import StakeModal from "./StakeModal";
import UnStakeModal from "./UnStakeModal";
import {
  GetStakeAssets,
  GetTotalReward,
  GetStakingTx,
  GetPending,
} from "../../../../api/ApiWrapper";
import { useEffect, useState } from "react";
import {
  MoreVertical,
  Coins,
  Wallet,
  ArrowUpDown,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

function formatTimestamp(isoTimestamp) {
  const date = new Date(isoTimestamp);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}

const Dropdown = ({
  isVisible,
  onMouseLeave,
  symbol,
  handleStakeButton,
  handleUnStakeButton,
}) => (
  <div
    className={`absolute bg-black rounded-lg border border-[#36C6E0]/20 shadow-2xl ${
      isVisible ? "block" : "hidden"
    }`}
    style={{ zIndex: 1000 }}
    onMouseLeave={onMouseLeave}
  >
    <ul className="p-2 w-[160px]">
      <li
        onClick={() => handleStakeButton(symbol)}
        className="hover:bg-[#36C6E0]/10 rounded-lg flex flex-col items-start cursor-pointer transition-colors"
      >
        <span className="font-medium text-white px-4 py-2 text-sm">Stake</span>
      </li>
      <li
        onClick={() => handleUnStakeButton(symbol)}
        className="hover:bg-[#36C6E0]/10 rounded-lg flex flex-col items-start cursor-pointer transition-colors"
      >
        <span className="font-medium text-white px-4 py-2 text-sm">Unstake</span>
      </li>
      <Link href={`/deposit?key=${symbol}`}>
        <li className="hover:bg-[#36C6E0]/10 rounded-lg flex flex-col items-start cursor-pointer transition-colors">
          <span className="font-medium text-white px-4 py-2 text-sm">Deposit</span>
        </li>
      </Link>
      <Link href={`/spot?key=${symbol}`}>
        <li className="hover:bg-[#36C6E0]/10 rounded-lg flex flex-col items-start cursor-pointer transition-colors">
          <span className="font-medium text-white px-4 py-2 text-sm">Go To Market</span>
        </li>
      </Link>
    </ul>
  </div>
);

export default function StakingPage({ balance = { staked_balance: 0 } }) {
  const [stakeAssets, setStakeAssets] = useState([]);
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);
  const [reward, setReward] = useState("");
  const [openedStake, openStake] = useState(false);
  const [openedUnStake, openUnStake] = useState(false);
  const [token, setToken] = useState("");
  const [tx, setTx] = useState({});
  const [pending, setPending] = useState([]);

  useEffect(() => {
    GetStakingTx(setTx);
    GetPending(setPending);
    GetTotalReward(setReward);
    GetStakeAssets(setStakeAssets);
  }, []);

  const handleMouseEnter = (index) => setVisibleDropdownIndex(index);
  const handleMouseLeave = () => setVisibleDropdownIndex(null);
  const handleStakeButton = (symbol) => {
    openStake(true);
    setToken(symbol);
  };
  const handleUnStakeButton = (symbol) => {
    openUnStake(true);
    setToken(symbol);
  };

  return (
    <div className="bg-black min-h-screen">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="flex max-w-[1440px] px-4 w-full flex-col py-20 items-center justify-center mx-auto gap-8">
        {/* Header */}
        <div className="flex flex-col w-full gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#36C6E0]/20 rounded-lg border border-[#36C6E0]/50">
              <TrendingUp className="w-6 h-6 text-[#36C6E0]" />
            </div>
            <h1 className="font-bold text-3xl text-white">Staking</h1>
          </div>
          <p className="text-gray-400 text-sm">Earn rewards by staking your crypto assets</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Total Staked Balance */}
          <div className="bg-black rounded-xl border border-[#36C6E0]/20 p-6 hover:border-[#36C6E0]/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Total Staked
              </span>
              <Wallet className="w-5 h-5 text-[#36C6E0]" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-2xl text-white">
                {balance.staked_balance || "0"} USD
              </span>
              <span className="text-xs text-gray-500">Current staking balance</span>
            </div>
          </div>

          {/* Total Rewards */}
          <div className="bg-black rounded-xl border border-[#36C6E0]/20 p-6 hover:border-[#36C6E0]/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                <Coins className="w-4 h-4" /> Total Rewards
              </span>
              <Coins className="w-5 h-5 text-[#36C6E0]" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-2xl text-white">
                {parseFloat(reward || "0").toFixed(2)} USD
              </span>
              <span className="text-xs text-gray-500">Lifetime rewards earned</span>
            </div>
          </div>
        </div>

        {/* Staking Assets */}
        <div className="w-full rounded-2xl border border-[#36C6E0]/20 bg-black p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#36C6E0]/20 rounded-lg">
              <Coins className="w-5 h-5 text-[#36C6E0]" />
            </div>
            <h2 className="text-white text-xl font-semibold">Staking Assets</h2>
          </div>

          {/* Mobile Cards */}
          <div className="flex items-center overflow-x-auto w-full overflow-y-hidden lg:hidden gap-3 pb-2">
            {stakeAssets.map((item, index) => {
              const network = item.networks?.[0] || {};
              return (
                <div
                  className="min-w-[300px] p-5 flex flex-col items-start bg-black rounded-xl justify-start w-full gap-4 border border-[#36C6E0]/20 hover:border-[#36C6E0]/50 transition-colors"
                  key={index}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Image
                        width={36}
                        height={36}
                        className="rounded-full"
                        src={`/assets/${item.symbol.toLowerCase()}.png`}
                        alt={item.symbol}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-white">{item.symbol}</span>
                        <span className="text-xs text-gray-500">{item.full_name}</span>
                      </div>
                    </div>
                    <div
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button className="p-2 hover:bg-[#36C6E0]/10 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-[#36C6E0]/70" />
                      </button>
                      {visibleDropdownIndex === index && (
                        <Dropdown
                          isVisible={visibleDropdownIndex === index}
                          onMouseLeave={handleMouseLeave}
                          symbol={item.symbol}
                          handleStakeButton={handleStakeButton}
                          handleUnStakeButton={handleUnStakeButton}
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full text-sm">
                    <div>
                      <p className="text-gray-500 text-xs font-medium mb-1">Estimated APR</p>
                      <span className="text-emerald-400 font-bold text-sm">
                        {network.apr_low?.toFixed(2)}-{network.apr_high?.toFixed(2)}%
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-medium mb-1">Est. Value</p>
                      <span className="text-white font-bold text-sm">
                        ${item.value ? parseFloat(item.value).toFixed(2) : "0.00"}
                      </span>
                    </div>
                  </div>

                  <div className="w-full border-t border-[#36C6E0]/10 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 text-xs">Staked Balance</span>
                      <span className="text-white font-semibold text-sm">
                        {item.quantity || 0} {item.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 text-xs">Total Rewards</span>
                      <span className="text-[#36C6E0] font-semibold text-sm">
                        {item.total_reward || 0} {item.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">Available Balance</span>
                      <span className="text-white font-semibold text-sm">
                        {item.avail || 0} {item.symbol}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#36C6E0]/10">
                  <th className="text-left text-gray-400 font-semibold text-sm py-4 px-4">Asset</th>
                  <th className="text-left text-gray-400 font-semibold text-sm py-4 px-4">Estimated APR</th>
                  <th className="text-left text-gray-400 font-semibold text-sm py-4 px-4">Staked Balance</th>
                  <th className="text-left text-gray-400 font-semibold text-sm py-4 px-4">Est. Value</th>
                  <th className="text-left text-gray-400 font-semibold text-sm py-4 px-4">Total Rewards</th>
                  <th className="text-left text-gray-400 font-semibold text-sm py-4 px-4">Available Balance</th>
                  <th className="text-left text-gray-400 font-semibold text-sm py-4 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {stakeAssets.map((item, index) => {
                  const network = item.networks?.[0] || {};
                  return (
                    <tr
                      key={index}
                      className="border-b border-[#36C6E0]/10 hover:bg-[#36C6E0]/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Image
                            width={36}
                            height={36}
                            className="rounded-full"
                            src={`/assets/${item.symbol.toLowerCase()}.png`}
                            alt={item.symbol}
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-white">{item.symbol}</span>
                            <span className="text-xs text-gray-500">{item.full_name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-emerald-400 font-bold text-sm">
                          {network.apr_low?.toFixed(2)}-{network.apr_high?.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold text-sm">
                          {item.quantity || 0} {item.symbol}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold text-sm">
                          ${item.value ? parseFloat(item.value).toFixed(2) : "0.00"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[#36C6E0] font-semibold text-sm">
                          {item.total_reward || 0} {item.symbol}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold text-sm">
                          {item.avail || 0} {item.symbol}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div
                          className="relative"
                          onMouseEnter={() => handleMouseEnter(index)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <button className="p-2 hover:bg-[#36C6E0]/10 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-[#36C6E0]/70" />
                          </button>
                          {visibleDropdownIndex === index && (
                            <Dropdown
                              isVisible={visibleDropdownIndex === index}
                              onMouseLeave={handleMouseLeave}
                              symbol={item.symbol}
                              handleStakeButton={handleStakeButton}
                              handleUnStakeButton={handleUnStakeButton}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StakeModal
        opened={openedStake}
        open={openStake}
        symbol={token}
        handleStakeButton={handleStakeButton}
        setAssets={setStakeAssets}
      />
      <UnStakeModal
        opened={openedUnStake}
        open={openUnStake}
        symbol={token}
        handleUnStakeButton={handleUnStakeButton}
        setAssets={setStakeAssets}
      />
    </div>
  );
}