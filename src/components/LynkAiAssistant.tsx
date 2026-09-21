import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  Store as StoreIcon, 
  MapPin, 
  ExternalLink,
  Loader2
} from 'lucide-react';
import { askLynkAi, AiChatMessage } from '../lib/aiService';
import { lynkStore } from '../lib/storage';

interface LynkAiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchQuery: (query: string) => void;
  onSelectStore: (storeId: string) => void;
}

const SAMPLE_QUESTIONS = [
  'Where can I find wireless earbuds under ₹3,000 near me?',
  'Who has the best price for laptop chargers nearby?',
  'Show pharmacies open right now in my area',
  'Where can I buy authentic Sambalpuri silk handlooms?',
];

export const LynkAiAssistant: React.FC<LynkAiAssistantProps> = ({
  isOpen,
  onClose,
  onSearchQuery,
  onSelectStore,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Namaste! I am **LYNK AI**, your intelligent neighborhood market navigator. Tell me what product or store you are looking for, and I will check live in-store stock, counter prices, and walking distance around you.',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const reply = await askLynkAi(text, messages);
      setMessages(prev => [...prev, reply]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'I could not reach the network, but you can explore all stores on the live map.',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        id="floating-lynk-ai-btn"
        onClick={() => {}}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-[#0F1012] text-stone-100 border border-stone-800/90 shadow-2xl hover:border-amber-400/40 hover:scale-[1.02] active:scale-98 transition-all flex items-center gap-2.5 group"
        title="Open LYNK AI Assistant"
      >
        <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
        <span className="font-serif-editorial text-sm font-normal tracking-wide text-stone-200">Ask LYNK AI</span>
        <span className="font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/25">
          LIVE
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-300/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-stone-900">
      
      {/* Header */}
      <div className="p-4 bg-[#0F1012] text-white flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <div>
            <h4 className="font-serif-editorial text-base text-stone-100 tracking-tight font-normal">
              LYNK AI Intelligence
            </h4>
            <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
              Neighborhood Catalog Assistant
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF8F5] text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded-full bg-stone-950 text-amber-300 border border-stone-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl ${
                  isUser
                    ? 'bg-stone-950 text-white rounded-tr-xs shadow-2xs'
                    : 'bg-white border border-stone-200/90 text-stone-800 rounded-tl-xs shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed font-light">
                  {msg.text}
                </div>

                {/* Suggested Action Pill */}
                {msg.suggestedAction && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100">
                    <button
                      onClick={() => {
                        if (msg.suggestedAction?.type === 'search') {
                          onSearchQuery(msg.suggestedAction.target);
                          onClose();
                        } else if (msg.suggestedAction?.type === 'store') {
                          onSelectStore(msg.suggestedAction.target);
                          onClose();
                        }
                      }}
                      className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-900 font-medium text-[11px] flex items-center gap-1.5 transition-colors border border-stone-300/80 shadow-2xs"
                    >
                      <span>{msg.suggestedAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <span className={`block font-mono text-[9px] mt-1.5 text-right ${isUser ? 'text-stone-400' : 'text-stone-400'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {isUser && (
                <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-stone-500 text-xs font-light">
            <Loader2 className="w-4 h-4 animate-spin text-stone-800" />
            <span>Checking live store inventory…</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2.5 bg-stone-100/70 border-t border-stone-200/80 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
        {SAMPLE_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1 rounded-full bg-white hover:bg-stone-200/80 text-[11px] text-stone-700 border border-stone-200 shrink-0 transition-colors font-light shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-stone-200/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about nearby products, stock, or counter discounts…"
            className="flex-1 text-xs px-4 py-2.5 rounded-full border border-stone-300 focus:outline-none focus:border-stone-950 font-light"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-full bg-stone-950 hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 text-white transition-colors shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
