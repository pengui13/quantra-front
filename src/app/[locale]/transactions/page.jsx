"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { GetWithdrawalHistory } from "../../../../api/ApiWrapper";

export default function WithdrawalTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = () => {
    setLoading(true);

    GetWithdrawalHistory(
      null,
      null,
      (data) => {
        setTransactions(data.results || []);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setTransactions([]);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen pt-[100px] bg-black text-white flex flex-col items-center justify-start p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Withdrawal Transactions</h1>
        <p className="text-gray-400">
          Here you can see all your withdrawal transactions. Stay up to date with your crypto movements.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-[#36C6E0]" size={40} />
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-gray-400 text-lg">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-6xl">
          <table className="w-full border border-gray-800 text-left rounded-lg">
            <thead className="bg-[#0d0d0d] sticky top-0">
              <tr>
                <th className="px-4 py-2 border-b border-gray-700">ID</th>
                <th className="px-4 py-2 border-b border-gray-700">Symbol</th>
                <th className="px-4 py-2 border-b border-gray-700">Amount</th>
                <th className="px-4 py-2 border-b border-gray-700">Network</th>
                <th className="px-4 py-2 border-b border-gray-700">Address</th>
                <th className="px-4 py-2 border-b border-gray-700">Status</th>
                <th className="px-4 py-2 border-b border-gray-700">Fee</th>
                <th className="px-4 py-2 border-b border-gray-700">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.transaction_id} className="hover:bg-[#1a1a1a]">
                  <td className="px-4 py-2 border-b border-gray-800 break-all">{tx.transaction_id}</td>
                  <td className="px-4 py-2 border-b border-gray-800">{tx.symbol}</td>
                  <td className="px-4 py-2 border-b border-gray-800">{parseFloat(tx.amount).toFixed(8)}</td>
                  <td className="px-4 py-2 border-b border-gray-800">{tx.network}</td>
                  <td className="px-4 py-2 border-b border-gray-800 break-all">{tx.address}</td>
                  <td className="px-4 py-2 border-b border-gray-800">{tx.status}</td>
                  <td className="px-4 py-2 border-b border-gray-800">{parseFloat(tx.fee).toFixed(8)}</td>
                  <td className="px-4 py-2 border-b border-gray-800">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
