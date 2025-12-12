'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import { formatMessage } from '@/lib/formatMessage';

const styles = `
  @keyframes neonAppear {
    0% {
      color: #d4d4d8;
      text-shadow: none;
    }
    100% {
      color: #fbbf24;
      text-shadow: 0 0 5px #fbbf24, 0 0 10px #f59e0b, 0 0 20px #f59e0b;
    }
  }
  @keyframes neonPulse {
    0%, 100% {
      color: #fbbf24;
      text-shadow: 0 0 5px #fbbf24, 0 0 10px #f59e0b, 0 0 20px #f59e0b;
    }
    50% {
      color: #fde047;
      text-shadow: 0 0 8px #fde047, 0 0 15px #fbbf24, 0 0 25px #f59e0b;
    }
  }
  .neon-back-link {
    animation: neonAppear 1s ease-out forwards, neonPulse 1.5s ease-in-out 1s infinite;
  }
`;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  'Why would I hire him?',
  'How exactly can he help with my product?',
  'Seems like last time he was employed two years ago. Why so? What\'s his problem?',
  'This all looks expensive. What\'s his rate?',
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [displayTitle, setDisplayTitle] = useState("Chat with Andrii's assistant");
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const titleText = "Chat with Andrii's assistant";
  const lastMessageCountRef = useRef(0);

  useEffect(() => {
    if (!conversationId) {
      setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [conversationId]);

  useEffect(() => {
    if (messages.length > lastMessageCountRef.current && messages[messages.length - 1]?.role === 'assistant') {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    lastMessageCountRef.current = messages.length;
  }, [messages]);

  useEffect(() => {
    let glitchInterval: NodeJS.Timeout;

    const playGlitch = () => {
      let phase = 0;
      glitchInterval = setInterval(() => {
        if (phase < 10) {
          setDisplayTitle(titleText
            .split('')
            .map(char => {
              if (char === ' ') return char;
              return Math.random() > 0.5 ? '1' : '0';
            })
            .join(''));
        } else if (phase < 20) {
          const progress = (phase - 10) / 10;
          setDisplayTitle(titleText
            .split('')
            .map((char, index) => {
              if (char === ' ') return char;
              if (index / titleText.length < progress) {
                return char;
              }
              return Math.random() > 0.5 ? '1' : '0';
            })
            .join(''));
        } else {
          setDisplayTitle(titleText);
          clearInterval(glitchInterval);
        }
        phase++;
      }, 50);
    };

    playGlitch();

    return () => {
      if (glitchInterval) clearInterval(glitchInterval);
    };
  }, []);



  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      handleSendMessage(e as any, input);
    }
  };

  const handleSendMessage = async (e: React.FormEvent | null, messageToSend?: string) => {
    if (e) e.preventDefault();
    const messageContent = messageToSend || input;
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (suggestedQuestions.includes(messageContent)) {
      setAnsweredQuestions((prev) => new Set([...prev, messageContent]));
    }
    setInput('');
    setIsLoading(true);

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          conversation_id: conversationId,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend error ${response.status}:`, errorText);
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();

      if (data.message) {
        const assistantMessage: Message = {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: error instanceof Error 
          ? `Error: ${error.message}. Make sure the backend is running at http://localhost:8000`
          : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setAnsweredQuestions(new Set());
    setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100 flex flex-col">
      <style>{styles}</style>
      
      <Link href="/" className="neon-back-link absolute top-20 left-1/2 transform -translate-x-1/2 inline-flex items-center gap-2 text-2xl hover:text-neutral-50 transition-colors text-center justify-center z-20">
        <span>←</span>
        <span>Back to home</span>
      </Link>

      <div className="flex-1 w-full flex flex-col items-center justify-start" style={{ padding: '100px 20px' }}>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-neutral-100 text-center" style={{ letterSpacing: '0.08em', paddingTop: '60px', paddingBottom: '60px' }}>
          {displayTitle}
        </h1>

        <div className="w-full flex justify-center flex-1">
          <div className="w-full max-w-4xl flex flex-col flex-1">
        {/* Suggested Questions - Always Visible */}
        <div className="grid grid-cols-1 gap-3" style={{ paddingBottom: '40px' }}>
          {suggestedQuestions
            .filter((question) => !answeredQuestions.has(question))
            .map((question) => (
              <button
                key={question}
                onClick={() => handleSendMessage(null, question)}
                disabled={isLoading}
                className="p-3 text-left bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
              >
                {question}
              </button>
            ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col pr-4" style={{ paddingBottom: '40px', gap: '5px' }}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl px-6 py-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-100'
                }`}
              >
                <div style={{ paddingLeft: '5px', paddingRight: '5px', paddingTop: '3px', paddingBottom: '3px', lineHeight: '1.5', letterSpacing: '0.3px', fontSize: '15px', wordWrap: 'break-word' }}>
                  {formatMessage(msg.content)}
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-slate-800 text-slate-100 px-6 py-4 rounded-lg">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => handleSendMessage(e)} className="relative w-full" style={{ paddingTop: '40px' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={5}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-20 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50 resize-none"
            style={{ minHeight: '120px', maxHeight: '200px' }}
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearChat}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Clear chat"
              >
                <FiRefreshCw size={18} />
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white p-2 rounded-lg transition-colors"
              aria-label="Send message"
            >
              <FiSend size={18} />
            </button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
}
