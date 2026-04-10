import { FC } from "react";

interface RealtimeIndicatorProps {
  isConnected: boolean;
}

export const RealtimeIndicator: FC<RealtimeIndicatorProps> = ({
  isConnected,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="text-xs text-gray-600">
        {isConnected ? "Live" : "Disconnected"}
      </span>
    </div>
  );
};
