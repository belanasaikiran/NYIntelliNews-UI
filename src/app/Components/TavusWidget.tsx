"use client";
import { useEffect, useRef, useState } from "react";
import DailyIframe from "@daily-co/daily-js";
import { backendURL } from "@/constants";

// Global reference to store the call instance
let activeCallFrame: any = null;

// Send message to the active call
export function sendTavusMessage(
  conversationId: string,
  message: string,
) {
  if (!activeCallFrame) {
    console.error("No active call to send message to");
    return false;
  }

  const payload = {
    message_type: "conversation",
    event_type: "conversation.echo",
    conversation_id: conversationId,
    properties: { text: message },
  };

  activeCallFrame.sendAppMessage(payload, "*");
  console.log("Message sent to Tavus");
  return true;
}

// Legacy function - kept for reference
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

  const [conversationUrl, setConversationUrl] = useState<string>("null");
  const [conversationId, setConversationId] = useState<string>("");
  // No position state needed for fixed positioning

  // Fetch conversation on load
  useEffect(() => {
    const initConversation = async () => {
      try {
        const res = await fetch(`${backendURL}/api/initConv`);
        const data = await res.json();
        setConversationUrl(data.url);
        
        // Extract conversation ID from URL
        const urlParts = data.url.split('/');
        const id = urlParts[urlParts.length - 1];
        setConversationId(id);
        
        console.log("conversationUrl:", data.url);
        console.log("conversationId:", id);
      } catch (error) {
        console.error("Failed to get conversation URL", error);
      }
    };

    initConversation();
  }, []);

  // Load Daily SDK and join the room
  useEffect(() => {
    if (conversationUrl == "null" || !containerRef.current) return;

    const callFrame = DailyIframe.createFrame({
      iframeStyle: {
        width: "100%",
        height: "360px",
        borderRadius: "0.5rem",
        border: "1px solid #ccc",
      },
    });

    // Set up event listener for app messages
    callFrame.on("app-message", (event: any) => {
      console.log("Received app message:", event);
      // You can handle incoming messages here
    });

    callFrame.join({ url: conversationUrl });

    // Store the callFrame in the global reference for use by sendTavusMessage
    activeCallFrame = callFrame;

    const iframeEl = callFrame.iframe();
    if (iframeEl) {
      containerRef.current.appendChild(iframeEl);
    }

    // Cleanup when component unmounts
    return () => {
      callFrame.leave();
      activeCallFrame = null;
    };
  }, [conversationUrl]);

  return (
    <div ref={widgetRef} className=" bg-white rounded-lg shadow-lg">
      <div
        ref={containerRef}
        className="rounded-lg border border-gray-300 min-h-[360px] bg-white"
      >
        {!conversationUrl && (
          <div className="w-full h-[360px] flex items-center justify-center text-gray-500">
            Connecting to News Reader...
          </div>
        )}
      </div>
    </div>
  );
}
