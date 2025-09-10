'use client';

import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Send, Sun, Moon, User, Bot, Plus, ArrowUp } from 'lucide-react';

// Theme Context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={isDark ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const ChatbotUI = () => {
  const { isDark, toggleTheme } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const getBotResponse = (userMessage) => {
    const responses = [
      "That's a great question! Let me help you with that.",
      "I understand what you're asking about. Here's my perspective...",
      "Interesting point! Let me share some thoughts on this topic.",
      "I'm here to help! Let me break this down for you.",
      "Thanks for asking. Here's what I think about this..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const newChat = () => {
    setMessages([{
      id: Date.now(),
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }]);
    setInputValue('');
  };

  return (
    <div className={`flex h-screen ${
      isDark 
        ? 'bg-slate-950' 
        : 'bg-white'
    }`}>
      
      {/* Sidebar */}
      <div className={`hidden lg:flex flex-col w-72 border-r ${
        isDark 
          ? 'bg-slate-900 border-slate-800' 
          : 'bg-slate-50 border-slate-200'
      }`}>
        
        {/* Sidebar Header */}
        <div className="p-4">
          <button
            onClick={newChat}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
        
        {/* Chat History */}
        <div className="flex-1 px-4 pb-4">
          <div className={`text-xs font-medium mb-3 ${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}>
            Recent
          </div>
          <div className="space-y-1">
            {['General Questions', 'Help with Code', 'Creative Writing'].map((chat, i) => (
              <button
                key={i}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  isDark 
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-300' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <div className="truncate">{chat}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Theme Toggle */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              isDark 
                ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-300' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <div className={`lg:hidden flex items-center justify-between p-4 border-b ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-slate-200'
        }`}>
          <h1 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Chat
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={newChat}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-slate-800 text-slate-400'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-slate-800 text-slate-400' 
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            {messages.map((message) => (
              <div key={message.id} className="mb-8 group">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user'
                      ? 'bg-orange-500'
                      : isDark
                        ? 'bg-orange-600'
                        : 'bg-orange-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold mb-2 ${
                      isDark 
                        ? message.sender === 'user' ? 'text-white' : 'text-white'
                        : message.sender === 'user' ? 'text-slate-900' : 'text-slate-900'
                    }`}>
                      {message.sender === 'user' ? 'You' : 'Assistant'}
                    </div>
                    
                    <div className={`prose max-w-none ${
                      isDark 
                        ? 'text-slate-300' 
                        : 'text-slate-700'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed m-0">
                        {message.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="mb-8 group">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-orange-600' : 'bg-orange-500'
                  }`}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Assistant
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        isDark ? 'bg-slate-500' : 'bg-slate-400'
                      }`}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        isDark ? 'bg-slate-500' : 'bg-slate-400'
                      }`} style={{ animationDelay: '0.1s' }}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        isDark ? 'bg-slate-500' : 'bg-slate-400'
                      }`} style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className={`border-t ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="max-w-3xl mx-auto p-4 sm:p-6">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={`w-full px-4 py-3 pr-12 rounded-xl border resize-none transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                }`}
                style={{ minHeight: '52px', maxHeight: '120px' }}
                rows={1}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={`absolute bottom-2 right-2 p-2 rounded-lg transition-all ${
                  inputValue.trim() && !isTyping
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : isDark
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
            
            <div className={`text-xs text-center mt-3 ${
              isDark ? 'text-slate-500' : 'text-slate-500'
            }`}>
              Press Enter to send, Shift + Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <ThemeProvider>
      <ChatbotUI />
    </ThemeProvider>
  );
};

export default Page;