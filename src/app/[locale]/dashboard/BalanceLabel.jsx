import Skeleton from "./Skeleton";

export default function BalanceLabel({
  label,
  change,
  balance,
  changeUSD,
  changePerc,
  hiddenBalances,
}) {
  return balance && !isNaN(parseFloat(changeUSD)) ? (
    <div className="flex flex-col py-3 rounded-xl">
      <span className="text-bl font-semibold text-xs">{label}</span>
      <span className="text-bl font-semibold ">
        {hiddenBalances ? "******" : balance} USDT
      </span>

      {change &&
        (parseFloat(changeUSD) >= 0 ? (
          <span className="font-semibold text-[#23a25d] text-xs">
            {hiddenBalances ? "*****" : `+₮${changeUSD} (${changePerc}%)`}
          </span>
        ) : (
          <span className="font-semibold text-[#F0616D] text-xs">
            {hiddenBalances
              ? "*****"
              : `-₮${changeUSD.toString().replace("-", "")} (${changePerc
                  .toString()
                  .replace("-", "")}%)`}
          </span>
        ))}
    </div>
  ) : (
    <Skeleton width="min-w-[150px]" height="h-full" rounded="rounded-xl" />
  );
}
