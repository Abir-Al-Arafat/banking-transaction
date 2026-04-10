import { FC } from "react";

interface NotificationListProps {
  notifications: Array<{ id: string; message: string; type: string }>;
}

export const NotificationList: FC<NotificationListProps> = ({
  notifications,
}) => {
  return (
    <div className="space-y-2">
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications</p>
      ) : (
        notifications.slice(0, 5).map((notif) => (
          <div
            key={notif.id}
            className="p-3 bg-blue-50 border-l-4 border-blue-500 text-sm text-gray-700"
          >
            {notif.message}
          </div>
        ))
      )}
    </div>
  );
};
