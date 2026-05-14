"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-indigo-500/30 overflow-hidden">
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex gap-2 items-center text-xl font-bold tracking-tighter">
            <div className="w-6 h-6 rounded-md bg-indigo-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">PayFlow</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-white/50">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#solutions" className="hover:text-white transition-colors">Solutions</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 hidden md:inline-flex">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-black hover:bg-white/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 mt-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] opacity-30 blur-[120px] bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-transparent pointer-events-none" />

        <section className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              The Engine For <br className="hidden md:block" /> Digital Finance
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10"
          >
            Manage your money, automate your bills, and explore AI-powered insights with PayFlow. Built by seniors, for the modern web.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base bg-white text-black hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all">
                Open an Account <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/10 text-white hover:bg-white/5 bg-transparent">
              View Analytics
            </Button>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Wallet, title: "Smart Wallets", desc: "Instantly create unlimited virtual and physical cards for your team." },
              { icon: TrendingUp, title: "AI Analytics", desc: "Gain deeper insight into your financial stack with machine learning forecasts." },
              { icon: ShieldCheck, title: "Bank-Grade Encryption", desc: "AES-256 standard across the whole platform to keep assets totally secure." }
            ].map((Feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-all hover:border-white/10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] group-hover:bg-indigo-500/20 transition-all rounded-full pointer-events-none" />
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
                  <Feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{Feature.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{Feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
