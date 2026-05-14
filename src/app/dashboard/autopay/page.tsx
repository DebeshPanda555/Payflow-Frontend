"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AutopayPage() {
  const [autopays, setAutopays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("MONTHLY");

  const fetchAutopays = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/autopay`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAutopays(data.data.autopays);
    } catch (err) {
      console.error("Failed to fetch autopays", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutopays();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/autopay`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ recipientEmail, amount: parseFloat(amount), frequency })
      });
      if (res.ok) {
        setShowForm(false);
        setRecipientEmail("");
        setAmount("");
        fetchAutopays();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to create autopay");
      }
    } catch (err) {
      alert("Error creating autopay");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5001/api/autopay/${id}/cancel`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchAutopays();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
            <RefreshCcw className="w-8 h-8 text-indigo-500" /> Autopay
          </h1>
          <p className="text-white/50">Manage your recurring payments and subscriptions.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-indigo-500 hover:bg-indigo-600">
          <Plus className="w-4 h-4 mr-2" /> New Autopay
        </Button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-md overflow-hidden"
        >
          <form onSubmit={handleCreate} className="space-y-4 max-w-md">
            <div>
              <label className="text-sm text-white/70">Recipient Email</label>
              <Input required type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} className="bg-black/50 border-white/10 mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70">Amount (USD)</label>
                <Input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="bg-black/50 border-white/10 mt-1" />
              </div>
              <div>
                <label className="text-sm text-white/70">Frequency</label>
                <select value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-md h-10 mt-1 text-sm px-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600">Setup Recurring Payment</Button>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="text-white/50 animate-pulse">Loading active autopays...</p>
        ) : autopays.length === 0 ? (
          <div className="p-12 border border-white/10 border-dashed rounded-2xl text-center">
            <RefreshCcw className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">You don't have any active recurring payments.</p>
          </div>
        ) : (
          autopays.map(autopay => (
            <motion.div 
              key={autopay.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${autopay.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  <RefreshCcw className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-lg">${autopay.amount} / {autopay.frequency.toLowerCase()}</p>
                  <p className="text-sm text-white/50 font-mono flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3" /> Next Run: {new Date(autopay.nextRunAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-2 py-1 rounded-md font-medium ${autopay.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {autopay.status}
                </span>
                {autopay.status === 'ACTIVE' && (
                  <Button variant="ghost" size="icon" onClick={() => handleCancel(autopay.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
