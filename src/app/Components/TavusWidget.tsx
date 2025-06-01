"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { backendURL } from "@/constants";

// utils/sendMessage.ts
export async function sendMessage(
  conversationId: string,
  url: string,
  message: string,
) {
  const script = document.createElement("script");
  script.src = "https://unpkg.com/@daily-co/daily-js";
  script.async = true;

  script.onload = async () => {
    const daily = (window as any).Daily;
    const call = daily.createFrame({
      iframeStyle: {
        width: "1px",
        height: "1px",
        position: "absolute",
        left: "-9999px",
      },
    });

    await call.join({ url });

    const payload = {
      message_type: "conversation",
      event_type: "conversation.echo",
      conversation_id: conversationId,
      properties: { text: message },
    };

    call.sendAppMessage(payload, "*");
    console.log("Message sent to Tavus");
  };

  document.body.appendChild(script);
}

export default function TavusWidget() {
  const pathname = usePathname();
  const widgetRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [conversationUrl, setConversationUrl] = useState<string>("");
  const [call, setCall] = useState<any>(null);

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

  // Load Daily SDK & start conversation
  useEffect(() => {
    const initConversation = async () => {
      const res = await fetch(`${backendURL}/api/initConv`);
      console.log("Result: init: ", res);
      const data = await res.json();
      setConversationUrl(data.conversationUrl);

      // // Load Daily SDK
      // const script = document.createElement("script");
      // script.src = "https://unpkg.com/@daily-co/daily-js";
      // script.async = true;
      // script.onload = async () => {
      //   const daily = (window as any).Daily;
      //   const frame = daily.createFrame({
      //     iframeStyle: {
      //       width: "1px",
      //       height: "1px",
      //       position: "absolute",
      //       left: "-9999px",
      //     },
      //   });
      //   await frame.join({ url: data.conversationUrl });
      //   setCall(frame);
      // };
      // document.body.appendChild(script);
    };
  }, []);

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
        src={conversationUrl}
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
