"use client";

import { GoogleGenAI } from "@google/genai";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload, Sparkles, FileText, Video, ArrowLeft, MapPin, Users, Globe, Languages, Clock, Download, Copy, Check } from "lucide-react";

interface StateData {
  capital: string;
  population: string;
  area: string;
  languages: string;
  history: string;
  culture: string;
  mainImage: string;
  highlights: { name: string; image: string }[];
}

const GEMINI_API_KEY = "AIzaSyCzOAdVfUSllbeQlWmaEKSqXoHwKeIc2kk";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const VIDEO_PROMPTS = [
  "Create a cinematic 2-minute cultural tour",
  "Generate a historical documentary script",
  "Develop a food & festival showcase",
  "Design a tourist destination guide",
];

export default function StateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stateName = decodeURIComponent(params.state as string);

  const [stateData, setStateData] = useState<StateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoScript, setVideoScript] = useState("");
  const [videoLoading, setVideoLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [decodedText, setDecodedText] = useState("");
  const [decodeLoading, setDecodeLoading] = useState(false);

  useEffect(() => {
    loadStateData();
  }, [stateName]);

  async function loadStateData() {
    setLoading(true);
    setError(null);

    const prompt = `Provide detailed information about ${stateName} state in India. Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:

{
  "capital": "capital city name",
  "population": "approximate population",
  "area": "area in sq km",
  "languages": "main languages spoken",
  "history": "A detailed paragraph about the historical background (4-5 sentences)",
  "culture": "A detailed paragraph about the cultural heritage and traditions (4-5 sentences)",
  "mainImage": "https://picsum.photos/1200/500",
  "highlights": [
    {"name": "Famous festival or dance", "image": "https://picsum.photos/400/300"},
    {"name": "Traditional cuisine", "image": "https://picsum.photos/400/301"},
    {"name": "Historical monument", "image": "https://picsum.photos/400/302"},
    {"name": "Art form or craft", "image": "https://picsum.photos/400/303"}
  ]
}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        temperature: 0.4,
        maxOutputTokens: 2048,
      });

      const text = response.text || "{}";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        setError("Failed to parse state data");
        return;
      }

      const parsed = JSON.parse(jsonMatch[0]);
      setStateData(parsed as StateData);
    } catch (err) {
      setError("Failed to load state data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function generateVideoScript() {
    if (!videoPrompt.trim()) return;

    setVideoLoading(true);
    const fullPrompt = `Create a detailed video script for ${stateName}, India based on this request: "${videoPrompt}". 

Include:
- Opening hook (10-15 seconds)
- Main content sections with timestamps
- Visual suggestions for each scene
- Narration text
- Closing call-to-action

Format it as a proper video script with scene numbers and timestamps.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        temperature: 0.7,
        maxOutputTokens: 3000,
      });

      setVideoScript(response.text || "Failed to generate script");
    } catch (err) {
      setVideoScript("Error generating video script. Please try again.");
      console.error(err);
    } finally {
      setVideoLoading(false);
    }
  }

  async function decodeScript() {
    if (!uploadedFile) return;

    setDecodeLoading(true);

    try {
      const fileText = await uploadedFile.text();
      
      const prompt = `The following text might be in a regional Indian script or language. Please:
1. Identify the language/script
2. Provide accurate English translation
3. Preserve the original meaning and context

Text to decode:
${fileText}

Provide the response in this format:
**Detected Language/Script:** [Name]
**Translation:**
[English translation here]`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        temperature: 0.3,
        maxOutputTokens: 4000,
      });

      setDecodedText(response.text || "Failed to decode");
    } catch (err) {
      setDecodedText("Error decoding script. Please ensure the file contains readable text.");
      console.error(err);
    } finally {
      setDecodeLoading(false);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setDecodedText("");
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-orange-200 dark:border-gray-700"></div>
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-orange-600 dark:border-orange-500 absolute top-0"></div>
          </div>
          <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg font-medium">Loading state information...</p>
        </div>
      </div>
    );
  }

  if (error || !stateData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-2xl max-w-md">
          <div className="text-7xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">Unable to Load State</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "An unexpected error occurred"}</p>
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Return to Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {stateName}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-8 pb-12">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="relative">
            <img
              src={stateData.mainImage}
              alt={stateName}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <h1 className="text-6xl font-black text-white mb-4 drop-shadow-2xl tracking-tight">{stateName}</h1>
              <p className="text-xl text-white/90 font-light">Discover the heritage, culture, and essence</p>
            </div>
          </div>

          <div className="p-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-2xl border border-orange-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Capital City</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stateData.capital}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-2xl border border-blue-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Population</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stateData.population}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-2xl border border-green-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-green-600 dark:text-green-500" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Area</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stateData.area}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-2xl border border-purple-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <Languages className="w-5 h-5 text-purple-600 dark:text-purple-500" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Languages</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stateData.languages}</p>
              </div>
            </div>

            {/* History & Culture */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="group">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 p-8 rounded-2xl border-l-4 border-orange-600 dark:border-orange-500 hover:shadow-xl transition-all">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <Clock className="w-8 h-8 text-orange-600 dark:text-orange-500" />
                    Historical Background
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{stateData.history}</p>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-gray-800 dark:to-gray-800 p-8 rounded-2xl border-l-4 border-red-600 dark:border-red-500 hover:shadow-xl transition-all">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-red-600 dark:text-red-500" />
                    Cultural Heritage
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{stateData.culture}</p>
                </div>
              </div>
            </div>

            {/* Cultural Highlights */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-orange-600 dark:text-orange-500" />
                Cultural Highlights
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stateData.highlights.map((highlight, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                      <div className="relative overflow-hidden">
                        <img 
                          src={highlight.image} 
                          alt={highlight.name} 
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <div className="p-4">
                        <p className="text-center font-semibold text-gray-900 dark:text-white text-sm">{highlight.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Script Generator */}
      <div className="container mx-auto px-6 pb-12">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 p-8">
            <h2 className="text-4xl font-bold text-white flex items-center gap-4">
              <Video className="w-10 h-10" />
              AI Video Script Generator
            </h2>
            <p className="text-blue-100 mt-2 text-lg">Create professional video scripts powered by AI</p>
          </div>

          <div className="p-10">
            <label className="block text-gray-900 dark:text-white font-semibold mb-4 text-lg">
              Describe your video concept
            </label>
            <textarea
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="E.g., Create a 3-minute video showcasing the temples and spiritual heritage of the state..."
              className="w-full p-6 border-2 border-gray-300 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all text-lg"
              rows={5}
            />

            <div className="mt-6 mb-8">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Quick Templates:</p>
              <div className="flex flex-wrap gap-3">
                {VIDEO_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setVideoPrompt(prompt)}
                    className="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all border border-gray-300 dark:border-gray-600"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateVideoScript}
              disabled={!videoPrompt.trim() || videoLoading}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-[1.02]"
            >
              {videoLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  Generating Script...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate Video Script
                </>
              )}
            </button>

            {videoScript && (
              <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border-2 border-green-300 dark:border-green-700 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-white" />
                    <h3 className="text-2xl font-bold text-white">Generated Script</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(videoScript)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center gap-2 transition-all"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="p-8">
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-sans leading-relaxed text-base">{videoScript}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Script Decoder */}
      <div className="container mx-auto px-6 pb-12">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 p-8">
            <h2 className="text-4xl font-bold text-white flex items-center gap-4">
              <FileText className="w-10 h-10" />
              Script Decoder & Translator
            </h2>
            <p className="text-purple-100 mt-2 text-lg">Translate regional scripts to English instantly</p>
          </div>

          <div className="p-10">
            <div className="mb-8">
              <label className="block w-full">
                <div className={`border-4 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                  uploadedFile 
                    ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-gray-800' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-gray-800'
                }`}>
                  <Upload className={`w-20 h-20 mx-auto mb-6 ${uploadedFile ? 'text-green-600 dark:text-green-500' : 'text-purple-600 dark:text-purple-500'}`} />
                  <p className="text-gray-900 dark:text-white font-bold text-xl mb-2">
                    {uploadedFile ? `✓ ${uploadedFile.name}` : "Drop your document here"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-base">
                    or click to browse • Supports TXT, DOC, DOCX files
                  </p>
                  <input
                    type="file"
                    accept=".txt,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </label>
            </div>

            <button
              onClick={decodeScript}
              disabled={!uploadedFile || decodeLoading}
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-[1.02]"
            >
              {decodeLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  Decoding...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Decode & Translate
                </>
              )}
            </button>

            {decodedText && (
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border-2 border-blue-300 dark:border-blue-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 p-6 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Check className="w-6 h-6" />
                    Translation Complete
                  </h3>
                  <button
                    onClick={() => copyToClipboard(decodedText)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center gap-2 transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
                <div className="p-8">
                  <div className="prose dark:prose-invert max-w-none">
                    {decodedText.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-4 text-gray-800 dark:text-gray-200 text-base leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}