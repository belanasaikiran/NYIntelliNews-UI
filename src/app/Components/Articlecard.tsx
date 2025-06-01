"use client";
import React from "react";

interface ArticleCardProps {
  title: string;
  url: string;
  publisher?: string;
  confidenceScore?: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, url, publisher, confidenceScore }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full text-left bg-blue-100 hover:bg-blue-200 rounded px-4 py-2 text-blue-800 font-medium transition cursor-pointer"
    >
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-700">{publisher}</div>
      {confidenceScore !== undefined && (
        <div className="text-xs text-gray-500">Confidence: {(confidenceScore * 100).toFixed(1)}%</div>
      )}
    </a>
  );
};

export default ArticleCard;