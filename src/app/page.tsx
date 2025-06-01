"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryButton from "../components/CategoryButton";

const sections = [
  "arts", "automobiles", "books", "business", "fashion", "food", "health",
  "home", "insider", "magazine", "movies", "nyregion", "obituaries",
  "opinion", "politics", "realestate", "science", "sports", "sundayreview",
  "technology", "theater", "t-magazine", "travel", "upshot", "us", "world"
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleCategoryClick = (section: string) => {
    router.push(`/results?category=${encodeURIComponent(section)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/results?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">IntelliNews</h1>
      <div className="space-y-2 mb-10">
        {sections.map((section) => (
          <CategoryButton
            key={section}
            label={section}
            onClick={() => handleCategoryClick(section)}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 mb-8">
        <label htmlFor="prompt" className="block text-lg font-medium mb-2">
          Enter your prompt
        </label>
        <input
          id="prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask IntelliNews anything..."
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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