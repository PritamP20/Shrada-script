"use client";

import { GoogleGenAI } from "@google/genai";
import React, { useState, useEffect } from "react";
// @ts-ignore
import India from "@svg-maps/india";

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

// ===============================
// Gemini API Key
// ===============================
const GEMINI_API_KEY = "AIzaSyCzOAdVfUSllbeQlWmaEKSqXoHwKeIc2kk";

// Initialize the GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Cache for generated data
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
    <div className="flex items-start justify-between min-h-screen bg-[#FFF8E1] gap-6 p-6">
      {/* LEFT - State History */}
      <div className="flex-1 bg-[#FFFFFF] rounded-2xl shadow-lg p-6 max-h-[90vh] overflow-y-auto border-l-4 border-[#FF6F00]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF6F00] mx-auto mb-4"></div>
            <p className="text-[#212121]">Generating information...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-6xl mb-4 text-[#C62828]">⚠️</div>
              <p className="text-[#C62828] font-semibold mb-2">Error Loading Data</p>
              <p className="text-[#616161] text-sm">{error}</p>
            </div>
          </div>
        ) : selectedData ? (
          <>
            <h2 className="text-3xl font-bold mb-4 text-[#FF6F00]">{selected}</h2>
            <div className="space-y-3 mb-4">
              <p className="text-[#212121]">
                <span className="font-semibold text-[#1976D2]">Capital:</span> {selectedData.capital}
              </p>
              <p className="text-[#212121]">
                <span className="font-semibold text-[#1976D2]">Population:</span> {selectedData.population}
              </p>
              <p className="text-[#212121]">
                <span className="font-semibold text-[#1976D2]">Area:</span> {selectedData.area}
              </p>
              <p className="text-[#212121]">
                <span className="font-semibold text-[#1976D2]">Languages:</span> {selectedData.languages}
              </p>
            </div>
            <div className="border-t border-[#1976D2] pt-4">
              <h3 className="text-xl font-semibold mb-3 text-[#C62828] flex items-center">
                <span className="mr-2">📜</span> Historical Background
              </h3>
              <p className="text-[#212121] leading-relaxed text-justify">{selectedData.history}</p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-[#616161]">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🏛️</span>
              <p className="text-lg">Select a state to explore its history</p>
            </div>
          </div>
        )}
      </div>

      {/* CENTER - Map */}
      <div className="flex flex-col items-center justify-center">
        <svg
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
          className="w-[600px] h-auto rounded-xl shadow-xl bg-[#FFFFFF] p-4 border-2 border-[#1976D2]"
        >
          {locations.map((loc) => (
            <path
              key={loc.id}
              d={loc.path}
              fill={selected === loc.name ? "#FF6F00" : "#E0E0E0"}
              stroke="#212121"
              strokeWidth={0.5}
              className="cursor-pointer transition-all duration-200 hover:fill-[#F9A825]"
              onClick={() => setSelected(loc.name)}
            />
          ))}
        </svg>

        {selected && (
          <div className="mt-6 flex items-center gap-5">
            <div className="px-6 py-3 bg-[#FF6F00] text-white text-lg rounded-full shadow-lg">
              <span className="font-semibold">{selected}</span>
            </div>
            <div className="px-6 py-3 bg-[#1976D2] text-white text-lg rounded-full shadow-lg">
              <span className="font-semibold">View In Detail</span>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT - Cultural Information */}
      <div className="flex-1 bg-[#FFFFFF] rounded-2xl shadow-lg p-6 max-h-[90vh] overflow-y-auto border-r-4 border-[#FF6F00]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#388E3C] mx-auto mb-4"></div>
            <p className="text-[#212121]">Loading cultural insights...</p>
          </div>
        ) : selectedData ? (
          <>
            <div className="mb-6">
              <img
                src={selectedData.mainImage}
                alt={selected}
                className="w-full h-64 object-cover rounded-xl shadow-md border-2 border-[#1976D2]"
              />
            </div>

            <div className="border-b border-[#1976D2] pb-4 mb-4">
              <h3 className="text-xl font-semibold mb-3 text-[#388E3C] flex items-center">
                <span className="mr-2">🎨</span> Cultural Heritage
              </h3>
              <p className="text-[#212121] leading-relaxed text-justify">{selectedData.culture}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-[#C62828] flex items-center">
                <span className="mr-2">✨</span> Cultural Highlights
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {selectedData.highlights.map((highlight, idx) => (
                  <div key={idx} className="text-center bg-[#FFF8E1] rounded-lg p-3 border border-[#1976D2]">
                    <img
                      src={highlight.image}
                      alt={highlight.name}
                      className="w-full h-28 object-cover rounded-lg shadow-sm mb-2 border-2 border-[#FF6F00]"
                    />
                    <p className="text-sm font-medium text-[#212121]">{highlight.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-[#616161]">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🎭</span>
              <p className="text-lg">Select a state to discover its culture</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
