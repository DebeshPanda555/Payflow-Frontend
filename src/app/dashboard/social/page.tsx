"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Share, ReceiptText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FEED = [
  { id: 1, user: "Sarah Jenkins", action: "paid", target: "Michael Scott", amount: "$45.00", desc: "Dinner at Dorsia 🍷🥩", likes: 3, comments: 1 },
  { id: 2, user: "Elena", action: "split", target: "Miami Trip Group", amount: "$120.00", desc: "Airbnb deposits 🌴", likes: 8, comments: 4 },
  { id: 3, user: "David Wu", action: "charged", target: "Alex", amount: "$15.00", desc: "Uber from concert 🚗", likes: 0, comments: 0 },
];

export default function SocialPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
       <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Social Feed</h1>
          <p className="text-white/50">Pay, split, and share moments with friends.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
          Split a Bill
        </button>
      </div>

      <div className="space-y-6">
        {FEED.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 border border-white/10">
                  <AvatarFallback>{item.user[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">
                    <span className="font-semibold text-white">{item.user}</span>
                    <span className="text-white/50 mx-1">{item.action}</span>
                    <span className="font-semibold text-white">{item.target}</span>
                  </p>
                  <p className="text-[13px] text-white/50 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-mono font-medium tracking-tight ${item.action === 'split' ? 'text-purple-400' : 'text-emerald-400'}`}>
                  {item.amount}
                </span>
              </div>
            </div>

            <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
              <button className="flex items-center gap-2 text-xs text-white/50 hover:text-rose-400 transition-colors group">
                <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" /> {item.likes}
              </button>
              <button className="flex items-center gap-2 text-xs text-white/50 hover:text-indigo-400 transition-colors group">
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> {item.comments}
              </button>
              <button className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors">
                <Share className="w-4 h-4" /> Share
              </button>
              <button className="flex items-center gap-2 text-xs text-white/50 hover:text-white ml-auto border border-white/10 px-3 py-1 rounded-md bg-white/5 transition-colors">
                <ReceiptText className="w-3 h-3" /> Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
