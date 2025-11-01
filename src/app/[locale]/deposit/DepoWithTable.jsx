import { useState, useEffect } from "react";
import { GetTransExternalAll } from "../../../../api/ApiWrapper";
export function capitalizeFirstLetter(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export default function DepoWithTable() {
  const [trans, setTrans] = useState(null);
  const { t, i18n } = useTranslation();
  const formatRelativeTime = (timestamp) => {
    const date = new Date(parseInt(timestamp, 10));
    const pad = (num) => num.toString().padStart(2, "0");

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Months are zero-based
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    GetTransExternalAll(setTrans);
  }, []);
  return (
    <div className="max-w-[1160px] w-full gap-5 p-5 flex flex-col bg-bkg rounded-2xl">
      <h5 className="text-bl font-semibold text-xl">{t("depowithhist")}</h5>
      <div className="flex flex-col  overflow-y-auto w-full items-center md:hidden justify-center gap-3">
        {trans &&
          trans.map((item, index) => (
            <div
              className="w-full rounded-2xl bg-log-bkg p-4 flex flex-col items-center justify-center gap-3 "
              key={index}
            >
              <div className="w-full items-center flex justify-between">
                <span className="font-medium text-xs text-gr">
                  {t("symbol")}
                </span>
                <span className="font-semibold text-sm text-bl">
                  {item.asset.symbol}
                </span>
              </div>
              <div className="w-full items-center flex justify-between">
                <span className="font-medium text-xs text-gr">
                  {" "}
                  {t("chain")}
                </span>
                <span className=" font-semibold text-sm text-bl">
                  {item.asset.fb_native_asset}
                </span>
              </div>
              <div className="w-full items-center flex justify-between">
                <span className="font-medium text-xs text-gr">
                  {t("amount")}
                </span>
                <span className=" font-semibold text-sm text-bl">
                  {item.amount}
                </span>
              </div>
              <div className="w-full items-center flex justify-between">
                <span className="font-medium text-xs text-gr">
                  {" "}
                  {t("side")}
                </span>
                <span
                  className={`${
                    item.type == "deposit" ? "text-root-green" : "text-root-red"
                  } font-semibold text-sm `}
                >
                  {item.type == "deposit" ? t("deposit") : t("withdrawal")}
                </span>
              </div>
              <div className="w-full items-center flex justify-between">
                <span className="font-medium text-xs text-gr">
                  {" "}
                  {t("time")}
                </span>
                <span className=" font-semibold text-sm text-bl">
                  {formatRelativeTime(item.created)}
                </span>
              </div>
            </div>
          ))}
      </div>
      <div className="overflow-y-auto max-h-[500px] hidden md:block">
        <table className="w-full  max-h-[300px] overflow-x-hidden overflow-y-auto">
          <thead>
            <th className="text-left text-xs font-medium text-gr">
              {t("symbol")}
            </th>
            <th className="text-left text-xs font-medium text-gr">
              {t("chain")}
            </th>
            <th className="text-left text-xs font-medium text-gr">
              {t("side")}
            </th>
            <th className="text-left text-xs font-medium text-gr">
              {t("amount")}
            </th>
            <th className="text-left text-xs font-medium text-gr">
              {t("time")}
            </th>
          </thead>
          <tbody>
            {trans &&
              trans.map((item, index) => (
                <tr key={index} className="h-[30px]">
                  <td className=" font-semibold text-sm text-bl">
                    {item.asset.symbol}
                  </td>
                  <td className=" font-semibold text-sm text-bl">
                    {item.asset.fb_native_asset}
                  </td>

                  <td
                    className={`${
                      item.type == "deposit"
                        ? "text-root-green"
                        : "text-root-red"
                    } font-semibold text-sm `}
                  >
                    {item.type == "deposit" ? t("deposit") : t("withdrawal")}
                  </td>

                  <td className=" font-semibold text-sm text-bl">
                    {item.amount}
                  </td>
                  <td className=" font-semibold text-sm text-bl">
                    {formatRelativeTime(item.created)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
