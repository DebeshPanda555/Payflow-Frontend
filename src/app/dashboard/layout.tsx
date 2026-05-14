"use client";

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Wallet, CreditCard, PieChart, 
  Settings, Bell, Search, Menu, MessageSquare, LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: Home, href: "/dashboard" },
  { name: "Wallets", icon: Wallet, href: "/dashboard/wallets" },
  { name: "Virtual Cards", icon: CreditCard, href: "/dashboard/cards" },
  { name: "Scan to Pay", icon: Search, href: "/dashboard/scan" },
  { name: "Autopay", icon: Bell, href: "/dashboard/autopay" },
  { name: "Analytics", icon: PieChart, href: "/dashboard/analytics" },
  { name: "AI Assistant", icon: MessageSquare, href: "/dashboard/ai" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUserName(JSON.parse(userStr).name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-72 hidden md:flex flex-col border-r border-white/10 bg-black/50 backdrop-blur-md sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="flex gap-2 items-center text-xl font-bold tracking-tighter">
            <div className="w-6 h-6 rounded-md bg-indigo-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">PayFlow</span>
          </div>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`relative px-4 py-3 flex items-center gap-3 rounded-xl transition-all ${isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                  {isActive && (
                    <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-white/10 rounded-xl" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                  )}
                  <item.icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium relative z-10">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-4">
          <button onClick={handleLogout} className="w-full relative px-4 py-3 flex items-center gap-3 rounded-xl transition-all text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
            <LogOut className="w-5 h-5 relative z-10" />
            <span className="font-medium relative z-10">Log Out</span>
          </button>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="w-10 h-10 border border-white/10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-white/50">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Top Navbar */}
        <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4 hidden md:flex">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-white/50" />
              <input 
                type="text" 
                placeholder="Search transactions, wallets..." 
                className="bg-white/5 border border-white/10 rounded-full h-9 pl-9 pr-4 text-sm w-80 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <Menu className="w-6 h-6 text-white/70" />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard/settings" className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-white/70" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full border border-black" />
            </Link>
            <Avatar className="w-8 h-8 md:hidden">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 relative z-10 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
