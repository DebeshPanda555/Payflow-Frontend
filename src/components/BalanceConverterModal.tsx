"use client";

import { motion, AnimatePresence } from "framer-motion";

import {
  X,
  Wallet,
  TrendingUp,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

export function BalanceConverterModal({
  isOpen,
  onClose,
  currentBalance,
}: Props) {
  if (!isOpen) return null;

  const estimatedUSD = currentBalance / 83;
  const estimatedEUR = currentBalance / 90;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: 20,
            }}
            transition={{
              duration: 0.25,
            }}
            className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0f0f0f]/95 shadow-2xl overflow-hidden"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-semibold">
                  Card Overview
                </h2>

                <p className="text-sm text-white/50 mt-1">
                  Live balance insights and currency overview
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* BALANCE SECTION */}
            <div className="p-6 space-y-6">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-indigo-500/5 border border-indigo-500/20 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/50 uppercase tracking-wider">
                      Current Balance
                    </p>

                    <motion.h1
                      key={currentBalance}
                      initial={{
                        scale: 1.05,
                        opacity: 0.7,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                      }}
                      className="text-4xl font-bold mt-2"
                    >
                      ₹
                      {currentBalance.toLocaleString()}
                    </motion.h1>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-indigo-400" />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-emerald-400 text-sm">
                  <TrendingUp className="w-4 h-4" />

                  <span>
                    Balance synced successfully
                  </span>
                </div>
              </motion.div>

              {/* CURRENCY CONVERSION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{
                    y: -2,
                  }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">
                        USD Equivalent
                      </p>

                      <h3 className="text-2xl font-semibold mt-2">
                        $
                        {estimatedUSD.toFixed(
                          2
                        )}
                      </h3>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{
                    y: -2,
                  }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">
                        EUR Equivalent
                      </p>

                      <h3 className="text-2xl font-semibold mt-2">
                        €
                        {estimatedEUR.toFixed(
                          2
                        )}
                      </h3>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <ShieldCheck className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* INSIGHTS */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-lg font-medium mb-4">
                  Smart Insights
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Spending Health
                      </p>

                      <p className="text-sm text-white/50">
                        Your card activity looks stable
                      </p>
                    </div>

                    <span className="text-emerald-400 font-medium">
                      Good
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Savings Suggestion
                      </p>

                      <p className="text-sm text-white/50">
                        Consider maintaining 20% reserve balance
                      </p>
                    </div>

                    <span className="text-indigo-400 font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 bg-white/5 border-white/10 hover:bg-white/10"
                >
                  Close
                </Button>

                <Button className="flex-1 bg-white text-black hover:bg-white/90">
                  Download Statement
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}