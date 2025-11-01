"use client";

import { useState } from "react";
import Deposit from "./Deposit";
import Head from "next/head";
import DepoWithTable from "./DepoWithTable";
import { useRouter } from "next/navigation";

// Lucide React icons
import { ChevronLeft, History } from "lucide-react";

export default function DepositPage() {
  const router = useRouter();
  const [trans, openTrans] = useState(false);

  return (
    <div className="flex flex-col mt-[60px] bg-log-bkg items-center">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <div
        className={`flex ${
          trans ? "max-w-[1160px]" : "lg:max-w-[800px] px-4 w-full"
        } px-4 items-end pt-[60px] pb-[60px] w-full flex-col mdlg:flex-row mdlg:items-start gap-5 lg:gap-[60px]`}
      >
        <div className="flex flex-col items-center w-full justify-center gap-1">
          <div className="flex items-center w-full justify-between">
            {/* Back button */}
            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={trans ? () => openTrans(false) : () => router.back()}
            >
              <ChevronLeft size={20} color="#4FD1C5" strokeWidth={2.5} />
              <span className="text-[#4FD1C5] text-sm font-semibold">Back</span>
            </div>

            {/* History button */}
            {!trans && (
              <div
                onClick={() => openTrans(true)}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80"
              >
                <History size={20} color="#4FD1C5" strokeWidth={2.5} />
                <span className="text-[#4FD1C5] text-sm font-semibold">
                  History
                </span>
              </div>
            )}
          </div>

          {/* Deposit or History table */}
          {trans ? <DepoWithTable /> : <Deposit />}
        </div>
      </div>
    </div>
  );
}
