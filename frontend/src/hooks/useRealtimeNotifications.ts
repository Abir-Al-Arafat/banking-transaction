import { useEffect, useState } from "react";
import { socketService } from "../services";

export interface RealtimeNotification {
  id: string;
  message: string;
  type: "transaction" | "balance" | "error";
}

export function useRealtimeNotifications() {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>(
    [],
  );

  useEffect(() => {
    const socket = socketService.connect();
    setIsConnected(socket.connected);

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socketService.onTransactionCreated((data) => {
      const nextItem: RealtimeNotification = {
        id: Date.now().toString(),
        message: `Transaction created: ${(data as Record<string, unknown>)?.type || "unknown"}`,
        type: "transaction",
      };

      setNotifications((prev) => [nextItem, ...prev].slice(0, 10));
    });

    socketService.onBalanceUpdated((data) => {
      const nextItem: RealtimeNotification = {
        id: Date.now().toString(),
        message: `Balance updated for ${(data as Record<string, unknown>)?.accountId || "account"}`,
        type: "balance",
      };

      setNotifications((prev) => [nextItem, ...prev].slice(0, 10));
    });

    socketService.onTransactionFailed((data) => {
      const nextItem: RealtimeNotification = {
        id: Date.now().toString(),
        message: `Transaction failed: ${(data as Record<string, unknown>)?.reason || "unknown"}`,
        type: "error",
      };

      setNotifications((prev) => [nextItem, ...prev].slice(0, 10));
    });

    return () => {
      socketService.offTransactionCreated();
      socketService.offBalanceUpdated();
      socketService.offTransactionFailed();
    };
  }, []);

  return {
    isConnected,
    notifications,
  };
}
