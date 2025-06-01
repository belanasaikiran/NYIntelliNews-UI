"use client";
import React from "react";

interface CategoryButtonProps {
  label: string;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ label, onClick }) => {
  return (
    <div
      className="flex items-center bg-white rounded-lg shadow px-4 py-2 overflow-x-auto cursor-pointer hover:bg-blue-50 transition"
      onClick={onClick}
    >
      <span className="text-lg font-semibold capitalize text-gray-700">{label}</span>
      <div className="flex-1 border-b border-dashed border-gray-200 mx-4"></div>
      <button className="text-blue-600 hover:underline text-sm">Explore</button>
    </div>
  );
};

export default CategoryButton;