"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Building2, Cpu, Globe } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { BalanceConverterModal } from "@/components/BalanceConverterModal";

export default function DashboardHome() {
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [user, setUser] = useState<any>(null);
  const [socketAlert, setSocketAlert] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [graphData, setGraphData] = useState<any[]>([{ name: "Today", income: 0, expense: 0 }]);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(true);
  const [isConverterOpen, setIsConverterOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userStr && token) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);

      // Fetch Wallet Balance
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/wallets/me`, {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store"
      })
      .then(res => res.json())
      .then(data => {
        if (data.wallet) {
          setBalance(data.wallet.balance);
          setCurrency(data.wallet.currency);
        }
      })
      .catch(console.error);

      // Fetch Transactions
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/payments/transactions`, {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store"
      })
      .then(res => res.json())
      .then(data => {
        if (data.transactions) {
          const txs = data.transactions;
          setTransactions(txs);
          
          let income = 0;
          let expense = 0;
          const groupedData: Record<string, {name: string, income: number, expense: number}> = {};

          txs.forEach((tx: any) => {
             if (tx.type === 'CREDIT') income += tx.amount;
             if (tx.type === 'DEBIT') expense += tx.amount;

             const day = new Date(tx.createdAt).toLocaleDateString("en-US", { weekday: 'short' });
             if (!groupedData[day]) {
               groupedData[day] = { name: day, income: 0, expense: 0 };
             }
             if (tx.type === 'CREDIT') groupedData[day].income += tx.amount;
             if (tx.type === 'DEBIT') groupedData[day].expense += tx.amount;
          });
          setMonthlyIncome(income);
          setMonthlyExpense(expense);

          const sortedDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const todayIndex = new Date().getDay();
          const last7Days = [];
          for (let i = 6; i >= 0; i--) {
            last7Days.push(sortedDays[(todayIndex - i + 7) % 7]);
          }
          
          const finalChartData = last7Days.map(day => groupedData[day] || { name: day, income: 0, expense: 0 });
          setGraphData(finalChartData);
        }
      })
      .catch(console.error);

      // Fetch AI Insights
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/ai/insights`, {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store"
      })
      .then(res => res.json())
      .then(data => {
        if (data.insights) {
          setAiInsights(data.insights);
        }
      })
      .catch(console.error)
      .finally(() => setAiLoading(false));

      // Connect Socket
      const socket = io(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}`);
      socket.on(`payment_received_${parsedUser.id}`, (data) => {
        setSocketAlert(data.message);
        setBalance(prev => prev + data.amount);
        setMonthlyIncome(prev => prev + data.amount);
        setTimeout(() => setSocketAlert(null), 5000);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <BalanceConverterModal isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} currentBalance={balance} />
      
      {socketAlert && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl flex items-center justify-between"
        >
          {socketAlert}
        </motion.div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Financial Overview</h1>
          <p className="text-white/50">Welcome back{user ? `, ${user.name}` : ""}. Here's your snapshot.</p>
        </div>
        <Button onClick={() => setIsConverterOpen(true)} className="bg-white text-black hover:bg-white/90">
          <Globe className="w-4 h-4 mr-2" /> Check Balance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Balance", value: `${currency === 'INR' ? '₹' : '$'}${balance.toFixed(2)}`, trend: "Live update active", icon: Building2, color: "text-indigo-400" },
          { title: "Monthly Income", value: `₹${monthlyIncome.toFixed(2)}`, trend: "Calculated from transactions", icon: ArrowUpRight, color: "text-emerald-400" },
          { title: "Monthly Expenses", value: `₹${monthlyExpense.toFixed(2)}`, trend: "Calculated from transactions", icon: ArrowDownLeft, color: "text-rose-400" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-white/50 font-medium">{stat.title}</span>
              <div className="p-2 rounded-lg bg-white/5">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">{stat.value}</h2>
            <p className="text-xs text-white/40">{stat.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md"
        >
          <h3 className="text-lg font-semibold mb-6">Cashflow Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#ffffff50', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#ffffff50', fontSize: 12}} dx={-10} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: any) => [`₹${value}`, undefined]}
                />
                <Area type="monotone" dataKey="income" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#fb7185" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[40px]" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold">AI Assistant</h3>
          </div>
          
          <div className="space-y-4 relative z-10">
            {aiLoading ? (
              <>
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 animate-pulse h-20 w-full" />
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 animate-pulse h-20 w-full" />
              </>
            ) : aiInsights.length > 0 ? (
              aiInsights.map((insight, idx) => (
                <div key={idx} className="p-4 bg-black/40 rounded-xl border border-white/5 text-sm leading-relaxed text-white/80">
                  <span className={`font-semibold ${insight.type === 'Forecast' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                    {insight.type}:
                  </span> {insight.text}
                </div>
              ))
            ) : (
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-sm leading-relaxed text-white/80">
                <span className="font-semibold text-rose-400">Error:</span> Could not load insights.
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium rounded-xl relative z-10">
            Ask AI Copilot
          </button>
        </motion.div>
      </div>
    </div>
  );
}
