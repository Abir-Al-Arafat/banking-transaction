import { FC, useState, useEffect } from "react";
import { Card } from "../components/atoms";
import { RealtimeIndicator } from "../components/organisms";
import { socketService } from "../services";

interface Notification {
  id: string;
  message: string;
  type: "transaction" | "balance" | "error";
}

export const DashboardPage: FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const socket = socketService.connect();
    setIsConnected(socket.connected);

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socketService.onTransactionCreated(((data: any) => {
      const notif: Notification = {
        id: Date.now().toString(),
        message: `Transaction created: ${data?.type || "unknown"}`,
        type: "transaction",
      };
      setNotifications((prev) => [notif, ...prev].slice(0, 10));
    }) as unknown as (callback: unknown) => void);

    socketService.onBalanceUpdated(((data: any) => {
      const notif: Notification = {
        id: Date.now().toString(),
        message: `Balance updated for ${data?.accountId || "account"}`,
        type: "balance",
      };
      setNotifications((prev) => [notif, ...prev].slice(0, 10));
    }) as unknown as (callback: unknown) => void);

    socketService.onTransactionFailed(((data: any) => {
      const notif: Notification = {
        id: Date.now().toString(),
        message: `Transaction failed: ${data?.reason || "unknown"}`,
        type: "error",
      };
      setNotifications((prev) => [notif, ...prev].slice(0, 10));
    }) as unknown as (callback: unknown) => void);

    return () => {
      socketService.offTransactionCreated();
      socketService.offBalanceUpdated();
      socketService.offTransactionFailed();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Welcome to Banking System</h2>
          <p className="text-gray-600 mb-6">
            Manage your accounts and transactions with real-time updates.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Realtime Status</p>
              <RealtimeIndicator isConnected={isConnected} />
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">System Status</p>
              <p className="text-lg font-semibold text-green-600">
                Operational
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <Card>
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">No activity yet</p>
            ) : (
              notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-2 text-xs rounded ${
                    notif.type === "error"
                      ? "bg-red-50 text-red-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {notif.message}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
