"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br  p-6 md:p-12 flex justify-center items-start">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-[#0A1F3F] animate-in fade-in slide-in-from-bottom-4 duration-700">
            AI Summarizer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
             Transform long paragraphs into concise, easy-to-read summaries in seconds using advanced AI.
          </p>
        </div>

        {/* Input Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden ring-1 ring-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
              <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-100" />
              Input Text
            </CardTitle>
            <CardDescription>
              Paste your article, notes, or document content below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your text here..."
              className="min-h-[200px] text-base p-4 resize-none border-slate-200 focus-visible:ring-indigo-500/50 bg-white"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex justify-end bg-slate-50/50 p-4">
            <Button
              onClick={handleSummarize}
              disabled={loading || !text.trim()}
              className="px-8 py-6 text-lg font-semibold bg-[#0A1F3F] hover:bg-[#1B3B6E] shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  Summarize Text
                  <Sparkles className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Summary Result */}
        <AnimatePresence>
            {summary && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-emerald-100/50 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                    <div className="flex justify-between items-center">
                    <CardTitle className="text-emerald-800 flex items-center gap-2">
                        Summary Result
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100"
                    >
                        {copied ? (
                        <Check className="h-4 w-4 mr-1" />
                        ) : (
                        <Copy className="h-4 w-4 mr-1" />
                        )}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {summary}
                    </div>
                </CardContent>
                </Card>
            </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AISummarizerPage;
