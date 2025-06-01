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
      } catch (err) {
        console.error("Failed to fetch summary data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [title]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-900">
        Summary
      </h1>
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 ">
            <div>
              {relatedArticles.length > 0 && (
                <div className="max-w-2xl mx-auto bg-white p-4 rounded shadow">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Related Articles
                  </h2>
                  <ul className="space-y-2">
                    {relatedArticles.map((article, idx) => (
                      <li key={idx}>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:underline"
                        >
                          {article.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="max-w-2xl mx-auto bg-white p-4 rounded shadow mb-8">
              {/* Show the Video Iframe */}
              <div className="">
                {videoPlacement != "" ? (
                  <div>
                    <iframe src="" width="600" height="400"></iframe>
                  </div>
                ) : (
                  <Image
                    src={videoReplacementImage}
                    alt="Landscape picture"
                    width={800}
                    height={500}
                  />
                )}
              </div>

              <h2 className=" my-4 text-lg font-semibold mb-4 text-gray-800">
                Transcript
              </h2>
              <p className="text-gray-800">{summary}</p>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
