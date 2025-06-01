"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Results() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const prompt = searchParams.get("prompt");
  const [headlines, setHeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      let results: any[] = [];
      try {
        if (category) {
          // Fetch from both NYT top and Google for category
          const [nytRes, googleRes] = await Promise.all([
            fetch("/api/nyt-news", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: category, mode: "top" }),
            }).then((r) => r.json()),
            fetch("/api/google-news", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: category, numResults: 10 }),
            }).then((r) => r.json()),
          ]);
          results = [...(nytRes.results || []), ...(googleRes.results || [])];
        } else if (prompt) {
          // Fetch from NYT search and Google search for prompt
          const [nytRes, googleRes] = await Promise.all([
            fetch("/api/nyt-news", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: prompt }),
            }).then((r) => r.json()),
            fetch("/api/google-news", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: prompt, numResults: 10 }),
            }).then((r) => r.json()),
          ]);
          results = [...(nytRes.results || []), ...(googleRes.results || [])];
        }
        setHeadlines(results);
      } catch (err) {
        setHeadlines([]);
      }
      setLoading(false);
    };
    fetchNews();
  }, [category, prompt]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-8 text-center">News Results</h1>
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : headlines.length > 0 ? (
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Headlines</h2>
          <div className="flex flex-col gap-3">
            {headlines.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left bg-blue-100 hover:bg-blue-200 rounded px-4 py-2 text-blue-800 font-medium transition cursor-pointer"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-lg">No headlines found.</div>
      )}
    </main>
  );
}
