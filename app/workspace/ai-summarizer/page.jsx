"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Copy, Check, FileText, Zap, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AISummarizerPage = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setSummary("");
    try {
      const response = await axios.post("/api/generate-summary", { text });
      setSummary(response.data.result);
      toast.success("Summary generated successfully!");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || "Failed to generate summary. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen  rounded-2xl dark:bg-[#09090b] relative overflow-hidden font-sans pb-20">


      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 md:pt-20">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-6 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 shadow-sm backdrop-blur-md mb-4">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI-Powered Magic</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Smart Text <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              Summarizer
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Transform lengthy articles, complex documents, or long notes into clear, concise, and easy-to-read summaries in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-12 xl:col-span-7 space-y-6"
          >
            <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl shadow-indigo-500/5 dark:shadow-none border border-white/50 dark:border-white/10 relative group transition-all duration-300 hover:shadow-indigo-500/10">
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Original Text</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Paste your content here</p>
                </div>
              </div>

              <div className="relative">
                <Textarea
                  placeholder="Paste your article, meeting notes, or document content here..."
                  className="min-h-[350px] text-base p-6 resize-none rounded-3xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-zinc-800/50 focus-visible:ring-indigo-500/50 focus-visible:bg-white dark:focus-visible:bg-zinc-800 transition-all shadow-inner"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <div className="absolute bottom-4 right-6 text-sm text-slate-400 font-medium">
                  {text.length} characters
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSummarize}
                  disabled={loading || !text.trim()}
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 border-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Generate Summary
                      <Zap className="ml-2 h-5 w-5 fill-white/20" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-12 xl:col-span-5"
          >
            <AnimatePresence mode="wait">
              {summary ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="h-full"
                >
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-[2.5rem] p-6 shadow-2xl shadow-purple-500/10 border border-indigo-100 dark:border-indigo-500/20 h-full flex flex-col relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <BrainCircuit className="w-48 h-48 text-indigo-500" />
                    </div>

                    <div className="flex items-center justify-between mb-6 px-2 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm border border-slate-100 dark:border-white/5">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Summary</h2>
                          <p className="text-sm text-slate-500 dark:text-purple-300/70">Key takeaways</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        className="rounded-xl bg-white/60 hover:bg-white dark:bg-zinc-800/60 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 shadow-sm transition-all border border-slate-200/50 dark:border-white/10"
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-500 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex-1 bg-white/60 dark:bg-zinc-900/50 rounded-3xl p-6 overflow-y-auto border border-white/50 dark:border-white/10 relative z-10 shadow-inner">
                      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                        {summary}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px]"
                >
                  <div className="bg-white/40 dark:bg-zinc-900/40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] h-full flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm transition-all hover:bg-white/50 dark:hover:bg-zinc-900/50">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-inner text-slate-400 dark:text-slate-500 rotate-6 transition-transform hover:rotate-12 hover:scale-110 duration-300">
                      <BrainCircuit className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Ready to Summarize</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed font-medium">
                      Enter your text on the left and hit generate to see the AI magic happen.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AISummarizerPage;
