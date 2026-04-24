"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const botResponses: { [key: string]: string } = {
  hello: "Hey! I'm Buddy, your AI trading agent for PumpFun. Ask me anything about memecoin trading!",
  pumpfun: "PumpFun is where new memecoins launch on Solana every minute. I monitor it 24/7 and snipe the best opportunities for you!",
  price: "One-time payment in SOL for lifetime access - currently 6 SOL during our launch promo (normally 8 SOL). No subscription, no hidden fees!",
  how: "I run locally on your PC, connected to your Solana wallet. When a new token on PumpFun matches your filters, I buy it in milliseconds - faster than any human!",
  safe: "100% safe! I run on YOUR computer. Your private keys never leave your machine. I can't access your wallet without you - everything is local and encrypted.",
  rug: "I have built-in rug protection! I analyze dev wallets, liquidity, holder distribution, and more. You can set filters to avoid suspicious tokens.",
  profit: "I don't guarantee gains - this is memecoin degen trading after all! But I give you speed and smart filtering to maximize your edge. Many users report 5-50x gains on good snipes.",
  start: "Easy! 1) Create an account, 2) Download Buddy, 3) Import your Solana wallet, 4) Set your filters, and start trading! You can test with paper trading first.",
  sol: "I work on Solana with PumpFun tokens. I need a Solana wallet (Phantom, Solflare, etc.) with some SOL for transactions. 1-2 SOL is enough to start.",
  default: "Great question! I'm here to help you trade memecoins on PumpFun. Check out our demo or pricing to get started!",
};

function getBotResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey") || lowerMessage.includes("salut")) {
    return botResponses.hello;
  }
  if (lowerMessage.includes("pumpfun") || lowerMessage.includes("pump.fun") || lowerMessage.includes("pump fun")) {
    return botResponses.pumpfun;
  }
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("pay") || lowerMessage.includes("prix")) {
    return botResponses.price;
  }
  if (lowerMessage.includes("how") && lowerMessage.includes("work")) {
    return botResponses.how;
  }
  if (lowerMessage.includes("safe") || lowerMessage.includes("secure") || lowerMessage.includes("trust") || lowerMessage.includes("key")) {
    return botResponses.safe;
  }
  if (lowerMessage.includes("rug") || lowerMessage.includes("scam") || lowerMessage.includes("filter")) {
    return botResponses.rug;
  }
  if (lowerMessage.includes("profit") || lowerMessage.includes("money") || lowerMessage.includes("earn") || lowerMessage.includes("gain")) {
    return botResponses.profit;
  }
  if (lowerMessage.includes("start") || lowerMessage.includes("begin") || lowerMessage.includes("setup")) {
    return botResponses.start;
  }
  if (lowerMessage.includes("sol") || lowerMessage.includes("solana") || lowerMessage.includes("wallet") || lowerMessage.includes("phantom")) {
    return botResponses.sol;
  }

  return botResponses.default;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! I'm Buddy, your AI trading agent. Ask me anything about trading memecoins on PumpFun!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: getBotResponse(input),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.span
              key="rocket"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-2xl"
            >
              🚀
            </motion.span>
          )}
        </AnimatePresence>

        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              1
            </motion.span>
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] glass-card rounded-3xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden border border-primary/20"
          >
            <div className="p-4 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg text-lg">
                  🚀
                </div>
                <div>
                  <h3 className="font-semibold">Chat with Buddy</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs text-muted">Online - Trading on PumpFun</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.isBot
                        ? "bg-card border border-white/5 text-foreground"
                        : "bg-gradient-to-r from-primary to-accent text-white"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-card border border-white/5 px-4 py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-primary rounded-full" />
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }} className="w-2 h-2 bg-primary rounded-full" />
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-card/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about PumpFun trading..."
                  className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
