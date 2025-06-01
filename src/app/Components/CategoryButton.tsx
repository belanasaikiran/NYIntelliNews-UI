"use client";
import React from "react";
import { LucideIcon } from "lucide-react";

interface CategoryButtonProps {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  label,
  onClick,
  icon: Icon,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center text-[#36362E] bg-[#E5D7C6] hover:bg-[#36362E] hover:text-[#E5D7C6] rounded-lg shadow p-4 cursor-pointer  transition text-center"
      onClick={onClick}
    >
      {Icon && <Icon className="w-8 h-8  mb-2" />}
      <span className="text-base font-medium capitalize ">
        {label.replace("-", " ")}
      </span>
    </div>
  );
};

export default CategoryButton;
