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
    <main className="w-full min-h-screen  text-[#36362E] p-6">
      <h1 className="text-2xl font-bold mb-8 text-center text-[#36362E]">
        News Results
      </h1>

      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : articles.length > 0 ? (
        <div className="  p-6">
          <h2 className="text-xl font-semibold mb-4">
            Top Articles for{" "}
            <span className="capitalize text-[#36362E]  font-semibold">
              {category}
            </span>
          </h2>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
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
