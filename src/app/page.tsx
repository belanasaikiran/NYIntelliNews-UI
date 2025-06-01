"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryButton from "./Components/CategoryButton";
import type { LucideIcon } from "lucide-react";
import { convertToBase64, generatePreviewUrl } from "@/app/utils/imageService"

import {
  BookOpen,
  Briefcase,
  Film,
  Globe,
  Heart,
  Home as HomeIcon,
  Newspaper,
  ShoppingBag,
  Utensils,
  Users,
  FlaskConical,
  Cpu,
  Building,
  Theater,
  Plane,
  Banknote,
  Shirt,
  Brain,
  Camera,
  ScrollText,
  CircleDollarSign,
  Landmark,
  LayoutDashboard,
  Car,
} from "lucide-react";

const categoryIcons: { [key: string]: LucideIcon } = {
  arts: Camera,
  automobiles: Car,
  books: BookOpen,
  business: Briefcase,
  fashion: Shirt,
  food: Utensils,
  health: Heart,
  home: HomeIcon,
  insider: Users,
  magazine: ScrollText,
  movies: Film,
  nyregion: Globe,
  obituaries: Newspaper,
  opinion: Brain,
  politics: Landmark,
  realestate: Building,
  science: FlaskConical,
  sports: CircleDollarSign,
  sundayreview: Newspaper,
  technology: Cpu,
  theater: Theater,
  "t-magazine": LayoutDashboard,
  travel: Plane,
  upshot: Banknote,
  us: Globe,
  world: Globe,
};

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
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    const previewUrl = await generatePreviewUrl(file);
    setPreview(previewUrl);
};

  const handleCategoryClick = async (section: string) => {
    // ✅ Navigate to results page with category
    router.push(`/categoryResults?category=${encodeURIComponent(section)}`);
  };

  const handlePromptSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/categoryResults?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  return (
    <main className="min-h-screen p-6 grid lg:grid-cols-2">
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4
        gap-4 mb-10"
      >
        {sections.map((category) => (
          <CategoryButton
            key={category}
            label={category}
            icon={categoryIcons[category]} // ✅ Pass icon here
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>

      <form
        onSubmit={handlePromptSubmit}
        className="w-fit h-fit mx-8  rounded-lg shadow p-6 mb-8"
      >
        <label
          htmlFor="prompt"
          className="block text-[#36362E]  text-lg font-medium mb-2"
        >
          Enter your prompt
        </label>
        <input
          id="prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask IntelliNews anything..."
          className="w-full border text-gray-800 border-[#36362E] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:border-[#36362E] bg-[#E5D7C6]"
        />


        <div className="mt-4">
          <label htmlFor="imageUpload" className="block text-[#36362E] text-lg font-medium mb-2">
            Or upload an image
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border rounded px-4 py-2 bg-[#F3EEE5] text-gray-800 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-[#36362E] text-white py-2 rounded hover:bg-[#E5D7C6] hover:text-[#36362E] transition"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
