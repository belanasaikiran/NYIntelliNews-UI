"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import appLogo from "@/assets/logo.png";

export default function NavBar() {
  return (
    <nav className="bg-[#E5D7C6] shadow px-6 py-2 mb-6  w-screen">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold  text-[#36362E] flex gap-2"
        >
          <Image src={appLogo} alt="Landscape picture" width={60} height={40} />
          <div>
            NYC IntelliNews <br />
            <p className="text-base text-gray-600">
              Trusted Personalized AI powered news for every New Yorker
            </p>
          </div>
        </Link>
        <div className="space-x-4">
          <Link
            href="https://github.com/belanasaikiran/NYIntelliNews"
            passHref
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-600"
          >
            Source Code
          </Link>
          {/* Add more links here later if needed */}
        </div>
      </div>
    </nav>
  );
}
