"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ArticleCard from "@/app/Components/Articlecard";

interface Article {
  title: string;
  url: string;
  publisher?: string;
  confidenceScore?: number;
}

export default function Results() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const prompt = searchParams.get("prompt");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/news-pipeline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category ? { category } : { prompt }),
        });

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
      <h1 className="text-2xl font-bold mb-8 text-center">News Results</h1>
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : articles.length > 0 ? (
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Top Articles</h2>
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
