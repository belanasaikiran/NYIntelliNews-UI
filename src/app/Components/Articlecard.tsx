"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface ArticleCardProps {
  title: string;
  url: string;
  publisher?: string;
  confidenceScore?: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  url,
  publisher,
  confidenceScore,
}) => {
  const router = useRouter();

  const goToSummary = async (title: string) => {
    // ✅ Navigate to results page with category
    router.push(`/summary?title=${encodeURIComponent(title)}`);
  };

  return (
    <div
      onClick={() => goToSummary(title)}
      className="block w-full text-left bg-[#E5D7C6] hover:bg-[#36362E] hover:text-[#E5D7C6] rounded px-4 py-3 transition cursor-pointer shadow-sm"
    >
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-[#5B5B4D] hover:text-[#57574D]">
        {publisher}
      </div>
      {confidenceScore !== undefined && (
        <div className="text-xs text-[#7D7D6E]">
          Confidence: {(confidenceScore * 100).toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default ArticleCard;
