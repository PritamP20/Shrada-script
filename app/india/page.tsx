"use client";

import React, { useState } from "react";
// @ts-ignore
import India from "@svg-maps/india";

interface Location {
  id: string;
  name: string;
  path: string;
}

export default function Page() {
  const [hovered, setHovered] = useState<string>("India");

  const { viewBox, locations } = India as {
    viewBox: string;
    locations: Location[];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* <h1 className="text-2xl font-bold mb-6">India Map</h1> */}

      <svg
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className="w-[600px] h-auto  rounded shadow"
      >
        {locations.map((loc) => (
          <path
            key={loc.id}
            d={loc.path}
            fill={hovered === loc.name ? "#3b82f6" : "#e5e7eb"} // blue on hover, gray otherwise
            stroke="#111"
            strokeWidth={0.5}
            onMouseEnter={() => setHovered(loc.name)}
            onMouseLeave={() => setHovered("India")}
          />
        ))}
      </svg>

      {hovered && (
        <div className="mt-4 px-4 py-2 bg-black text-white text-sm rounded">
          {hovered}
        </div>
      )}
    </div>
  );
}
