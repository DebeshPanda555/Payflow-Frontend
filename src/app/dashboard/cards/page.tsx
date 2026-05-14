"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Plus,
  CreditCard,
  Shield,
  Settings2,
  Lock,
  EyeOff,
  Eye,
  Globe,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BalanceConverterModal } from "@/components/BalanceConverterModal";

const INITIAL_CARDS = [
  {
    id: "1",
    type: "Virtual",
    name: "Software Subscriptions",
    number: "•••• •••• •••• 4242",
    fullNumber: "4532 8891 7782 4242",
    expiry: "12/25",
    cvv: "123",
    color: "from-indigo-600 to-purple-600",
    limit: 50000,
    balance: 0,
    frozen: false,
  },
  {
    id: "2",
    type: "Physical",
    name: "Travel Card",
    number: "•••• •••• •••• 8899",
    fullNumber: "5214 7782 9921 8899",
    expiry: "08/26",
    cvv: "456",
    color: "from-emerald-600 to-teal-600",
    limit: 100000,
    balance: 0,
    frozen: false,
  },
];

export default function CardsPage() {
  const [cards, setCards] = useState(INITIAL_CARDS);

  const [selectedCardId, setSelectedCardId] =
    useState(INITIAL_CARDS[0].id);

  const [isFlipped, setIsFlipped] =
    useState(false);

  const [showDetails, setShowDetails] =
    useState(false);

  const [isConverterOpen, setIsConverterOpen] =
    useState(false);

  const [showTopupModal, setShowTopupModal] =
    useState(false);

  const [showNewCardModal, setShowNewCardModal] =
    useState(false);

  const [showLimitModal, setShowLimitModal] =
    useState(false);

  const [topupAmount, setTopupAmount] =
    useState("");

  const [paymentSource, setPaymentSource] =
    useState("Wallet Balance");

  const [isAddingMoney, setIsAddingMoney] =
    useState(false);

  const [newCardName, setNewCardName] =
    useState("");

  const [newCardType, setNewCardType] =
    useState("Virtual");

  const [cardLimit, setCardLimit] =
    useState(50000);

  const quickAmounts = [500, 1000, 5000, 10000];

  const selectedCard = cards.find(
    (card) => card.id === selectedCardId
  );

  if (!selectedCard) return null;

  const createNewCard = () => {
    if (!newCardName.trim()) return;

    const randomLast4 = Math.floor(
      1000 + Math.random() * 9000
    );

    const newCard = {
      id: Date.now().toString(),
      type: newCardType,
      name: newCardName,
      number: `•••• •••• •••• ${randomLast4}`,
      fullNumber: `4532 8891 7782 ${randomLast4}`,
      expiry: "12/28",
      cvv: `${Math.floor(
        100 + Math.random() * 900
      )}`,
      color:
        newCardType === "Virtual"
          ? "from-indigo-600 to-purple-600"
          : "from-emerald-600 to-teal-600",
      limit: cardLimit,
      balance: 0,
      frozen: false,
    };

    const updatedCards = [...cards, newCard];

    setCards(updatedCards);

    setSelectedCardId(newCard.id);

    setShowNewCardModal(false);

    setNewCardName("");

    setNewCardType("Virtual");

    setCardLimit(50000);

    setTimeout(() => {
      setSelectedCardId(newCard.id);
    }, 0);

    alert("New card created successfully.");
  };

  const addMoneyToCard = () => {
    if (
      !topupAmount ||
      Number(topupAmount) <= 0
    )
      return;

    setIsAddingMoney(true);

    setTimeout(() => {
      const updatedCards = cards.map(
        (card) =>
          card.id === selectedCard.id
            ? {
                ...card,
                balance:
                  card.balance +
                  Number(topupAmount),
              }
            : card
      );

      setCards(updatedCards);

      setIsAddingMoney(false);

      setShowTopupModal(false);

      setTopupAmount("");

      alert(
        `₹${Number(
          topupAmount
        ).toLocaleString()} added successfully`
      );
    }, 1200);
  };

  const toggleFreeze = () => {
    const updatedCards = cards.map(
      (card) =>
        card.id === selectedCard.id
          ? {
              ...card,
              frozen: !card.frozen,
            }
          : card
    );

    setCards(updatedCards);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* BALANCE MODAL */}
      <BalanceConverterModal
        isOpen={isConverterOpen}
        onClose={() =>
          setIsConverterOpen(false)
        }
        currentBalance={
          selectedCard.balance
        }
      />

      {/* TOPUP MODAL */}
      <AnimatePresence>
        {showTopupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              className="w-full max-w-md bg-[#111111]/95 border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Add Money
                  </h2>

                  <p className="text-sm text-white/50 mt-1">
                    Top up your card instantly
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowTopupModal(false)
                  }
                >
                  <X className="w-5 h-5 text-white/50 hover:text-white" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                <p className="text-sm text-white/50">
                  Current Balance
                </p>

                <motion.h3
                  key={selectedCard.balance}
                  initial={{
                    scale: 1.1,
                    opacity: 0.7,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  className="text-3xl font-bold mt-1"
                >
                  ₹
                  {selectedCard.balance.toLocaleString()}
                </motion.h3>
              </div>

              <div className="space-y-3">
                <label className="text-sm text-white/60">
                  Enter Amount
                </label>

                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) =>
                    setTopupAmount(
                      e.target.value
                    )
                  }
                  placeholder="Enter amount"
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map(
                  (amount) => (
                    <button
                      key={amount}
                      onClick={() =>
                        setTopupAmount(
                          amount.toString()
                        )
                      }
                      className="h-10 rounded-lg bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/30 transition-all text-sm"
                    >
                      ₹{amount}
                    </button>
                  )
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm text-white/60">
                  Payment Source
                </label>

                <select
                  value={paymentSource}
                  onChange={(e) =>
                    setPaymentSource(
                      e.target.value
                    )
                  }
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 outline-none"
                >
                  <option>
                    Wallet Balance
                  </option>

                  <option>
                    Bank Account
                  </option>

                  <option>UPI</option>
                </select>
              </div>

              <Button
                disabled={
                  isAddingMoney ||
                  !topupAmount ||
                  Number(topupAmount) <= 0
                }
                onClick={addMoneyToCard}
                className="w-full h-12 bg-white text-black hover:bg-white/90"
              >
                {isAddingMoney
                  ? "Processing..."
                  : "Add Money"}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW CARD MODAL */}
      <AnimatePresence>
        {showNewCardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              className="w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-5"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Create New Card
                </h2>

                <button
                  onClick={() =>
                    setShowNewCardModal(false)
                  }
                >
                  <X className="w-5 h-5 text-white/50 hover:text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  value={newCardName}
                  onChange={(e) =>
                    setNewCardName(
                      e.target.value
                    )
                  }
                  placeholder="Card Name"
                  className="w-full h-11 rounded-lg bg-white/5 border border-white/10 px-4 outline-none"
                />

                <select
                  value={newCardType}
                  onChange={(e) =>
                    setNewCardType(
                      e.target.value
                    )
                  }
                  className="w-full h-11 rounded-lg bg-white/5 border border-white/10 px-4 outline-none"
                >
                  <option value="Virtual">
                    Virtual
                  </option>

                  <option value="Physical">
                    Physical
                  </option>
                </select>

                <div>
                  <p className="text-sm text-white/60 mb-2">
                    Spending Limit
                  </p>

                  <input
                    type="range"
                    min={1000}
                    max={200000}
                    step={1000}
                    value={cardLimit}
                    onChange={(e) =>
                      setCardLimit(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full"
                  />

                  <p className="text-sm mt-2 text-indigo-400 font-medium">
                    ₹
                    {cardLimit.toLocaleString()}
                  </p>
                </div>

                <Button
                  onClick={createNewCard}
                  className="w-full bg-white text-black hover:bg-white/90"
                >
                  Create Card
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIMIT MODAL */}
      <AnimatePresence>
        {showLimitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              className="w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-6 space-y-5"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Update Card Limit
                </h2>

                <button
                  onClick={() =>
                    setShowLimitModal(false)
                  }
                >
                  <X className="w-5 h-5 text-white/50 hover:text-white" />
                </button>
              </div>

              <div>
                <p className="text-sm text-white/60 mb-3">
                  Adjust spending limit
                </p>

                <input
                  type="range"
                  min={1000}
                  max={500000}
                  step={1000}
                  value={selectedCard.limit}
                  onChange={(e) => {
                    const updatedCards =
                      cards.map(
                        (card) =>
                          card.id ===
                          selectedCard.id
                            ? {
                                ...card,
                                limit:
                                  Number(
                                    e.target
                                      .value
                                  ),
                              }
                            : card
                      );

                    setCards(updatedCards);
                  }}
                  className="w-full"
                />

                <p className="mt-3 text-lg font-semibold text-indigo-400">
                  ₹
                  {selectedCard.limit.toLocaleString()}
                </p>

                <Button
                  onClick={() => {
                    setShowLimitModal(
                      false
                    );

                    alert(
                      "Card limit updated."
                    );
                  }}
                  className="w-full mt-5 bg-white text-black hover:bg-white/90"
                >
                  Save Limit
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Your Cards
          </h1>

          <p className="text-white/50">
            Manage virtual and physical
            cards securely.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() =>
              setIsConverterOpen(true)
            }
            variant="outline"
            className="bg-white/5 border-white/10 hover:bg-white/10"
          >
            <Globe className="w-4 h-4 mr-2" />
            Card Overview
          </Button>

          <Button
            className="bg-white text-black hover:bg-white/90"
            onClick={() =>
              setShowNewCardModal(true)
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            New Card
          </Button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CARD LIST */}
        <div className="space-y-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => {
                setSelectedCardId(
                  card.id
                );

                setIsFlipped(false);

                setShowDetails(false);
              }}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                selectedCardId === card.id
                  ? "bg-white/10 border-indigo-500/50"
                  : "bg-white/[0.02] border-white/5 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${card.color}`}
                >
                  <CreditCard className="w-5 h-5 text-white" />
                </div>

                <div>
                  <p className="font-medium text-sm">
                    {card.name}
                  </p>

                  <p className="text-xs text-white/50">
                    {card.number}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold">
                  ₹
                  {card.balance.toLocaleString()}
                </p>

                <p className="text-xs text-white/40">
                  {card.type}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 space-y-8">
          {/* CARD */}
          <div
            className="flex justify-center h-[240px]"
            style={{
              perspective: "1000px",
            }}
          >
            <motion.div
              className="relative w-[380px] h-[240px] rounded-2xl shadow-2xl preserve-3d cursor-pointer"
              animate={{
                rotateY: isFlipped
                  ? 180
                  : 0,
              }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              onClick={() =>
                setIsFlipped(!isFlipped)
              }
            >
              {/* FRONT */}
              <div
                className={`absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br ${selectedCard.color} p-6 flex flex-col justify-between border border-white/20 ${
                  selectedCard.frozen
                    ? "opacity-60"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold italic text-lg">
                    PayFlow
                  </span>

                  <span className="text-xs px-2 py-1 rounded-md bg-black/20">
                    {selectedCard.type}
                  </span>
                </div>

                <div>
                  <p className="font-mono text-xl tracking-[0.25em] mb-2">
                    {showDetails
                      ? selectedCard.fullNumber
                      : selectedCard.number}
                  </p>

                  <div className="flex justify-between text-sm opacity-80">
                    <span>
                      {selectedCard.name}
                    </span>

                    <span>
                      {
                        selectedCard.expiry
                      }
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-white/60 uppercase tracking-wider">
                      Available Balance
                    </p>

                    <motion.h2
                      key={
                        selectedCard.balance
                      }
                      initial={{
                        opacity: 0.6,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="text-2xl font-bold mt-1"
                    >
                      ₹
                      {selectedCard.balance.toLocaleString()}
                    </motion.h2>
                  </div>
                </div>
              </div>

              {/* BACK */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br ${selectedCard.color} border border-white/20`}
              >
                <div className="w-full h-12 bg-black/80 mt-6" />

                <div className="p-6">
                  <div className="w-full h-10 bg-white rounded-md flex items-center justify-end px-4">
                    <span className="font-mono text-black font-bold text-lg">
                      {selectedCard.cvv}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button
              variant="outline"
              onClick={() =>
                setShowDetails(
                  !showDetails
                )
              }
              className="bg-white/5 border-white/10 h-16 flex flex-col gap-2"
            >
              {showDetails ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}

              <span className="text-xs">
                {showDetails
                  ? "Hide"
                  : "Details"}
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={toggleFreeze}
              className={`h-16 flex flex-col gap-2 ${
                selectedCard.frozen
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <Lock className="w-4 h-4" />

              <span className="text-xs">
                {selectedCard.frozen
                  ? "Frozen"
                  : "Freeze"}
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                setShowTopupModal(true)
              }
              className="bg-white/5 border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 h-16 flex flex-col gap-2"
            >
              <Plus className="w-4 h-4 text-emerald-400" />

              <span className="text-xs">
                Add Money
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                setShowLimitModal(true)
              }
              className="bg-white/5 border-white/10 h-16 flex flex-col gap-2"
            >
              <Settings2 className="w-4 h-4 text-blue-400" />

              <span className="text-xs">
                Limits
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                alert(
                  "Card reported successfully."
                )
              }
              className="bg-white/5 border-red-500/20 h-16 flex flex-col gap-2 text-red-500/70"
            >
              <Shield className="w-4 h-4" />

              <span className="text-xs">
                Report
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}