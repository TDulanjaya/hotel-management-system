import { useEffect, useRef, useState } from "react";
import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useWebSocket(topic: string, onMessageCallback?: (message: any) => void) {
  const [connected, setConnected] = useState(false);
  const callbackRef = useRef(onMessageCallback);

  useEffect(() => {
    callbackRef.current = onMessageCallback;
  }, [onMessageCallback]);

  useEffect(() => {
    let subscription: StompSubscription | null = null;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const socket = new SockJS(`${baseUrl}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: function (str) {
        // Only log in dev if needed
      },
      onConnect: () => {
        setConnected(true);
        subscription = client.subscribe(topic, (message) => {
          if (callbackRef.current) {
            callbackRef.current(message.body);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
      },
      onWebSocketClose: () => {
        setConnected(false);
      },
    });

    client.activate();

    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch {
          // ignore cleanup errors
        }
      }
      try {
        client.deactivate();
      } catch {
        // ignore cleanup errors
      }
    };
  }, [topic]);

  return { connected };
}
