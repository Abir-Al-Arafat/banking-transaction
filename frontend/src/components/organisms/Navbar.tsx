import { FC } from "react";
import { Link } from "react-router-dom";

export const Navbar: FC = () => {
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Accounts", path: "/accounts" },
    { label: "Transactions", path: "/transactions" },
  ];

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
