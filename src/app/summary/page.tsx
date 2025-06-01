"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { backendURL } from "@/constants";
import Image from "next/image";
import videoReplacementImage from "@/assets/videoRlacement.png"; // ← this gives you `StaticImageData`
type Article = {
  title: string;
  url: string;
};

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const title = searchParams?.get("title");
  const [summary, setSummary] = useState("");
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [videoPlacement, setVideoPlacement] = useState("");
  const [serverTitle, setServerTitle] = useState("");

  useEffect(() => {
    if (!title) return;

    const fetchSummaryData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendURL}/summarize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });

        const data = await res.json();
        setSummary(data.summary);
        setRelatedArticles(data.relatedArticlesRaw || []);
        setServerTitle(data.givenTitle);
      } catch (err) {
        console.error("Failed to fetch summary data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [title]);

  return (
    <main className="min-h-screen w-full  text-[#36362E] ">
      {loading ? (
        <div className="text-center font-medium">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Video (2/3 width) */}
          <div className="lg:col-span-2 bg-[#E5D7C6] rounded-lg shadow p-4">
            <h1 className="text-2xl font-bold mb-6 ">Summary</h1>

            <h2 className="text-lg font-semibold mb-2">{serverTitle}</h2>

            {videoPlacement ? (
              <iframe
                src={videoPlacement}
                width="100%"
                height="300"
                className="rounded border"
              />
            ) : (
              <Image
                src={videoReplacementImage}
                alt="Video Unavailable"
                width={800}
                height={400}
                className="rounded"
              />
            )}
            {/* Full width: Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="lg:col-span-3 mt-4 p-4 ">
                <h2 className="text-lg font-semibold mb-4">Related Articles</h2>
                <ul className="space-y-2">
                  {relatedArticles.map((article, idx) => (
                    <li key={idx}>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" hover:text-[#36362E] text-[#5B5B4D]"
                      >
                        {idx + 1}.{" "}
                        <span className="underline">{article.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Transcript (1/3 width) */}
          <div className="bg-[#E5D7C6] rounded-lg shadow p-4 h-fit">
            <h2 className="text-lg font-semibold mb-2">Transcript</h2>
            <p className="text-[#5B5B4D] leading-relaxed whitespace-pre-wrap">
              {summary}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
