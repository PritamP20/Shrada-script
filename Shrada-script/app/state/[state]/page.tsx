"use client";

import { GoogleGenAI } from "@google/genai";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Upload, Sparkles, FileText, Video, ArrowLeft, MapPin, Users, Globe, Languages, Clock, Download, Copy, Check, Palette, Mountain } from "lucide-react";

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
  "Cinematic 2-min cultural tour",
  "Historical documentary script",
  "Food & festival showcase",
  "Tourist destination guide",
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
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-neutral-200 dark:border-neutral-800"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-orange-500 animate-spin"></div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium">Loading {stateName}...</p>
        </div>
      </div>
    );
  }

  if (error || !stateData) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Unable to Load</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">{error || "Something went wrong"}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-28 bg-neutral-50 dark:bg-neutral-950">
      {/* Minimal Header */}
      {/* <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500">
            <MapPin className="w-4 h-4" />
            <span>{stateName}</span>
          </div>
        </div>
      </header> */}

      {/* Hero with Organic Layout */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Image */}
          <div className="lg:col-span-7">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <img
                src={stateData.mainImage}
                alt={stateName}
                className="relative w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Right: Title & Stats */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight">
                {stateName}
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                A journey through heritage and culture
              </p>
            </div>

            {/* Stats as simple cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-500 text-xs font-medium uppercase tracking-wide mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Capital
                </div>
                <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{stateData.capital}</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-500 text-xs font-medium uppercase tracking-wide mb-2">
                  <Users className="w-3.5 h-3.5" />
                  Population
                </div>
                <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{stateData.population}</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-500 text-xs font-medium uppercase tracking-wide mb-2">
                  <Globe className="w-3.5 h-3.5" />
                  Area
                </div>
                <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{stateData.area}</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-500 text-xs font-medium uppercase tracking-wide mb-2">
                  <Languages className="w-3.5 h-3.5" />
                  Languages
                </div>
                <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{stateData.languages}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History & Culture - Side by Side */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          <article className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">History</h2>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{stateData.history}</p>
          </article>

          <article className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                <Palette className="w-5 h-5 text-red-600 dark:text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Culture</h2>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{stateData.culture}</p>
          </article>
        </div>
      </section>

      {/* Highlights - Bento Style */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">Highlights</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stateData.highlights.map((highlight, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-xl aspect-square">
              <img 
                src={highlight.image} 
                alt={highlight.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-semibold text-sm">{highlight.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Script Generator - Clean Design */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="p-8 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Video Script Generator</h2>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">AI-powered script creation for {stateName}</p>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Describe your video
              </label>
              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="Create a video showcasing the temples and spiritual sites..."
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 resize-none"
                rows={4}
              />
            </div>

            <div>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-500 uppercase tracking-wide mb-3">Quick starts</p>
              <div className="flex flex-wrap gap-2">
                {VIDEO_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setVideoPrompt(prompt)}
                    className="px-3 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateVideoScript}
              disabled={!videoPrompt.trim() || videoLoading}
              className="w-full py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {videoLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-neutral-900/30 dark:border-t-neutral-900 rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Script
                </>
              )}
            </button>

            {videoScript && (
              <div className="mt-6 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">Your Script</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(videoScript)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="p-6">
                  <pre className="whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300 font-mono leading-relaxed">{videoScript}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Script Decoder */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="p-8 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Script Translator</h2>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">Translate regional scripts to English</p>
          </div>

          <div className="p-8 space-y-6">
            <label className="block">
              <div className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                uploadedFile 
                  ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950/20' 
                  : 'border-neutral-300 dark:border-neutral-700 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-neutral-50 dark:hover:bg-neutral-950'
              }`}>
                <Upload className={`w-12 h-12 mx-auto mb-4 ${uploadedFile ? 'text-green-600 dark:text-green-500' : 'text-neutral-400'}`} />
                <p className="text-neutral-900 dark:text-neutral-100 font-medium mb-1">
                  {uploadedFile ? uploadedFile.name : "Drop your file here"}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-500">
                  {uploadedFile ? "Ready to translate" : "TXT, DOC, DOCX supported"}
                </p>
                <input
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </label>

            <button
              onClick={decodeScript}
              disabled={!uploadedFile || decodeLoading}
              className="w-full py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {decodeLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-neutral-900/30 dark:border-t-neutral-900 rounded-full animate-spin"></div>
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4" />
                  Translate
                </>
              )}
            </button>

            {decodedText && (
              <div className="mt-6 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">Translation</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(decodedText)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {decodedText.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}