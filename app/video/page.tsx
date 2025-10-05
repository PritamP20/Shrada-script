'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sun, Moon, User, Bot, Plus, ArrowUp, Paperclip, X, FileText } from 'lucide-react';
import { useTheme } from 'next-themes';
import { SidebarProvider, SidebarTrigger, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar/AppSidebar";
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotUI = () => {
  const { theme, setTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI assistant. I can help with questions about Indian cities, culture, history, and more. I can also analyze images and PDFs.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  const ai = new GoogleGenAI({ apiKey: "AIzaSyCzOAdVfUSllbeQlWmaEKSqXoHwKeIc2kk" });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const aiResponse = await getGeminiResponse(inputValue, selectedFile || undefined);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      if (selectedFile) clearSelectedFile();
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getGeminiResponse = async (userMessage: string, attachedFile?: File): Promise<string> => {
    const prompt = `You are a knowledgeable assistant specialized in Indian cities, culture, history, festivals, and local information. Answer questions accurately and keep responses informative and friendly. Use proper markdown formatting.`;

    const contents: any[] = [
      { text: prompt },
      { text: userMessage }
    ];

    if (attachedFile) {
      const base64 = await fileToBase64(attachedFile);
      contents.push({
        parts: [{
          inline: {
            mime_type: attachedFile.type,
            data: base64
          }
        }]
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      return response.text || "I couldn't generate a response.";
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "AI service unavailable. Please try again.";
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
    });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const newChat = () => {
    setMessages([{
      id: Date.now(),
      text: "Hi! I'm your AI assistant. I can help with questions about Indian cities, culture, history, and more. I can also analyze images and PDFs.",
      sender: 'bot',
      timestamp: new Date()
    }]);
    setInputValue('');
    clearSelectedFile();
  };

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      setSelectedFile(file);
      setFilePreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearSelectedFile = () => {
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setSelectedFile(null);
    setFilePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => () => filePreviewUrl && URL.revokeObjectURL(filePreviewUrl), [filePreviewUrl]);

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <div className={`flex h-screen ${isDark ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
          <div className="flex-1 flex flex-col min-w-0">

            {/* Header */}
            <header className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200'}`}>
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <h1 className={`text-base font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>Chat</h1>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={newChat} 
                  className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-neutral-900 text-neutral-400 hover:text-neutral-300' : 'hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900'}`}
                  aria-label="New chat"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button 
                  onClick={toggleTheme} 
                  className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-neutral-900 text-neutral-400 hover:text-neutral-300' : 'hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900'}`}
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                {messages.map(msg => (
                  <div key={msg.id} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'user' 
                        ? isDark ? 'bg-neutral-800' : 'bg-neutral-200'
                        : isDark ? 'bg-orange-900/30' : 'bg-orange-100'
                    }`}>
                      {msg.sender === 'user' ? (
                        <User className={`w-4 h-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} />
                      ) : (
                        <Bot className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {msg.sender === 'user' ? 'You' : 'Assistant'}
                      </div>
                      <div className={`prose prose-sm max-w-none ${
                        isDark 
                          ? 'prose-invert prose-headings:text-neutral-100 prose-p:text-neutral-300 prose-strong:text-neutral-200 prose-code:text-neutral-300' 
                          : 'prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-strong:text-neutral-900 prose-code:text-neutral-700'
                      }`}>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
                      <Bot className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                    </div>
                    <div className="space-y-2">
                      <div className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Assistant</div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-neutral-600' : 'bg-neutral-400'}`}></div>
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-neutral-600' : 'bg-neutral-400'}`} style={{ animationDelay: '0.15s' }}></div>
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-neutral-600' : 'bg-neutral-400'}`} style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className={`border-t ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200'}`}>
              <div className="max-w-3xl mx-auto px-6 py-4">
                {selectedFile && filePreviewUrl && (
                  <div className={`mb-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                    {selectedFile.type === 'application/pdf' ? (
                      <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <img src={filePreviewUrl} alt="Preview" className="w-8 h-8 object-cover rounded flex-shrink-0" />
                    )}
                    <span className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      {selectedFile.name}
                    </span>
                    <button 
                      onClick={clearSelectedFile} 
                      className={`p-1 rounded hover:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors ${isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-500 hover:text-neutral-700'}`}
                      aria-label="Remove file"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className={`relative rounded-xl border ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} focus-within:ring-1 focus-within:ring-orange-500 transition-shadow`}>
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className={`w-full px-4 py-3 pr-24 rounded-xl resize-none bg-transparent focus:outline-none ${isDark ? 'text-neutral-100 placeholder-neutral-500' : 'text-neutral-900 placeholder-neutral-400'}`}
                    rows={1}
                    style={{ minHeight: '52px', maxHeight: '120px' }}
                  />

                  <div className="absolute bottom-2 right-2 flex items-center gap-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label 
                      htmlFor="file-upload"
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${isDark ? 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-300' : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700'}`}
                    >
                      <Paperclip className="w-4 h-4" />
                    </label>

                    <button 
                      onClick={handleSendMessage} 
                      disabled={!inputValue.trim() || isTyping} 
                      className={`p-2 rounded-lg transition-all ${
                        inputValue.trim() && !isTyping
                          ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                          : isDark 
                            ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed' 
                            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      }`}
                      aria-label="Send message"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </SidebarInset>
      <SidebarRail />
    </SidebarProvider>
  );
};

export default function Page() {
  return <ChatbotUI />;
}