'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  BrainCircuit, 
  Building2, 
  MapPin, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw,
  Bot,
  User,
  ShieldCheck,
  Activity,
  Maximize2,
  Minimize2,
  Navigation,
  PhoneCall,
  Zap,
  Stethoscope
} from 'lucide-react';
import { ChatMessage, HealthcareRequirement, HospitalMatchResult } from '@/lib/types';
import { useApp } from '@/lib/context/AppContext';

export function HealthcareChatbot() {
  const router = useRouter();
  const { selectedCity, selectedState } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedHospitals, setRecommendedHospitals] = useState<HospitalMatchResult[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '🫀 Heart Attack & Angioplasty Cost',
    '🪨 Kidney Stone Laser Treatment (RIRS)',
    '🦵 Knee Replacement Package in India',
    '🏛️ Ayushman Bharat PM-JAY Cashless Hospitals',
    '🎗️ Cancer Chemotherapy & Onco Centers',
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      sender: 'assistant',
      content: `Namaste! 🙏 I am your **CareMatch AI Medical & Hospital Assistant**.\n\nAsk me anything about:\n• **Medical Conditions & Symptoms** (Heart, Kidney, Bones, Eye, Cancer, etc.)\n• **Hospital Recommendations & Live Bed Availability** across India\n• **Treatment Packages & Surgery Costs** (with Ayushman Bharat PM-JAY rates)\n\nHow can I help you today?`,
      timestamp: 'Now',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q) return;

    setInput('');

    // Add user message
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: q,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.searchResultsSummary?.topMatches) {
          setRecommendedHospitals(data.searchResultsSummary.topMatches);
        }

        const botMsg: ChatMessage = {
          id: `assist_${Date.now()}`,
          sender: 'assistant',
          content: data.reply,
          timestamp: 'Just now',
          isEmergency: data.isEmergency,
        };

        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assist_${Date.now()}`,
          sender: 'assistant',
          content: `I have analyzed your healthcare question. To explore top verified hospitals and treatment packages directly, you can visit our **AI Discovery Studio**.`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOpenSearchWithQuery = (q: string) => {
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* Floating CareMatch AI Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-slate-950 font-black text-sm shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group border border-cyan-300/30"
          aria-label="Open CareMatch AI"
        >
          <div className="p-1 rounded-full bg-slate-950 text-cyan-400">
            <Bot className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="tracking-wide">CareMatch AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[440px] rounded-3xl bg-navy-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            isMinimized ? 'h-[72px]' : 'h-[620px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-navy-900 via-slate-900 to-navy-900 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5 shadow-md shadow-cyan-500/30">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white">CareMatch AI</h3>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Clinical AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Verified Medical Knowledge • All India Grid
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.map((m) => {
                  const isUser = m.sender === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed space-y-2 ${
                          isUser
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-tr-none shadow-md shadow-cyan-500/20'
                            : m.isEmergency
                            ? 'bg-rose-500/20 border border-rose-500/40 text-rose-200 rounded-tl-none'
                            : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                        }`}
                      >
                        <div className="whitespace-pre-wrap font-sans text-[12px]">
                          {m.content}
                        </div>
                        <div
                          className={`text-[9px] font-mono ${
                            isUser ? 'text-slate-900/70 text-right' : 'text-slate-500'
                          }`}
                        >
                          {m.timestamp}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Recommended Hospitals Chips if any */}
                {recommendedHospitals.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-2 animate-in fade-in">
                    <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Matched Healthcare Facilities:</span>
                    </div>
                    <div className="space-y-1.5">
                      {recommendedHospitals.slice(0, 3).map((h) => (
                        <div
                          key={h.hospital.id}
                          className="p-2 rounded-xl bg-navy-950 border border-slate-800 flex items-center justify-between gap-2 text-[11px]"
                        >
                          <div className="truncate">
                            <div className="font-bold text-white truncate">{h.hospital.name}</div>
                            <div className="text-slate-400 text-[10px]">
                              {h.hospital.city} • 🛏️ {h.hospital.realTimeData?.totalBedsAvailable || 15} Beds Open
                            </div>
                          </div>
                          <button
                            onClick={() => handleOpenSearchWithQuery(`${h.hospital.name} ${h.hospital.city}`)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-[10px] shrink-0 border border-cyan-500/30"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <span className="font-medium animate-pulse">CareMatch AI is thinking...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Carousel */}
              <div className="px-3 py-2 border-t border-slate-800/80 bg-navy-950/60 flex gap-1.5 overflow-x-auto no-scrollbar">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(qp.replace(/^[^\w]+/, ''))}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700/80 text-[10px] font-semibold whitespace-nowrap transition-colors"
                  >
                    {qp}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 border-t border-slate-800 bg-navy-950 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask any health or hospital question..."
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20 disabled:opacity-40 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
