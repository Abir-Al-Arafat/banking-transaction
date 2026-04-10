import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/organisms";
import {
  DashboardPage,
  AccountsPage,
  TransactionsPage,
  NotFoundPage,
} from "./pages";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
