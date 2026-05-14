"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { Scanner } from "@yudiel/react-qr-scanner";
import { QrCode, ScanLine, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState<"receive" | "scan">("receive");
  const [userEmail, setUserEmail] = useState("loading...");
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserEmail(user.email);
    }
  }, []);

  const handleScan = (text: string) => {
    if (text) {
      let cleanData = text;
      try {
        if (text.startsWith("upi://")) {
          // Extract the 'pa' (payee address) from UPI string
          const url = new URL(text);
          const pa = url.searchParams.get("pa");
          if (pa) cleanData = pa;
        } else if (text.startsWith("http")) {
          const url = new URL(text);
          // Try to extract an identifier or just use the hostname
          cleanData = url.pathname.split("/").pop() || url.hostname;
        }
      } catch (e) {
        // Fallback to original text if parsing fails
        cleanData = text;
      }
      setScannedData(cleanData);
      setActiveTab("scan");
    }
  };

  const handleTransfer = async () => {
    if (!scannedData || !amount) return;
    setStatus("loading");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/payments/transfer`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ recipientEmail: scannedData, amount: parseFloat(amount) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Transfer failed");
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">QR Payments</h1>
        <p className="text-white/50">Scan to pay or show your QR to receive.</p>
      </div>

      <div className="flex bg-white/5 p-1 rounded-xl w-fit mx-auto">
        <button 
          onClick={() => setActiveTab("receive")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "receive" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
        >
          <QrCode className="w-4 h-4" /> Receive
        </button>
        <button 
          onClick={() => setActiveTab("scan")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "scan" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
        >
          <ScanLine className="w-4 h-4" /> Scan
        </button>
      </div>

      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md"
      >
        {activeTab === "receive" ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="bg-white p-4 rounded-2xl">
              <QRCode value={userEmail} size={200} />
            </div>
            <div className="text-center">
              <p className="text-white/50 text-sm mb-1">Your PayFlow ID</p>
              <p className="font-mono text-lg font-medium">{userEmail}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {!scannedData ? (
              <div className="aspect-square max-w-sm mx-auto overflow-hidden rounded-2xl border-2 border-white/10 relative">
                <Scanner onScan={(result) => {
                  if (result && result.length > 0) {
                    handleScan(result[0].rawValue);
                  }
                }} />
                <div className="absolute inset-0 pointer-events-none border-[40px] border-black/50" />
                <div className="absolute inset-1/4 border-2 border-indigo-500 rounded-xl animate-pulse" />
              </div>
            ) : status === "success" ? (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_100px_rgba(16,185,129,0.4)]"
                  >
                    <motion.svg 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="w-16 h-16 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-bold text-white mb-2"
                  >
                    Payment Successful
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/70 text-lg mb-10"
                  >
                    Successfully sent ₹{amount} to {scannedData}
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button 
                      onClick={() => {setScannedData(null); setStatus("idle"); setAmount("");}} 
                      className="bg-white/10 hover:bg-white/20 text-white rounded-full px-8 py-6 text-lg border border-white/10"
                    >
                      Done
                    </Button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="space-y-4 max-w-sm mx-auto">
                <div className="text-center mb-6">
                  <p className="text-white/50 text-sm">Paying to</p>
                  <p className="font-mono text-lg font-medium bg-white/5 py-2 rounded-lg mt-2">{scannedData}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Amount (USD)</label>
                  <Input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="0.00" 
                    className="bg-black/50 border-white/10 h-14 text-2xl font-mono text-center"
                  />
                </div>
                {status === "error" && (
                  <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{errorMsg}</div>
                )}
                <Button 
                  onClick={handleTransfer} 
                  disabled={status === "loading" || !amount}
                  className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white font-medium"
                >
                  {status === "loading" ? "Sending..." : "Send Money"}
                </Button>
                <Button 
                  onClick={() => setScannedData(null)} 
                  variant="ghost"
                  className="w-full h-12 hover:bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
