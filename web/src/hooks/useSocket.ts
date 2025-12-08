import { useEffect, useState, useCallback } from "react";
import { getSocket, connectSocket } from "../lib/socket";

interface UseSocketOptions {
  autoConnect?: boolean;
}

interface SocketState {
  connected: boolean;
  error: string | null;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { autoConnect = false } = options;
  const [state, setState] = useState<SocketState>({
    connected: false,
    error: null,
  });

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      console.log("[useSocket] Socket connected:", socket.id);
      setState({ connected: true, error: null });
    };

    const handleDisconnect = (reason: string) => {
      console.log("[useSocket] Socket disconnected:", reason);
      setState({ connected: false, error: null });
    };

    const handleError = (error: Error) => {
      console.error("[useSocket] Socket error:", error.message);
      setState({ connected: false, error: error.message });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    if (autoConnect && !socket.connected) {
      socket.connect();
    }

    setState({ connected: socket.connected, error: null });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
    };
  }, [autoConnect]);

  const connect = useCallback(() => {
    const socket = connectSocket();
    setState({ connected: socket.connected, error: null });
  }, []);

  const joinThread = useCallback((threadId: string) => {
    const socket = getSocket();
    if (socket.connected) {
      socket.emit("join_thread", threadId);
      console.log("[useSocket] Joined thread:", threadId);
    }
  }, []);

  const leaveThread = useCallback((threadId: string) => {
    const socket = getSocket();
    if (socket.connected) {
      socket.emit("leave_thread", threadId);
      console.log("[useSocket] Left thread:", threadId);
    }
  }, []);

  const startTyping = useCallback((threadId: string) => {
    const socket = getSocket();
    if (socket.connected) {
      socket.emit("typing_start", threadId);
    }
  }, []);

  const stopTyping = useCallback((threadId: string) => {
    const socket = getSocket();
    if (socket.connected) {
      socket.emit("typing_stop", threadId);
    }
  }, []);

  const markMessageRead = useCallback((threadId: string, messageId: string) => {
    const socket = getSocket();
    if (socket.connected) {
      socket.emit("message_read", { threadId, messageId });
    }
  }, []);

  return {
    connected: state.connected,
    error: state.error,
    connect,
    joinThread,
    leaveThread,
    startTyping,
    stopTyping,
    markMessageRead,
  };
};
