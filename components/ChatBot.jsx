import { ChevronUp, MessageCircleMoreIcon, Loader2, X, Send, Bot, User } from "lucide-react";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AITutorChatbot({ courseId }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm your AI tutor. Ready to learn something new?" }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((msg) => ({
        role: msg.role,
        content: msg.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
          courseId: courseId
        }),
      });

      const data = await response.json();

      const assistantMsg = {
        role: "assistant",
        text: data.result,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg = {
        role: "assistant",
        text: "I'm having a little trouble connecting right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="z-50 relative">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50 ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="p-4 bg-[#0A1F3F] text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-base">AI Tutor</h1>
                  <p className="text-xs text-gray-300 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === "user" 
                      ? "bg-[#0A1F3F]/10 text-[#0A1F3F]" 
                      : "bg-[#0A1F3F]/10 text-[#0A1F3F]"
                  }`}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={`p-3.5 rounded-2xl text-sm max-w-[80%] shadow-sm leading-relaxed ${
                    msg.role === "assistant"
                      ? "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                      : "bg-[#0A1F3F] text-white rounded-tr-none border border-transparent"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 bg-[#0A1F3F]/10 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#0A1F3F]" />
                  </div>
                  <div className="p-4 bg-white rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-2 h-2 bg-[#0A1F3F] rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="w-2 h-2 bg-[#0A1F3F] rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="w-2 h-2 bg-[#0A1F3F] rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef}></div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2 relative">
                <input
                  className="flex-1 bg-slate-100 text-slate-800 px-4 py-3 rounded-xl border border-transparent focus:bg-white focus:border-[#0A1F3F]/20 focus:ring-4 focus:ring-[#0A1F3F]/10 transition-all outline-none text-sm placeholder:text-slate-400"
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-[#0A1F3F] text-white rounded-xl shadow-lg hover:shadow-[#0A1F3F]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 p-4 bg-[#0A1F3F] text-white rounded-full shadow-2xl shadow-[#0A1F3F]/20 hover:shadow-[#0A1F3F]/40 transition-all z-50 group"
        onClick={() => setOpen(!open)}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircleMoreIcon className="w-6 h-6 group-hover:animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
