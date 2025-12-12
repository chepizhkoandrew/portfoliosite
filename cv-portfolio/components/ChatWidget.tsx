'use client';

import { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiSend, FiX } from 'react-icons/fi';
import { formatMessage } from '@/lib/formatMessage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize conversation ID
  useEffect(() => {
    if (!conversationId) {
      setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);



  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);



  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const userInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      
      const response = await fetch(`${BACKEND_URL}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
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

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      console.log(`[Chat] Starting stream for conversation ${conversationId}`);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'message') {
                const assistantMessage: Message = {
                  id: `msg_${Date.now()}_${Math.random()}`,
                  role: 'assistant',
                  content: data.content,
                  timestamp: new Date(),
                };
                console.log(`[Chat] Received message:`, data.content.substring(0, 50) + '...');
                flushSync(() => {
                  setMessages((prev) => [...prev, assistantMessage]);
                });
              } else if (data.type === 'done') {
                console.log(`[Chat] Stream complete`);
              }
            } catch (e) {
              console.error('Error parsing SSE message:', e);
            }
          }
        }
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
    setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  };

  return (
    <div className="fixed inset-0 z-50 font-poppins pointer-events-none" style={{ padding: '100px 20px' }}>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 right-0 bg-neutral-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
            style={{ width: 'calc(100vw - 40px)', height: 'calc(100vh - 200px)', maxWidth: '600px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-neutral-800">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-100">Talk to my agent</h3>
                <p className="text-xs text-slate-400">Ask me anything about Andrii</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-700 rounded transition-colors"
                aria-label="Close chat"
              >
                <FiX className="text-slate-400 hover:text-slate-200" size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="text-slate-400">
                    <p className="text-sm mb-2">👋 Hi! I'm Andrii's AI assistant.</p>
                    <p className="text-xs">Ask me anything about his experience, skills, or services.</p>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-700 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    <div className="text-sm" style={{ paddingLeft: '5px', paddingRight: '5px', paddingTop: '3px', paddingBottom: '3px', lineHeight: '1.5', letterSpacing: '0.3px', wordWrap: 'break-word' }}>
                      {formatMessage(msg.content)}
                      {msg.isStreaming && msg.role === 'assistant' && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="inline-block w-2 h-5 bg-slate-100"
                          style={{ marginLeft: '4px', marginBottom: '-2px', verticalAlign: 'text-bottom' }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}



              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700 bg-neutral-800">
              <div className="flex gap-2 mb-2">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="text-xs px-2 py-1 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef as any}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  rows={5}
                  className="flex-1 bg-neutral-700 border border-slate-600 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50 resize-none"
                  style={{ minHeight: '120px', maxHeight: '200px' }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-3 py-2 rounded transition-colors flex-shrink-0"
                  aria-label="Send message"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.button
            key="chat-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(true)}
            className="fixed w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 relative pointer-events-auto"
            style={{ bottom: '30px', right: '30px' }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown size={24} />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-blue-600 rounded-full"
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
