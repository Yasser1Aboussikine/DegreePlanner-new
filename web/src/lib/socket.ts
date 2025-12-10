import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5002";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = localStorage.getItem("accessToken");

    console.log("[Socket] Creating new socket instance. Token exists:", !!token);
    console.log("[Socket] Connecting to:", SOCKET_URL);

    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
    });

    socket.on("connect", () => {
      console.log("[Socket] ✅ Connected successfully! Socket ID:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] ❌ Disconnected. Reason:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] ❌ Connection error:", error.message);
    });

    // Debug: Log ALL events
    socket.onAny((eventName, ...args) => {
      console.log(`[Socket] 📨 Event received: "${eventName}"`, args);
    });
  }

  return socket;
};

export const connectSocket = () => {
  const socket = getSocket();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};
