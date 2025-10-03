'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sun, Moon, User, Bot, Plus, ArrowUp, Pin, FileText } from 'lucide-react';
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
      text: "Hello! I'm your AI assistant powered by Gemini. I can help you with text conversations and analyze images and PDFs. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPinDropdown, setShowPinDropdown] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDark = theme === 'dark';

  // Initialize Gemini AI client
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
        text: "Sorry, I can't process that right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getGeminiResponse = async (userMessage: string, attachedFile?: File): Promise<string> => {
  const prompt = `
    You are a knowledgeable assistant specialized in Indian cities, culture, history, festivals, and local information.
    Answer user questions accurately, provide examples, and keep the response informative and friendly. Give the response with proper markdown formatting and spacings.
  `;

  const contents: any[] = [
    { text: prompt },
    { text: userMessage }
  ];

  if (attachedFile) {
    const base64 = await fileToBase64(attachedFile);
    contents.push({
      parts: [
        {
          inline: {
            mime_type: attachedFile.type,
            data: base64
          }
        }
      ]
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

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "AI service not available. Please try again later.";
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
      text: "Hello! I'm your AI assistant powered by Gemini. I can help you with text conversations and analyze images and PDFs. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }]);
    setInputValue('');
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
    const input = document.getElementById('dropdown-image-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handlePinClick = () => setShowPinDropdown(!showPinDropdown);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showPinDropdown && !(event.target as HTMLElement).closest('.pin-dropdown')) {
        setShowPinDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPinDropdown]);

  useEffect(() => () => filePreviewUrl && URL.revokeObjectURL(filePreviewUrl), [filePreviewUrl]);

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <div className={`flex h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
          <div className="flex-1 flex flex-col min-w-0">

            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'bg-black border-gray-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Chat</h1>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <button onClick={newChat} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-900 text-gray-300' : 'hover:bg-slate-100 text-slate-600'}`}><Plus className="w-5 h-5" /></button>
                <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-900 text-gray-300' : 'hover:bg-slate-100 text-slate-600'}`}>{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                {messages.map(msg => (
                  <div key={msg.id} className="mb-8 group">
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-gray-700' : isDark ? 'bg-gray-800' : 'bg-orange-500'}`}>
                        {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{msg.sender === 'user' ? 'You' : 'Assistant'}</div>
                        <div className={`prose max-w-none ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>
                          {/* <p className="whitespace-pre-wrap leading-relaxed m-0">{msg.text}</p> */}
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="mb-8 group flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-orange-500'}`}><Bot className="w-4 h-4 text-white" /></div>
                    <div>
                      <div className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Assistant</div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-slate-400'}`}></div>
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-slate-400'}`} style={{ animationDelay: '0.1s' }}></div>
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-slate-400'}`} style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className={`border-t ${isDark ? 'bg-black border-gray-800' : 'bg-white border-slate-200'}`}>
              <div className="max-w-3xl mx-auto p-4 sm:p-6">
                {selectedFile && filePreviewUrl && (
                  <div className="mb-3 flex items-center gap-2">
                    {selectedFile.type === 'application/pdf' ? (
                      <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center"><FileText className="w-3 h-3 text-white" /></div>
                    ) : (
                      <img src={filePreviewUrl} alt="Selected" className="w-5 h-5 object-cover rounded border" />
                    )}
                    <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{selectedFile.name}</span>
                    <button onClick={clearSelectedFile} className={`ml-1 w-3 h-3 rounded-full ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-slate-300 text-slate-700'}`}>×</button>
                  </div>
                )}

                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className={`w-full px-4 py-3 pr-12 rounded-xl border resize-none transition-all focus:outline-none focus:ring-2 focus:ring-white ${isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'}`}
                    rows={1}
                    style={{ minHeight: '52px', maxHeight: '120px' }}
                  />

                  <div className="absolute bottom-4 right-2 flex gap-2">
                    <div className="relative pin-dropdown">
                      <button onClick={handlePinClick} className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-slate-100 text-slate-600'}`}><Pin className="w-4 h-4" /></button>
                      {showPinDropdown && (
                        <div className={`absolute bottom-full right-0 mb-2 w-48 rounded-lg border shadow-lg z-10 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
                          <div className="p-2">
                            <label htmlFor="dropdown-image-upload" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-slate-100 text-slate-700'}`}>
                              <Plus className="w-4 h-4" />
                              <span className="text-sm">Upload File</span>
                            </label>
                            <input type="file" accept="image/*,.pdf" id="dropdown-image-upload" className="hidden" onChange={handleFileChange} />
                          </div>
                        </div>
                      )}
                    </div>

                    <button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} className={`p-2 rounded-lg transition-all ${inputValue.trim() && !isTyping ? 'bg-orange-500 hover:bg-orange-600 text-white' : isDark ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}><ArrowUp className="w-4 h-4" /></button>
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
