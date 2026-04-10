import { FC } from "react";

export const Header: FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Banking Transaction System
        </h1>
      </div>
    </header>
  );
};
