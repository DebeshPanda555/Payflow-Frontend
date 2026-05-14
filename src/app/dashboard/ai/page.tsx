"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, User, Send, BrainCircuit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const INITIAL_MESSAGES = [
  { role: "assistant", content: "Hello John! I'm your PayFlow AI Finance Assistant. I've analyzed your spending over the last 30 days. You're doing great, but I noticed you spent $120 more on dining out this month. Would you like some tips to optimize your budget?" },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setMessages([
        { role: "assistant", content: `Hello ${user.name.split(' ')[0]}! I'm your PayFlow AI Finance Assistant. I've analyzed your live spending and balances. How can I help you optimize your finances today?` }
      ]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "Sorry, I encountered an error. Please make sure GEMINI_API_KEY is configured." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" /> AI Wealth Assistant
          </h1>
          <p className="text-white/50">Personalized financial insights powered by machine learning.</p>
        </div>
      </div>

      <div className="flex-1 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-md flex flex-col overflow-hidden relative">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 blur-[100px] pointer-events-none" />

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-white'}`}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'assistant' ? 'bg-white/5 border border-white/10 text-white/90' : 'bg-indigo-500 text-white'}`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-white/10 bg-black/40 relative z-10">
          <div className="relative flex items-center">
            <BrainCircuit className="absolute left-4 w-5 h-5 text-indigo-400" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your spending habits, forecasts, or investment advice..."
              className="bg-white/5 border-white/10 h-14 pl-12 pr-32 rounded-xl focus-visible:ring-indigo-500 text-white placeholder:text-white/30"
            />
            <Button 
              onClick={handleSend}
              className="absolute right-2 h-10 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-6"
            >
              <Send className="w-4 h-4 mr-2" /> Send
            </Button>
          </div>
          <div className="flex gap-2 mt-3 px-1 overflow-x-auto pb-1 hide-scrollbar">
            {["Analyze my food expenses", "How much should I save?", "Predict next month's bills"].map((suggestion) => (
              <button 
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="whitespace-nowrap px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white/60 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
