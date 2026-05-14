"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Key, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Profile Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Fetch user profile on load
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setName(user.name || "");
      setEmail(user.email || "");
    }

    // Fetch dynamic market prices
    const fetchMarketPrices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/market`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.gold) {
          setMarketData(data);
        }
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      }
    };
    fetchMarketPrices();
  }, []);

  const handleUpdateProfile = async () => {
    if (!name || !email) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/users/profile`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Profile updated successfully!");
        setActiveModal(null);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      alert("Error updating profile");
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/users/password`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password changed successfully!");
        setActiveModal(null);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch (error) {
      alert("Error changing password");
    } finally {
      setActionLoading(false);
    }
  };

  const settingsSections = [
    { icon: User, title: "Profile", desc: "Update your personal information" },
    { icon: Shield, title: "Security", desc: "Manage passwords and 2FA" },
    { icon: Bell, title: "Notifications", desc: "Choose what alerts you receive" },
    { icon: Key, title: "API Keys", desc: "Manage your developer keys" },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-white/50">Manage your account preferences and security.</p>
      </div>

      {/* SETTINGS CARDS */}
      <div className="space-y-6">
        {settingsSections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl">
                <section.icon className="w-6 h-6 text-white/70" />
              </div>
              <div>
                <h3 className="text-lg font-medium">{section.title}</h3>
                <p className="text-sm text-white/50">{section.desc}</p>
              </div>
            </div>
            <Button onClick={() => setActiveModal(section.title)} className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
              Manage
            </Button>
          </motion.div>
        ))}
      </div>

      {/* PROFILE MODAL */}
      {activeModal === "Profile" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Profile Settings</h2>
              <button onClick={() => setActiveModal(null)}>
                <X className="w-5 h-5 text-white/50 hover:text-white" />
              </button>
            </div>
            <div className="space-y-4">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 outline-none" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 outline-none" />
              <Button onClick={handleUpdateProfile} disabled={actionLoading} className="w-full bg-white text-black hover:bg-white/90">
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* SECURITY MODAL */}
      {activeModal === "Security" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Security Settings</h2>
              <button onClick={() => setActiveModal(null)}>
                <X className="w-5 h-5 text-white/50 hover:text-white" />
              </button>
            </div>

            {/* 2FA */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-white/50">Extra protection for your account</p>
              </div>
              <button onClick={() => setTwoFactorEnabled(!twoFactorEnabled)} className={`w-14 h-8 rounded-full transition-all relative ${twoFactorEnabled ? "bg-emerald-500" : "bg-white/10"}`}>
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${twoFactorEnabled ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>

            {/* PASSWORD CHANGE */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60">Current Password</label>
                <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" placeholder="Enter current password" className="w-full mt-2 h-11 rounded-xl bg-white/5 border border-white/10 px-4 outline-none" />
              </div>
              <div>
                <label className="text-sm text-white/60">New Password</label>
                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="Enter new password" className="w-full mt-2 h-11 rounded-xl bg-white/5 border border-white/10 px-4 outline-none" />
              </div>
              <div>
                <label className="text-sm text-white/60">Confirm Password</label>
                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm new password" className="w-full mt-2 h-11 rounded-xl bg-white/5 border border-white/10 px-4 outline-none" />
              </div>
            </div>

            <Button onClick={handleChangePassword} disabled={actionLoading} className="w-full bg-white text-black hover:bg-white/90">
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Security Settings"}
            </Button>
          </motion.div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {activeModal === "Notifications" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Notification Preferences</h2>
              <button onClick={() => setActiveModal(null)}>
                <X className="w-5 h-5 text-white/50 hover:text-white" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-white/50">Receive payment and security alerts</p>
              </div>
              <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className={`w-14 h-8 rounded-full transition-all relative ${notificationsEnabled ? "bg-indigo-500" : "bg-white/10"}`}>
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${notificationsEnabled ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>

            {/* MARKET ALERTS */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider">Market Suggestions & Alerts</h3>
              <div className="space-y-3">
                {marketData ? (
                  <>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Gold Price Alert</p>
                          <p className="text-sm text-white/50 mt-1">Gold prices {marketData.gold.percentChange > 0 ? 'jumped' : 'dropped'} by {Math.abs(marketData.gold.percentChange)}% today</p>
                        </div>
                        <span className="text-yellow-400 font-semibold">₹{marketData.gold.price}/g</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-gray-400/10 to-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Silver Market Update</p>
                          <p className="text-sm text-white/50 mt-1">Silver showing {marketData.silver.percentChange > 0 ? 'bullish' : 'bearish'} momentum ({marketData.silver.percentChange}%)</p>
                        </div>
                        <span className="text-gray-300 font-semibold">₹{marketData.silver.price}/g</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Crypto Market Insight</p>
                          <p className="text-sm text-white/50 mt-1">Bitcoin {marketData.crypto.percentChange > 0 ? 'gained' : 'lost'} {Math.abs(marketData.crypto.percentChange)}% in last 24h</p>
                        </div>
                        <span className="text-emerald-400 font-semibold">₹{(marketData.crypto.price / 100000).toFixed(1)}L</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-white/50 bg-white/5 rounded-xl animate-pulse">
                    Loading live market data...
                  </div>
                )}
              </div>
            </div>

            <Button onClick={() => setActiveModal(null)} className="w-full bg-white text-black hover:bg-white/90">
              Save Preferences
            </Button>
          </motion.div>
        </div>
      )}

      {/* API KEYS MODAL */}
      {activeModal === "API Keys" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">API Keys</h2>
              <button onClick={() => setActiveModal(null)}>
                <X className="w-5 h-5 text-white/50 hover:text-white" />
              </button>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-white/50 mb-2">Active API Key</p>
              <div className="flex items-center justify-between gap-3">
                <code className="text-sm text-emerald-400 break-all">pk_live_82hd8shd82hd8sh</code>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <Button onClick={() => { alert("New API key generated."); setActiveModal(null); }} className="w-full bg-white text-black hover:bg-white/90">
              Generate New Key
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}