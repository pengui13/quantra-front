"use client";
import "../globals.css";
import BalanceChart from "./BalanceChart";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import DraggableBalanceContainer from "./DraggableContainer";
import { FetchChartData } from "../../../../api/ApiWrapper";
import Skeleton from "./Skeleton";
import DashButton from "./DashButton";
import { GetStakedAssets } from "../../../../api/ApiWrapper";
import BalanceLabel from "./BalanceLabel";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Eye, EyeOff, MoreVertical } from "lucide-react";
import { WEBSOCKET_URL } from "../../../../api/ApiWrapper";
import { getCookieValue } from "../../../../api/ApiWrapper";
import { useTranslations, useLocale } from "next-intl";

const Dropdown = ({ symbol, handleStakeButton, handleUnStakeButton }) => {
  const t = useTranslations("Dashboard");
  return (
    <div className="absolute bg-black rounded-lg shadow-2xl z-50 left-0 top-0 border border-[#36C6E0]/20 backdrop-blur-md">
      <ul className="p-2 w-[160px]">
        <Link
          href={`/deposit?key=${symbol}`}
          className="hover:bg-[#36C6E0]/10 px-4 rounded-lg flex gap-2 items-center cursor-pointer transition-colors"
        >
          <span className="font-medium text-white py-2 text-sm">{t("deposit")}</span>
        </Link>
        <Link
          href={`/withdraw?key=${symbol}`}
          className="hover:bg-[#36C6E0]/10 px-4 rounded-lg flex gap-2 items-center cursor-pointer transition-colors"
        >
          <span className="font-medium text-white py-2 text-sm">{t("withdrawal")}</span>
        </Link>
        <Link
          href={`/swap?key=${symbol}`}
          className="hover:bg-[#36C6E0]/10 px-4 rounded-lg flex gap-2 items-center cursor-pointer transition-colors"
        >
          <span className="font-medium text-white py-2 text-sm">{t("swap")}</span>
        </Link>
        <Link
          href={`/spot?key=${symbol}`}
          className="hover:bg-[#36C6E0]/10 px-4 rounded-lg flex gap-2 items-center cursor-pointer transition-colors"
        >
          <span className="font-medium text-white py-2 text-sm">{t("spot")}</span>
        </Link>
      </ul>
    </div>
  );
};

