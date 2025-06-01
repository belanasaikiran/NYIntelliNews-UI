"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function TavusWidget() {
  const pathname = usePathname();
  const widgetRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    };

    const handleMouseUp = () => setDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = widgetRef.current?.getBoundingClientRect();
    if (rect) {
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setDragging(true);
    }
  };

  // Optional: Hide on specific pages
  if (pathname === "/somePageToHide") return null;

  return (
    <div
      ref={widgetRef}
      onMouseDown={handleMouseDown}
      className="fixed z-50 cursor-move"
      style={{
        left: position.x,
        top: position.y,
        width: 320,
      }}
    >
      <iframe
        src="https://embed.tavus.io/personas/YOUR_PERSONA_ID"
        width="100%"
        height="360"
        className="rounded-lg shadow-lg border border-gray-300"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Tavus AI Persona"
      ></iframe>
    </div>
  );
}
