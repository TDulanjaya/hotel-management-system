import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useSWRConfig } from "swr";

export function useWebSocket(topic: string, onMessageCallback?: (message: any) => void) {
  const [connected, setConnected] = useState(false);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {
        console.log("STOMP: " + str);
      },
      onConnect: () => {
        setConnected(true);
        console.log(`Connected to STOMP WebSocket. Subscribing to ${topic}`);
        client.subscribe(topic, (message) => {
          if (onMessageCallback) {
            onMessageCallback(message.body);
          } else {
            console.log("Received message on " + topic + ": " + message.body);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
      onWebSocketClose: () => {
        setConnected(false);
      }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [topic, mutate, onMessageCallback]);

  return { connected };
}
