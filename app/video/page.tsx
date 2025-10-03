'use client';

// TODO: Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual Gemini API key from Google AI Studio
// Get your API key at: https://makersuite.google.com/app/apikey

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sun, Moon, User, Bot, Plus, ArrowUp, Pin, FileText } from 'lucide-react';
import { useTheme } from 'next-themes';
import { SidebarProvider, SidebarTrigger, SidebarInset, SidebarRail } from "@/components/ui/sidebar"
import { AppSidebar } from "../../components/app-sidebar/AppSidebar"

const ChatbotUI = () => {
  const { theme, setTheme } = useTheme();
  const [messages, setMessages] = useState([
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

    // Get AI response from Gemini
    try {
      const aiResponse = await getGeminiResponse(inputValue, selectedFile || undefined);
      const botResponse = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);

      // Clear the selected file after sending
      if (selectedFile) {
        clearSelectedFile();
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble processing your request right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const getGeminiResponse = async (userMessage: string, attachedFile?: File): Promise<string> => {
    // TODO: Replace with your actual Gemini API key from Google AI Studio
    // Get your free API key at: https://makersuite.google.com/app/apikey
    const GEMINI_API_KEY = 'AIzaSyDPuvf4j9e8DxI3GycyHpTP--h_XEylSHs';
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const parts: any[] = [];

      // Add text message
      parts.push({
        text: userMessage
      });

      // Add file if attached
      if (attachedFile) {
        if (attachedFile.type.startsWith('image/')) {
          // Convert image to base64
          const base64 = await fileToBase64(attachedFile);
          parts.push({
            inline_data: {
              mime_type: attachedFile.type,
              data: base64
            }
          });
        } else if (attachedFile.type === 'application/pdf') {
          // Convert PDF to base64
          const base64 = await fileToBase64(attachedFile);
          parts.push({
            inline_data: {
              mime_type: attachedFile.type,
              data: base64
            }
          });
        }
      }

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: parts
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Fallback to dummy responses if API fails
      const fallbackResponses = [
        "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again later.",
        "There seems to be a connection issue. Let me try to help you with what I know.",
        "I'm experiencing some technical difficulties. Could you please rephrase your question?",
        "Sorry, I can't access my AI service at the moment. Please try again in a few moments.",
        "There appears to be a network issue. Please check your connection and try again."
      ];
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
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
      text: "Hello! I'm your AI assistant powered by Gemini. I can help you with text conversations and analyze images and PDFs. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }]);
    setInputValue('');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      // Clean up previous URL
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }

      const previewUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setFilePreviewUrl(previewUrl);

      // You can add logic here to handle the file upload
      console.log('Selected file:', file);
    }
  };

  const clearSelectedFile = () => {
    // Clean up the preview URL
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }

    setSelectedFile(null);
    // Reset the file input
    const dropdownFileInput = document.getElementById('dropdown-image-upload') as HTMLInputElement;
    if (dropdownFileInput) dropdownFileInput.value = '';
  };

  const handlePinClick = () => {
    setShowPinDropdown(!showPinDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPinDropdown && !event.target.closest('.pin-dropdown')) {
        setShowPinDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPinDropdown]);

  // Cleanup file preview URL on unmount
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const isDark = theme === 'dark';

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
         <div className={`flex h-screen ${
           isDark
             ? 'bg-black'
             : 'bg-white'
         }`}>

       {/* Main Chat Area */}
       <div className="flex-1 flex flex-col min-w-0">

         {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            isDark
              ? 'bg-black border-gray-800'
              : 'bg-white border-slate-200'
          }`}>
           <div className="flex items-center gap-2">
             <SidebarTrigger />
             <h1 className={`text-lg font-semibold ${
               isDark ? 'text-white' : 'text-slate-900'
             }`}>
               Chat
             </h1>
           </div>

           {/* Desktop buttons */}
           <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={newChat}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-gray-900 text-gray-300'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-gray-900 text-gray-300'
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
                       ? 'bg-gray-700'
                       : isDark
                         ? 'bg-gray-800'
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
                         ? 'text-white'
                         : message.sender === 'user' ? 'text-slate-900' : 'text-slate-900'
                     }`}>
                       {message.sender === 'user' ? 'You' : 'Assistant'}
                     </div>
                    
                     <div className={`prose max-w-none ${
                       isDark
                         ? 'text-gray-200'
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
                     isDark ? 'bg-gray-800' : 'bg-orange-500'
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
                         isDark ? 'bg-gray-400' : 'bg-slate-400'
                       }`}></div>
                       <div className={`w-2 h-2 rounded-full animate-bounce ${
                         isDark ? 'bg-gray-400' : 'bg-slate-400'
                       }`} style={{ animationDelay: '0.1s' }}></div>
                       <div className={`w-2 h-2 rounded-full animate-bounce ${
                         isDark ? 'bg-gray-400' : 'bg-slate-400'
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
             ? 'bg-black border-gray-800'
             : 'bg-white border-slate-200'
         }`}>
           <div className="max-w-3xl mx-auto p-4 sm:p-6">
             {/* File Preview */}
             {selectedFile && filePreviewUrl && (
               <div className="mb-3 flex items-center gap-2">
                 <div className="relative">
                   {selectedFile.type === 'application/pdf' ? (
                     <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
                       <FileText className="w-3 h-3 text-white" />
                     </div>
                   ) : (
                     <img
                       src={filePreviewUrl}
                       alt="Selected"
                       className="w-5 h-5 object-cover rounded border"
                       style={{ width: '20px', height: '20px' }}
                     />
                   )}
                   <button
                     onClick={clearSelectedFile}
                     className={`absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center text-xs ${
                       isDark
                         ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                         : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
                     }`}
                   >
                     ×
                   </button>
                 </div>
                 <span className={`text-xs ${
                   isDark ? 'text-gray-300' : 'text-slate-600'
                 }`}>
                   {selectedFile.name} ({selectedFile.type === 'application/pdf' ? 'PDF' : 'Image'})
                 </span>
               </div>
             )}

             <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                 className={`w-full px-4 py-3 pr-12 rounded-xl border resize-none transition-all focus:outline-none focus:ring-2 focus:ring-white ${
                   isDark
                     ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400'
                     : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                 }`}
                style={{ minHeight: '52px', maxHeight: '120px' }}
                rows={1}
              />
              
               <div className="absolute bottom-4 right-2 flex gap-2">
                 <div className="relative pin-dropdown">
                   <button
                     onClick={handlePinClick}
                      className={`p-2 rounded-lg transition-all ${
                        isDark
                          ? 'hover:bg-gray-800 text-gray-300'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                   >
                     <Pin className="w-4 h-4" />
                   </button>

                   {showPinDropdown && (
                      <div className={`absolute bottom-full right-0 mb-2 w-48 rounded-lg border shadow-lg z-10 ${
                        isDark
                          ? 'bg-gray-900 border-gray-700'
                          : 'bg-white border-slate-200'
                      }`}>
                       <div className="p-2">
                         <label
                           htmlFor="dropdown-image-upload"
                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                              isDark
                                ? 'hover:bg-gray-800 text-gray-200'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                         >
                           <Plus className="w-4 h-4" />
                            <span className="text-sm">Upload File</span>
                         </label>
                         <input
                           type="file"
                            accept="image/*,.pdf"
                           id="dropdown-image-upload"
                           className="hidden"
                           onChange={handleFileChange}
                         />
                       </div>
                     </div>
                   )}
                 </div>

                 <button
                   onClick={handleSendMessage}
                   disabled={!inputValue.trim() || isTyping}
                    className={`p-2 rounded-lg transition-all ${
                      inputValue.trim() && !isTyping
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : isDark
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
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

const Page = () => {
  return <ChatbotUI />;
};

export default Page;