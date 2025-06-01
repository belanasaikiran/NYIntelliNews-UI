"use client";
import { useEffect, useRef, useState } from "react";
import DailyIframe from "@daily-co/daily-js";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const [conversationUrl, setConversationUrl] = useState<string>("");
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Handle mouse dragging
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

  // Fetch conversation on load
  useEffect(() => {
    const initConversation = async () => {
      try {
        const res = await fetch(`${backendURL}/api/initConv`);
        const data = await res.json();
        setConversationUrl(data.url);
        console.log("conversationUrl:", conversationUrl);
      } catch (error) {
        console.error("Failed to get conversation URL", error);
      }
    };

    initConversation();
  }, []);

  // Load Daily SDK and join the room
  useEffect(() => {
    if (!conversationUrl || !containerRef.current) return;

    const callFrame = DailyIframe.createFrame({
      iframeStyle: {
        width: "100%",
        height: "360px",
        borderRadius: "0.5rem",
        border: "1px solid #ccc",
      },
    });

    callFrame.join({ url: conversationUrl });

    const iframeEl = callFrame.iframe();
    if (iframeEl) {
      containerRef.current.appendChild(iframeEl);
    }
  }, [conversationUrl]);

  return (
    <div
      ref={widgetRef}
      onMouseDown={handleMouseDown}
      className="fixed z-50 cursor-move bg-white rounded-lg shadow-lg"
      style={{
        left: position.x,
        top: position.y,
        width: 320,
      }}
    >
      <div
        ref={containerRef}
        className="rounded-lg border border-gray-300 min-h-[360px] bg-white"
      >
        {!conversationUrl && (
          <div className="w-full h-[360px] flex items-center justify-center text-gray-500">
            Loading Tavus Video...
          </div>
        )}
      </div>
    </div>
  );
}
