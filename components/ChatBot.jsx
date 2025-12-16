import { ChevronUp, MessageCircleMoreIcon, Loader2 } from "lucide-react";
import axios from "axios";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function AITutorChatbot({ courseId }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm your AI tutor. How can I help you today?" }
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
      // Prepare messages for API (map 'text' to 'content')
      const apiMessages = [...messages, userMsg].map((msg) => ({
        role: msg.role,
        content: msg.text,
      }));

      const response = await axios.post("/api/chat", {
        messages: apiMessages,
        courseId: courseId
      });

      const assistantMsg = {
        role: "assistant",
        text: response.data.result,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg = {
        role: "assistant",
        text: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 bg-[#0A1F3F] text-white px-5 py-4 rounded-full shadow-2xl hover:bg-[#1B3B6E] transition"
        onClick={() => setOpen(!open)}
      >
        {open ?  <ChevronUp /> : <MessageCircleMoreIcon />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl flex flex-col h-[60vh] border border-gray-200 animate-fadeIn">
          <h1 className="text-lg font-bold text-center p-4 bg-[#0A1F3F] text-white rounded-t-2xl">
            AI  ChatBot Tutor
          </h1>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[80%] text-sm ${
                  msg.role === "assistant"
                    ? "bg-blue-200 text-left"
                    : "bg-gray-300 ml-auto text-right"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded-xl max-w-[80%] text-sm bg-blue-200 text-left flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>

          <div className="p-3 flex gap-2 border-t border-gray-300 bg-white">
            <input
              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Type..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="px-4 py-2 bg-[#0A1F3F] text-white rounded-xl text-sm hover:bg-[#1B3B6E]"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
