"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BalanceConverterModal } from "@/components/BalanceConverterModal";

export default function WalletsPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const [walletRes, txRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/wallets/me`, { headers: { "Authorization": `Bearer ${token}` }, cache: "no-store" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/payments/transactions`, { headers: { "Authorization": `Bearer ${token}` }, cache: "no-store" })
      ]);

      const wData = await walletRes.json();
      const tData = await txRes.json();

      if (wData.wallet) {
        setWallet(wData.wallet);
      }
      if (tData.transactions) {
        setTransactions(tData.transactions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMoney = async () => {
    const amount = prompt("Enter amount to add:");
    if (!amount || isNaN(Number(amount))) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/wallets/fund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(amount) })
      });
      if (res.ok) {
        fetchData(); // refresh data
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMoney = async () => {
    const recipientEmail = prompt("Enter recipient's PayFlow ID (email):");
    if (!recipientEmail) return;
    const amount = prompt("Enter amount to send (INR):");
    if (!amount || isNaN(Number(amount))) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/payments/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ recipientEmail, amount: Number(amount) })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Transfer successful!");
        fetchData();
      } else {
        alert(data.error || "Transfer failed");
      }
    } catch (err) {
      alert("Error sending money");
    }
  };

  if (loading) return <div className="p-8">Loading wallets...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <BalanceConverterModal isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} currentBalance={wallet?.balance} />
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Your Wallets</h1>
          <p className="text-white/50">Manage your multi-currency accounts and transactions.</p>
        </div>
        <Button onClick={handleAddMoney} className="bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <Plus className="w-4 h-4 mr-2" /> Add Money
        </Button>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wallet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-2xl border bg-gradient-to-br from-indigo-500/20 to-indigo-500/0 border-indigo-500/30 backdrop-blur-md relative overflow-hidden`}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  <WalletIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-white/70">{wallet.currency}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-white/50 mb-1">Available Balance</p>
              <h2 className="text-4xl font-bold tracking-tight">
                {wallet.currency === 'USD' ? '$' : wallet.currency === 'EUR' ? '€' : wallet.currency === 'INR' ? '₹' : '£'}{wallet.balance.toFixed(2)}
              </h2>
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[30px] rounded-full pointer-events-none" />
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={() => router.push("/dashboard/scan")} variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 flex-1 py-6">
          <ArrowDownLeft className="w-4 h-4 mr-2 text-emerald-400" /> Receive
        </Button>
        <Button onClick={handleSendMoney} variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 flex-1 py-6">
          <ArrowUpRight className="w-4 h-4 mr-2 text-indigo-400" /> Send
        </Button>
        <Button onClick={() => setIsConverterOpen(true)} variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 flex-1 py-6">
          <Repeat className="w-4 h-4 mr-2 text-purple-400" /> Exchange
        </Button>
      </div>

      {/* Recent Transactions List */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
        <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-white/50 text-center py-8">No transactions found.</p>
          ) : (
            transactions.map((tx, i) => (
              <motion.div 
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex justify-between items-center p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${tx.type === 'DEBIT' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {tx.type === 'DEBIT' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-white">{tx.user?.name || tx.description || 'Transaction'}</p>
                    <p className="text-xs text-white/50">{new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.type === 'DEBIT' ? 'text-white' : 'text-emerald-400'}`}>
                    {tx.type === 'DEBIT' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-white/50">{tx.status}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
