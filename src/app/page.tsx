"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryButton from "./Components/CategoryButton";

const sections = [
  "arts",
  "automobiles",
  "books",
  "business",
  "fashion",
  "food",
  "health",
  "home",
  "insider",
  "magazine",
  "movies",
  "nyregion",
  "obituaries",
  "opinion",
  "politics",
  "realestate",
  "science",
  "sports",
  "sundayreview",
  "technology",
  "theater",
  "t-magazine",
  "travel",
  "upshot",
  "us",
  "world",
];
export default function Home() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleCategoryClick = async (section: string) => {
    // ✅ Navigate to results page with category
    router.push(`/categoryResults?category=${encodeURIComponent(section)}`);
  };

  const handlePromptSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/results?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  return (
    <main className="min-h-screen  p-6 grid lg:grid-cols-2">
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3
        gap-4 mb-10"
      >
        {sections.map((category) => (
          <CategoryButton
            key={category}
            label={category}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>

      <form
        onSubmit={handlePromptSubmit}
        className="w-full mx-8  rounded-lg shadow p-6 mb-8"
      >
        <label
          htmlFor="prompt"
          className="block text-gray-700 text-lg font-medium mb-2"
        >
          Enter your prompt
        </label>
        <input
          id="prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask IntelliNews anything..."
          className="w-full border text-gray-800 border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
