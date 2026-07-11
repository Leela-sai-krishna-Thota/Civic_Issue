import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaTimes, FaPaperPlane, FaUser } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini API Key rotation
const GEMINI_KEYS = (process.env.REACT_APP_GEMINI_API_KEY || "")
  .split(",")
  .map((key) => key.trim())
  .filter((key) => key.length > 0);
let keyIndex = 0;
const getNextKey = () => {
  if (GEMINI_KEYS.length === 0) {
    console.error("No Gemini API keys found!");
    return null;
  }
  const key = GEMINI_KEYS[keyIndex];
  keyIndex = (keyIndex + 1) % GEMINI_KEYS.length;
  return key;
};
const createAIInstance = () => {
  const key = getNextKey();
  if (!key) {
    throw new Error("No valid Gemini API key available");
  }
  console.log("Using Gemini API Key for chatbot:", key.slice(0, 6) + "...");
  return new GoogleGenerativeAI(key);
};

const QUICK_QUESTIONS = [
  { text: "📝 How do I report a new civic issue?", query: "How do I report a new civic issue?" },
  { text: "🔍 How can I check my report's status?", query: "How can I check the status of my reports?" },
  { text: "👷 Who works on the reported issues?", query: "Who resolves the issues? Who are the workers?" },
  { text: "📞 Contact details of support", query: "What is your contact phone and support email?" }
];

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleQuickQuestion = (query) => {
    sendMessage(query);
  };

  const sendMessage = async (textToSend = null) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    const newMessages = [...messages, { role: "user", content: queryText }];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    const WEBSITE_CONTEXT = `
You are an intelligent, friendly AI assistant for the CivicTracker municipal system.
Help the citizen navigate the platform or understand municipal reporting.
Users can do the following on this website:
1. Register and Login to their Citizen account.
2. Report civic issues (potholes, streetlights, trash, water leakage, or 'Other') via the "Report Issue" page.
3. Automatically analyze reported issue photos with Gemini AI to auto-categorize the reports.
4. Pinpoint their exact location using high-accuracy GPS and verify/adjust it on an interactive map.
5. Track issue statuses ('Submitted', 'In Progress', 'Resolved') in real-time on their Citizen Dashboard.
6. Admins can view all reports, update statuses, assign issues, and register new municipal workers.
7. Workers can log in, view tasks assigned to their departments, and update their completion details.

Contact Details:
- Support Phone: 999-999-9999
- Support Email: citizen.support@example.com

Response Guidelines:
- Keep your answers concise, structured (using bullet points or numbers when helpful), and professional.
- Use friendly, polite emojis.
- If the question is completely unrelated to municipal issues or this CivicTracker app, politely state: "I'm sorry, I can only assist with CivicTracker and municipal reporting topics."
`;

    try {
      const ai = createAIInstance();
      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

      const conversationText = newMessages
        .map((m) => (m.role === "user" ? "User: " : "Assistant: ") + m.content)
        .join("\n");

      const prompt = `${WEBSITE_CONTEXT}\n\nConversation history:\n${conversationText}\nAssistant:`;

      const result = await model.generateContent([{ text: prompt }]);
      const reply = result.response.text?.() || "I apologize, I could not generate a response at this moment.";

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Gemini API error:", error);
      let errorMessage = "Oops! Something went wrong while connecting. Please try again.";

      if (error.message?.includes("API key")) {
        errorMessage = "Configuration error: API key is invalid.";
      } else if (error.message?.includes("quota")) {
        errorMessage = "Service quota exceeded. Please try again shortly.";
      }

      setMessages([
        ...newMessages,
        { role: "assistant", content: errorMessage }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <div className="w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-150 animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-4 py-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-25 p-2 rounded-full">
                <FaRobot className="text-xl text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">Civic Assistant</h3>
                <span className="text-xs text-orange-100 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-400 inline-block animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-10 p-2 rounded-full transition-all"
              aria-label="Close chat"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="bg-orange-50 p-4 rounded-full mb-3 border border-orange-100">
                  <FaRobot className="text-4xl text-orange-500" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-1">Welcome to Civic Support!</h4>
                <p className="text-sm text-gray-500 mb-6">Ask me anything about reporting issues or using CivicTracker.</p>
                
                {/* Suggestions */}
                <div className="w-full space-y-2">
                  <p className="text-xs font-semibold text-gray-400 text-left uppercase tracking-wider mb-2">Suggested Questions</p>
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(q.query)}
                      className="w-full text-left text-xs bg-white hover:bg-orange-50 hover:text-orange-700 text-gray-600 border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm transition-all duration-200"
                    >
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
                    <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 shadow-sm
                      ${msg.role === "user" ? "bg-amber-500 text-white" : "bg-orange-600 text-white"}`}>
                      {msg.role === "user" ? <FaUser size={12} /> : <FaRobot size={12} />}
                    </div>
                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed border whitespace-pre-line
                      ${msg.role === "user" 
                        ? "bg-amber-50 text-amber-900 border-amber-100 rounded-tr-none" 
                        : "bg-white text-gray-800 border-gray-150 rounded-tl-none"}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex gap-2 self-start max-w-[85%] items-center">
                    <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 shadow-sm bg-orange-600 text-white">
                      <FaRobot size={12} />
                    </div>
                    <div className="bg-white text-gray-400 border border-gray-150 px-4 py-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5 shadow-sm">
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700 active:scale-95 transition-all shadow-md disabled:bg-gray-200 disabled:text-gray-400 disabled:scale-100 disabled:shadow-none"
              aria-label="Send message"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-orange-600 to-amber-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 relative group"
          aria-label="Open support chat"
        >
          <FaRobot className="text-2xl group-hover:rotate-12 transition-transform duration-200" />
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full"></span>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
