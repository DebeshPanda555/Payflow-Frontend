"use client";

import { motion } from "framer-motion";
import { Users, AlertTriangle, MonitorPlay, BarChart, ShieldAlert } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ALERTS = [
  { id: 1, type: "fraud", desc: "Unusual login activity detected for user ID #84920 from new IP region.", time: "10 mins ago" },
  { id: 2, type: "system", desc: "API rate limit reached for endpoint /v1/payments/transfer.", time: "42 mins ago" },
  { id: 3, type: "kyc", desc: "Pending KYC approval for high-volume corporate account.", time: "1 hour ago" },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
              Admin Shield
            </h1>
            <p className="text-white/50 text-sm">System oversight, fraud monitoring, and compliance.</p>
          </div>
          <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> SYSTEM SECURE
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, label: "Active Users", value: "1.4M", trend: "+12k today" },
            { icon: MonitorPlay, label: "Server Load", value: "24%", trend: "Stable" },
            { icon: BarChart, label: "Daily Volume", value: "$42.5M", trend: "+5% vs yesterday" },
            { icon: ShieldAlert, label: "Blocked Frauds", value: "1,420", trend: "$300k prevented" },
          ].map((kpi, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 border border-white/10 bg-white/[0.01] rounded-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 blur-xl pointer-events-none" />
              <kpi.icon className="w-5 h-5 text-white/40 mb-4" />
              <h2 className="text-3xl font-mono font-bold mb-1">{kpi.value}</h2>
              <p className="text-sm font-medium text-white/70">{kpi.label}</p>
              <p className="text-xs text-white/30 mt-2 font-mono">{kpi.trend}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
           <div className="p-6 border border-white/10 bg-white/[0.01] rounded-xl">
             <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
               <AlertTriangle className="w-5 h-5 text-yellow-500" /> Security & Fraud Alerts
             </h3>
             <div className="space-y-4">
               {ALERTS.map(alert => (
                 <div key={alert.id} className="p-4 bg-black border border-white/5 rounded-lg flex items-start gap-4">
                   <div className={`w-2 h-2 mt-2 rounded-full ${alert.type === 'fraud' ? 'bg-red-500' : alert.type === 'system' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                   <div>
                     <p className="text-sm text-white/80">{alert.desc}</p>
                     <p className="text-xs text-white/40 mt-1 font-mono">{alert.time}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           <div className="p-6 border border-white/10 bg-white/[0.01] rounded-xl">
             <h3 className="text-lg font-semibold mb-6">Pending KYC Approvals</h3>
             <div className="space-y-4">
               {[1,2,3,4].map(id => (
                 <div key={id} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                   <div className="flex gap-3 items-center">
                     <Avatar className="w-8 h-8"><AvatarFallback>ID</AvatarFallback></Avatar>
                     <div>
                       <p className="text-sm font-medium">Business Account #{850+id}</p>
                       <p className="text-xs text-white/40">Registered in US</p>
                     </div>
                   </div>
                   <button className="text-xs font-mono px-3 py-1 bg-white/10 rounded-md hover:bg-white/20">Review</button>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
