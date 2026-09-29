import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../../services/api';
import { MessageSquare, X, Send, Bot, User, Sparkles, Compass } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hi! I'm Exploria Smart Travel Assistant. How can I help with your destination, weather, or package search today?",
      suggestedActions: ['Top Destinations', 'Packages for Manali', 'Check Weather', 'Find Guide']
    }
  ]);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  async function handleSend(customText) {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsgObj = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsgObj]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await chatService.sendMessage(textToSend);
      if (res.success) {
        const botMsgObj = {
          id: Date.now() + 1,
          sender: 'bot',
          text: res.data.reply,
          suggestedActions: res.data.suggestedActions || []
        };
        setMessages((prev) => [...prev, botMsgObj]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "I'm having trouble connecting right now. Please try again or check our FAQ page."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleActionClick(action) {
    if (action.includes('Weather')) {
      navigate('/weather');
      setIsOpen(false);
    } else if (action.includes('Guide')) {
      navigate('/guides');
      setIsOpen(false);
    } else if (action.includes('Packages') || action.includes('Manali')) {
      navigate('/packages');
      setIsOpen(false);
    } else if (action.includes('Destinations')) {
      navigate('/destinations');
      setIsOpen(false);
    } else {
      handleSend(action);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white p-4 rounded-full shadow-2xl shadow-teal-500/40 hover:scale-105 transition-all duration-300"
        >
          <Bot className="w-7 h-7 animate-bounce-short" />
          <span className="hidden md:inline font-bold text-sm pr-2">Ask Exploria AI</span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-slate-900 p-4 border-b border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Exploria Assistant</h3>
                <p className="text-[11px] text-teal-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AI & FAQ Tourism Engine
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-950/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-teal-500 text-white rounded-br-none shadow-md shadow-teal-500/20'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Suggested Actions */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act)}
                          className="text-[11px] bg-slate-800 hover:bg-teal-600/30 text-teal-300 hover:text-white border border-teal-500/30 px-3 py-1 rounded-full transition"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-teal-400 p-2">
                <Compass className="w-4 h-4 animate-spin" />
                <span>Exploria AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about packages, weather, guides..."
              className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputMessage.trim()}
              className="p-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white rounded-xl transition shadow-md shadow-teal-500/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
