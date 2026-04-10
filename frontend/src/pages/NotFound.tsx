import { FC } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "../components/atoms";

export const NotFoundPage: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-600 mb-6">Page not found</p>
        <Link to="/">
          <Button>Back to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
};
