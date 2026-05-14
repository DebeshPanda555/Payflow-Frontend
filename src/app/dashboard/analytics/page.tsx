"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#818cf8", "#fb7185", "#34d399", "#fcd34d", "#c084fc", "#60a5fa"];

export default function AnalyticsPage() {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/payments/transactions`, {
      headers: { "Authorization": `Bearer ${token}` },
      cache: "no-store"
    })
    .then(res => res.json())
    .then(data => {
      if (data.transactions) {
        const txs = data.transactions;
        const spendingData: Record<string, number> = {};
        
        txs.forEach((tx: any) => {
          if (tx.type === 'DEBIT') {
            const category = tx.category || 'Other';
            spendingData[category] = (spendingData[category] || 0) + tx.amount;
          }
        });

        const formattedData = Object.keys(spendingData).map(key => ({
          name: key,
          value: spendingData[key]
        }));
        setChartData(formattedData);
      }
    })
    .catch(console.error);
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Analytics</h1>
        <p className="text-white/50">Deep dive into your spending habits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md"
        >
          <h3 className="text-lg font-semibold mb-6">Spending by Category</h3>
          <div className="h-[300px] w-full">
            {chartData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-white/50">No spending data yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, undefined]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {chartData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-white/70">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md"
        >
          <h3 className="text-lg font-semibold mb-6">Key Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                1
              </div>
              <div>
                <p className="text-sm text-white/80">You have recorded {chartData.length} spending categories this month.</p>
              </div>
            </div>
            {chartData.length > 0 && (
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  2
                </div>
                <div>
                  <p className="text-sm text-white/80">
                    Highest spending category is <span className="font-semibold text-emerald-400">{[...chartData].sort((a,b) => b.value - a.value)[0].name}</span>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
