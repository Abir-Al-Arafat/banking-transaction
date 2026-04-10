import { FC } from "react";
import { Card } from "../components/atoms";
import { NotificationList, RealtimeIndicator } from "../components/organisms";
import { useRealtimeNotifications } from "../hooks";

export const DashboardPage: FC = () => {
  const { isConnected, notifications } = useRealtimeNotifications();

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
          <NotificationList notifications={notifications} />
        </Card>
      </div>
    </div>
  );
};
