import { FC, ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: "blue" | "green" | "red" | "yellow";
}

export const Badge: FC<BadgeProps> = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${colors[color]}`}
    >
      {children}
    </span>
  );
};