export default function Dashboard({ balance, hiddenBalances, toggleBalances }) {
  const [dropdownHovered, setDropdownHovered] = useState(false);
  const [portfolioWallet, setPortfolioWallet] = useState([]);
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);
  const [stakedAssets, setStakedAssets] = useState([]);
  const [spot, setSpot] = useState([]);
  const [openedBal, openBal] = useState(false);
  const [balanceData, setBalanceData] = useState([]);
  const t = useTranslations("Dashboard");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await FetchChartData(setBalanceData);
        console.log("Fetched data:", data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };
    fetchData();
  }, []);

  const handleMouseEnter = (index) => {
    setVisibleDropdownIndex(index);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!dropdownHovered) {
        setVisibleDropdownIndex(null);
      }
    }, 100);
  };

  const handleDropdownMouseEnter = () => {
    setDropdownHovered(true);
  };

  const handleDropdownMouseLeave = () => {
    setDropdownHovered(false);
    setVisibleDropdownIndex(null);
  };

  const handleStakeButton = (symbol) => {
    openTransfer(true);
  };

  const handleUnStakeButton = (symbol) => {
    openTransfer(true);
  };

  useEffect(() => {
    GetStakedAssets(setStakedAssets);
  }, []);

  useEffect(() => {
    const token = getCookieValue("access");
    const ws = new WebSocket(`${WEBSOCKET_URL}assets/?token=${token}`);
    ws.onclose = () => {};
    ws.onerror = (error) => {};
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const token = getCookieValue("access");
    const ws = new WebSocket(`${WEBSOCKET_URL}assets/?token=${token}`);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          section: "webwallet",
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPortfolioWallet(data);
    };

    ws.onclose = () => {};
    ws.onerror = (error) => {};

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const token = getCookieValue("access");
    const ws = new WebSocket(`${WEBSOCKET_URL}assets/?token=${token}`);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          section: "market_spot",
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSpot(data);
    };

    ws.onclose = () => {};
    ws.onerror = (error) => {};

    return () => {
      ws.close();
    };
  }, []);

  const [greeting, setGreeting] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      setGreeting("mor");
    } else if (currentTime >= 12 && currentTime < 18) {
      setGreeting("after");
    } else {
      setGreeting("even");
    }
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="flex max-w-[1440px] px-4 flex-col items-start justify-center w-full gap-8">
          {/* Total Balance Section */}
          <div className="w-full rounded-2xl bg-black border border-[#36C6E0]/20 p-6">
            <div className="flex flex-col w-full gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h5 className="font-semibold text-white text-xl">Total Balance</h5>
                  <button
                    onClick={() => toggleBalances(!hiddenBalances)}
                    className="hover:bg-[#36C6E0]/10 p-2 rounded-lg transition-colors"
                  >
                    {hiddenBalances ? (
                      <EyeOff size={20} className="text-[#36C6E0]" />
                    ) : (
                      <Eye size={20} className="text-[#36C6E0]" />
                    )}
                  </button>
                </div>
              </div>
              <BalanceChart
                balanceData={balanceData}
                hiddenBalances={hiddenBalances}
              />
            </div>
          </div>

          {/* Accounts Section */}
          <div className="w-full flex flex-col gap-5">
            <div className="flex items-center justify-between w-full">
              <h5 className="font-semibold text-white text-xl">Accounts</h5>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 block md:hidden py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isEditMode
                    ? "bg-[#36C6E0] text-black hover:bg-[#36C6E0]/90"
                    : "bg-black border border-[#36C6E0]/30 text-[#36C6E0] hover:border-[#36C6E0]/60"
                }`}
              >
                {isEditMode ? "Done" : "Reorder"}
              </button>
            </div>

            <DraggableBalanceContainer
              copyChangePerc={0}
              copyChangeUsd={0}
              copyBalanceUsd={0}
              marginBalanceUsd={0}
              marginChangePerc={0}
              marginChangeUsd={0}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              otcBalanceUsd={0}
              otcChangeUsd={0}
              otcChangePerc={0}
              spotBalanceUsd={0}
              spotChangePerc={0}
              spotChangeUsd={0}
              hiddenBalance={hiddenBalances}
            />

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 md:grid-cols-5 md:gap-3 w-full">
              {balanceData && balanceData.length > 0 ? (
                <Link href="/buycrypto" className="w-full">
                  <DashButton text={t("Buy")} icon="plus" />
                </Link>
              ) : (
                <Skeleton width="w-full" height="h-[44px]" rounded="rounded-xl" />
              )}

              {balanceData && balanceData.length > 0 ? (
                <Link href="/p2p" className="w-full">
                  <DashButton text={t("Sell")} icon="minus" />
                </Link>
              ) : (
                <Skeleton width="w-full" height="h-[44px]" rounded="rounded-xl" />
              )}

              {balanceData && balanceData.length > 0 ? (
                <Link href="/swap" className="w-full">
                  <DashButton text={t("swap")} icon="shuffle" />
                </Link>
              ) : (
                <Skeleton width="w-full" height="h-[44px]" rounded="rounded-xl" />
              )}



              {balanceData && balanceData.length > 0 ? (
                <Link href="/deposit" className="w-full">
                  <DashButton text={t("deposit")} icon="login" />
                </Link>
              ) : (
                <Skeleton width="w-full" height="h-[44px]" rounded="rounded-xl" />
              )}

              {balanceData && balanceData.length > 0 ? (
                <Link href="/withdraw" className="w-full">
                  <DashButton text={t("withdrawal")} icon="logout" />
                </Link>
              ) : (
                <Skeleton width="w-full" height="h-[44px]" rounded="rounded-xl" />
              )}
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="w-full rounded-2xl bg-black border border-[#36C6E0]/20 p-6">
            <div className="flex flex-col gap-6">
              <h5 className="font-semibold text-white text-xl">Portfolio</h5>

              {/* Mobile View */}
              <div className="flex items-lg:hidden gap-3 overflow-x-auto pb-2">
                {!hiddenBalances &&
                  portfolioWallet.length > 0 &&
                  portfolioWallet.map((item, index) => (
                    <div
                      className="bg-black border border-[#36C6E0]/20 rounded-xl px-4 py-4 min-w-[300px] w-full flex flex-col items-start justify-center gap-3"
                      key={index}
                    >
                      <div className="flex items-center w-full justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            width={32}
                            height={32}
                            src={`/assets/icons/${item.symbol.toLowerCase()}.png`}
                            alt={item.symbol}
                          />
                          <div className="flex flex-col">
                            <span className="text-white text-sm font-semibold">
                              {item.full_name}
                            </span>
                            <span className="text-gray-400 text-xs font-semibold">
                              {item.symbol}
                            </span>
                          </div>
                        </div>
                        <div
                          className="relative"
                          onMouseEnter={handleDropdownMouseEnter}
                          onMouseLeave={handleDropdownMouseLeave}
                        >
                          <div
                            className="relative inline-block"
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <button className="p-2 hover:bg-[#36C6E0]/10 rounded-lg transition-colors">
                              <MoreVertical size={18} className="text-[#36C6E0]/70" />
                            </button>
                            {visibleDropdownIndex === index && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  zIndex: 9999,
                                }}
                              >
                                <Dropdown
                                  symbol={item.symbol}
                                  handleStakeButton={handleStakeButton}
                                  handleUnStakeButton={handleUnStakeButton}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 w-full text-sm">
                        <div>
                          <p className="text-gray-400 text-xs font-medium mb-1">Allocation</p>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">
                              {Math.min(
                                (parseFloat(item.value) * 100) /
                                  parseFloat(balance.total_balance),
                                100
                              ).toFixed(2)}
                              %
                            </span>
                            <div className="w-12 h-1.5 bg-[#36C6E0]/10 rounded-full overflow-hidden">
                              <div
                                style={{
                                  backgroundColor: item.color,
                                  width: `${(
                                    (parseFloat(item.value) * 100) /
                                    parseFloat(balance.total_balance)
                                  ).toFixed(0)}%`,
                                }}
                                className="h-full"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs font-medium mb-1">Price</p>
                          <span className="text-white font-semibold text-sm">
                            ${parseFloat(item.rate).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 w-full text-sm">
                        <div>
                          <p className="text-gray-400 text-xs font-medium mb-1">Balance</p>
                          <span className="text-white font-semibold">
                            {item.total} {item.symbol}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs font-medium mb-1">Available</p>
                          <span className="text-white font-semibold">
                            {item.quantity} {item.symbol}
                          </span>
                        </div>
                      </div>

                      <div className="w-full">
                        <p className="text-gray-400 text-xs font-medium mb-1">Est. Value</p>
                        <span className="text-white font-semibold">
                          {item.fiat_value} {balance.currency}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Desktop Table */}
              {!hiddenBalances && (
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#36C6E0]/10">
                        <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">
                          Asset
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">
                          Allocation
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">
                          Price
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">
                          24h
                        </th>
                        <th className="text-right text-xs font-semibold text-gray-400 uppercase py-3 px-4">
                          Balance
                        </th>
                        <th className="text-right text-xs font-semibold text-gray-400 uppercase py-3 px-4">
                          Available
                        </th>
                        <th className="text-right text-xs font-semibold text-gray-400 uppercase py-3 px-4">
                          Value
                        </th>
                        <th className="text-right text-xs font-semibold text-gray-400 uppercase py-3 px-4">
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioWallet.length > 0 &&
                        portfolioWallet.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b border-[#36C6E0]/10 hover:bg-[#36C6E0]/5 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Image
                                  width={32}
                                  height={32}
                                  src={`/assets/icons/${item.symbol.toLowerCase()}.png`}
                                  alt={item.symbol}
                                />
                                <div className="flex flex-col">
                                  <span className="text-white text-sm font-semibold">
                                    {item.full_name}
                                  </span>
                                  <span className="text-gray-400 text-xs font-semibold">
                                    {item.symbol}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className="text-white text-sm font-semibold">
                                  {Math.min(
                                    (parseFloat(item.value) * 100) /
                                      parseFloat(balance.total_balance),
                                    100
                                  ).toFixed(2)}
                                  %
                                </span>
                                <div className="w-16 h-1.5 bg-[#36C6E0]/10 rounded-full overflow-hidden">
                                  <div
                                    style={{
                                      backgroundColor: item.color,
                                      width: `${(
                                        (parseFloat(item.value) * 100) /
                                        parseFloat(balance.total_balance)
                                      ).toFixed(0)}%`,
                                    }}
                                    className="h-full"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-white text-sm font-semibold">
                                ${parseFloat(item.rate).toFixed(2)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`text-sm font-semibold ${
                                  parseFloat(item.percentage) >= 0
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                }`}
                              >
                                {item.percentage}%
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-white text-sm font-semibold">
                                {item.total} {item.symbol}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-white text-sm font-semibold">
                                {item.quantity} {item.symbol}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-white text-sm font-semibold">
                                {item.fiat_value} {balance.currency}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div
                                className="relative"
                                onMouseEnter={handleDropdownMouseEnter}
                                onMouseLeave={handleDropdownMouseLeave}
                              >
                                <div
                                  className="relative inline-block"
                                  onMouseEnter={() => handleMouseEnter(index)}
                                  onMouseLeave={handleMouseLeave}
                                >
                                  <button className="p-2 hover:bg-[#36C6E0]/10 rounded-lg transition-colors">
                                    <MoreVertical size={18} className="text-[#36C6E0]/70" />
                                  </button>
                                  {visibleDropdownIndex === index && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: "100%",
                                        right: "0",
                                        zIndex: 9999,
                                      }}
                                    >
                                      <Dropdown
                                        symbol={item.symbol}
                                        handleStakeButton={handleStakeButton}
                                        handleUnStakeButton={handleUnStakeButton}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Spot Section */}
          {!hiddenBalances && spot.length > 0 && (
            <div className="w-full rounded-2xl bg-black border border-[#36C6E0]/20 p-6">
              <div className="flex flex-col gap-6">
                <h5 className="font-semibold text-white text-xl">Spot Trading</h5>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#36C6E0]/10">
                        <th className="text-left text-xs font-semibold text-gray-400 uppercase py-3 px-4">
                          Asset
                        </th>
                        <th className="text-center text-xs font-semibold text-gray-400 uppercase py-3 px-4">
                          Price
                        </th>
                        <th className="text-right text-xs font-semibold text-gray-400 uppercase py-3 px-4">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {spot.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#36C6E0]/10 hover:bg-[#36C6E0]/5 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Image
                                width={32}
                                height={32}
                                src={`/assets/icons/${item.symbol.toLowerCase()}.png`}
                                alt={item.symbol}
                              />
                              <div className="flex flex-col">
                                <span className="text-white text-sm font-semibold">
                                  {item.full_name}
                                </span>
                                <span className="text-gray-400 text-xs font-semibold">
                                  {item.symbol}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-white text-sm font-semibold">
                              ${item.rate}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex flex-col items-end">
                              <span className="text-white text-sm font-semibold">
                                ${item.value}
                              </span>
                              <span className="text-emerald-400 font-semibold text-xs">
                                {item.quantity} {item.symbol}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}