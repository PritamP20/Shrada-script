"use client";

import { GoogleGenAI } from "@google/genai";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// @ts-ignore
import India from "@svg-maps/india";
import { MapPin, Users, Globe, Languages, Clock, Palette, Sparkles, ArrowRight } from "lucide-react";

interface Location {
  id: string;
  name: string;
  path: string;
}

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
const generatedDataCache: Record<string, StateData> = {};

async function generateStateData(state: string): Promise<StateData | null> {
  const prompt = `Provide detailed information about ${state} state in India. Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:

{
  "capital": "capital city name",
  "population": "approximate population",
  "area": "area in sq km",
  "languages": "main languages spoken",
  "history": "A detailed paragraph about the historical background of ${state} (4-5 sentences)",
  "culture": "A detailed paragraph about the cultural heritage and traditions of ${state} (4-5 sentences)",
  "mainImage": "https://picsum.photos/800/400",
  "highlights": [
    {"name": "Famous festival or dance", "image": "https://picsum.photos/300/200"},
    {"name": "Traditional cuisine or dish", "image": "https://picsum.photos/300/201"},
    {"name": "Historical monument or site", "image": "https://picsum.photos/300/202"},
    {"name": "Art form or craft", "image": "https://picsum.photos/300/203"}
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
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.capital || !parsed.history || !parsed.culture) return null;

    return parsed as StateData;
  } catch (err) {
    console.error("Error generating state data:", err);
    return null;
  }
}

export default function Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<StateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { viewBox, locations } = India as {
    viewBox: string;
    locations: Location[];
  };

  useEffect(() => {
    async function loadStateData() {
      if (!selected) {
        setSelectedData(null);
        setError(null);
        return;
      }

      if (generatedDataCache[selected]) {
        setSelectedData(generatedDataCache[selected]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await generateStateData(selected);
        if (data) {
          generatedDataCache[selected] = data;
          setSelectedData(data);
        } else {
          setError("Failed to generate state data. Please try again.");
        }
      } catch {
        setError("An error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    }

    loadStateData();
  }, [selected]);

  return (
    <div className="min-h-screen mt-28 bg-neutral-50 dark:bg-neutral-950 p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            Explore India
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Click on any state to discover its heritage and culture
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel - History */}
          <div className="lg:col-span-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="h-[calc(100vh-200px)] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <div className="w-12 h-12 mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-neutral-200 dark:border-neutral-800"></div>
                    <div className="absolute inset-0 rounded-full border-t-2 border-orange-500 animate-spin"></div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">Loading history...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to Load</p>
                  <p className="text-neutral-500 dark:text-neutral-500 text-sm">{error}</p>
                </div>
              ) : selectedData ? (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{selected}</h2>
                    <button
                      onClick={() => router.push(`/state/${encodeURIComponent(selected!)}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
                    >
                      View More
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="space-y-3 mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Capital:</span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selectedData.capital}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Population:</span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selectedData.population}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Area:</span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selectedData.area}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Languages className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Languages:</span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selectedData.languages}</span>
                    </div>
                  </div>

                  {/* History Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">History</h3>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm">
                      {selectedData.history}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-neutral-400" />
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">Select a state to view its history</p>
                </div>
              )}
            </div>
          </div>

          {/* Center Panel - Map */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
              <svg
                viewBox={viewBox}
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto max-w-[500px]"
              >
                {locations.map((loc) => (
                  <path
                    key={loc.id}
                    d={loc.path}
                    fill={selected === loc.name ? "#f97316" : "#e5e5e5"}
                    stroke="#525252"
                    strokeWidth={0.3}
                    className="cursor-pointer transition-all duration-200 hover:fill-orange-400 dark:hover:fill-orange-500"
                    style={{
                      filter: selected === loc.name ? "drop-shadow(0 4px 6px rgba(249, 115, 22, 0.3))" : "none"
                    }}
                    onClick={() => setSelected(loc.name)}
                  />
                ))}
              </svg>
            </div>

            {selected && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{selected}</span>
              </div>
            )}
          </div>

          {/* Right Panel - Culture */}
          <div className="lg:col-span-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="h-[calc(100vh-200px)] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <div className="w-12 h-12 mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-neutral-200 dark:border-neutral-800"></div>
                    <div className="absolute inset-0 rounded-full border-t-2 border-orange-500 animate-spin"></div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">Loading culture...</p>
                </div>
              ) : selectedData ? (
                <div className="p-8">
                  {/* Main Image */}
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <img
                      src={selectedData.mainImage}
                      alt={selected}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  {/* Culture Section */}
                  <div className="mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-5 h-5 text-orange-500" />
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Culture</h3>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm">
                      {selectedData.culture}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-orange-500" />
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Highlights</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedData.highlights.map((highlight, idx) => (
                        <div key={idx} className="group">
                          <div className="bg-neutral-50 dark:bg-neutral-950 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                            <div className="relative overflow-hidden aspect-video">
                              <img
                                src={highlight.image}
                                alt={highlight.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                            <div className="p-3">
                              <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 leading-snug">
                                {highlight.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                    <Palette className="w-8 h-8 text-neutral-400" />
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">Select a state to discover its culture</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}