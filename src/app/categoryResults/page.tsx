"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ArticleCard from "@/app/Components/Articlecard";
import { backendURL } from "@/constants";
import { useRouter } from "next/navigation";

interface Article {
  title: string;
  url: string;
  publisher?: string;
  confidenceScore?: number;
}

export default function Results() {
  const searchParams = useSearchParams();
  const category = searchParams?.get("category");
  const prompt = searchParams?.get("prompt");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  // const router = useRouter();

  // const goToSummary = async (title: string) => {
  //   // ✅ Navigate to results page with category
  //   router.push(`/summary?title=${encodeURIComponent(title)}`);
  // };

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        console.log("category: ", category);
        const res = await fetch(`${backendURL}/api/nyt-news`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: category || prompt,
            ...(category && { mode: "top" }),
          }),
        });

        console.log("result: ", res);

        const data = await res.json();
        setArticles(data.results || []);
      } catch (error) {
        console.error("Error fetching news:", error);
        setArticles([]);
      }
      setLoading(false);
    };

    fetchArticles();
  }, [category, prompt]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-900">
        News Results
      </h1>
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : articles.length > 0 ? (
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Top Articles for {category}
          </h2>
          <div className="flex flex-col gap-3">
            {articles.map((article, idx) => (
              <ArticleCard key={idx} {...article} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-lg">No results found.</div>
      )}
    </main>
  );
}
