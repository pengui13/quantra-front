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
    className={`absolute bg-bkg rounded-xl shadow-lg ${
      isVisible ? "block" : "hidden"
    }`}
    style={{ zIndex: 1000 }}
    onMouseLeave={onMouseLeave}
  >
    <ul className="p-2 w-[148px]">
      <li
        onClick={() => handleStakeButton(symbol)}
        className="hover:bg-root-green-8 rounded-lg flex flex-col items-start cursor-pointer"
      >
        <span className="font-medium text-bl px-4 py-2">Stake</span>
      </li>
      <li
        onClick={() => handleUnStakeButton(symbol)}
        className="hover:bg-root-green-8 rounded-lg flex flex-col items-start cursor-pointer"
      >
        <span className="font-medium text-bl px-4 py-2">Unstake</span>
      </li>
      <Link href={`/deposit?key=${symbol}`}>
        <li className="hover:bg-root-green-8 rounded-lg flex flex-col items-start cursor-pointer">
          <span className="font-medium text-bl px-4 py-2">Deposit</span>
        </li>
      </Link>
      <Link href={`/spot?key=${symbol}`}>
        <li className="hover:bg-root-green-8 rounded-lg flex flex-col items-start cursor-pointer">
          <span className="font-medium text-bl px-4 py-2">Go To Market</span>
        </li>
      </Link>
    </ul>
  </div>
);

export default function StakingPage({ balance = { balance: { staked_balance: 1 } } }) {
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
    <div className="bg-log-bkg flex flex-col items-center justify-center mt-[60px]">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="flex max-w-[1160px] px-4 w-full flex-col py-[60px] items-center justify-center">
        <div className="flex flex-col w-full gap-5">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h5 className="font-semibold text-2xl text-bl flex items-center gap-2">
              <Wallet className="w-5 h-5 text-root-green" />
              Staking
            </h5>
          </div>

          {/* Summary */}
          <div className="w-full bg-bkg rounded-xl px-5 py-3">
            <div className="flex md:justify-between flex-col md:flex-row gap-4 items-start md:items-center w-full">
              <div className="flex md:w-auto w-full items-center justify-between md:justify-normal md:gap-11">
                <div className="flex flex-col justify-center items-start">
                  <span className="text-gr text-sm font-semibold flex items-center gap-1">
                    <Wallet className="w-4 h-4" /> Earnings
                  </span>
                  <span className="font-semibold text-sm text-bl">
                    {balance.staked_balance}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gr text-sm font-semibold flex items-center gap-1">
                    <Coins className="w-4 h-4" /> Total Rewards
                  </span>
                  <span className="font-semibold text-sm text-bl">
                    {parseFloat(reward).toFixed(2)} USD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assets */}
          <div className="w-full rounded-2xl gap-3 bg-bkg px-5 py-6 flex flex-col items-start justify-center">
            <h5 className="text-bl text-xl text-left font-medium flex items-center gap-2">
              <Coins className="w-5 h-5 text-root-green" /> Staking Assets
            </h5>

            {/* Mobile Cards */}
            <div className="flex items-center overflow-x-auto w-full overflow-y-hidden lg:hidden gap-3">
              {stakeAssets.map((item, index) => {
                const network = item.networks?.[0] || {};
                return (
                  <div
                    className="min-w-[300px] p-4 flex flex-col items-center bg-log-bkg rounded-2xl justify-center w-full gap-3"
                    key={index}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Image
                          width={28}
                          height={28}
                          src={`/assets/${item.symbol.toLowerCase()}.png`}
                          alt={item.symbol}
                        />
                        <span className="font-semibold text-sm text-bl">{item.symbol}</span>
                      </div>
                      <div
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="cursor-pointer">
                          <MoreVertical className="w-5 h-5 text-white" />
                        </div>
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
                    <div className="flex items-center justify-between w-full">
                      Estimated APR
                      <span className="text-root-green font-semibold text-sm">
                        {network.apr_low?.toFixed(2)}-{network.apr_high?.toFixed(2)} %
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      Staked Balance
                      <span className="text-bl font-semibold text-sm">
                        {item.quantity || 0} {item.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      Estimated Value
                      <span className="text-bl font-semibold text-sm">
                        {item.value ? parseFloat(item.value).toFixed(2) : "0.00"} USD
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      Total Rewards
                      <span className="text-bl font-semibold text-sm">
                        {item.total_reward || 0} {item.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      Available Balance
                      <span className="text-bl font-semibold text-sm">
                        {item.avail || 0} {item.symbol}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <table className="w-full hidden lg:table">
              <thead className="header-spacing">
                <tr className="h-[50px] mb-2 text-sm">
                  <th className="text-left text-gr font-medium text-xs">Asset</th>
                  <th className="text-left text-gr font-medium text-xs">Estimated APR</th>
                  <th className="text-left text-gr font-medium text-xs">Staked Balance</th>
                  <th className="text-left text-gr font-medium text-xs">Estimated Value</th>
                  <th className="text-left text-gr font-medium text-xs">Total Rewards</th>
                  <th className="text-left text-gr font-medium text-xs">Available Balance</th>
                </tr>
              </thead>
              <tbody>
                {stakeAssets.map((item, index) => {
                  const network = item.networks?.[0] || {};
                  return (
                    <tr className="h-[45px]" key={index}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Image
                            width={28}
                            height={28}
                            src={`/assets/${item.symbol.toLowerCase()}.png`}
                            alt={item.symbol}
                          />
                          <span className="font-semibold text-sm text-bl">{item.symbol}</span>
                        </div>
                      </td>
                      <td className="text-left">
                        <span className="text-root-green font-semibold text-sm">
                          {network.apr_low?.toFixed(2)}-{network.apr_high?.toFixed(2)} %
                        </span>
                      </td>
                      <td className="text-left">
                        <span className="text-bl font-semibold text-sm">
                          {item.quantity || 0} {item.symbol}
                        </span>
                      </td>
                      <td className="text-left">
                        <span className="text-bl font-semibold text-sm">
                          {item.value ? parseFloat(item.value).toFixed(2) : "0.00"} USD
                        </span>
                      </td>
                      <td className="text-left">
                        <span className="text-bl font-semibold text-sm">
                          {item.total_reward || 0} {item.symbol}
                        </span>
                      </td>
                      <td className="text-left">
                        <span className="text-bl font-semibold text-sm">
                          {item.avail || 0} {item.symbol}
                        </span>
                      </td>
                      <td
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="cursor-pointer">
                          <MoreVertical className="w-5 h-5 text-white" />
                        </div>
                        {visibleDropdownIndex === index && (
                          <Dropdown
                            isVisible={visibleDropdownIndex === index}
                            onMouseLeave={handleMouseLeave}
                            symbol={item.symbol}
                            handleStakeButton={handleStakeButton}
                            handleUnStakeButton={handleUnStakeButton}
                          />
                        )}
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
