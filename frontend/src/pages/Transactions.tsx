import { FC, useState } from "react";
import { Card } from "../components/atoms";
import { TransactionForm } from "../components/molecules";
import { transactionService } from "../services";

export const TransactionsPage: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTransaction = async (payload: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      await transactionService.create(
        payload as Parameters<typeof transactionService.create>[0],
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <TransactionForm
          type="deposit"
          onSubmit={handleTransaction}
          isLoading={isLoading}
        />
      </div>
      <div>
        <TransactionForm
          type="withdraw"
          onSubmit={handleTransaction}
          isLoading={isLoading}
        />
      </div>
      <div>
        <TransactionForm
          type="transfer"
          onSubmit={handleTransaction}
          isLoading={isLoading}
        />
      </div>

      <div className="lg:col-span-3">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Transaction Guide</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900">Deposit</h3>
              <p>Add funds to an account</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Withdraw</h3>
              <p>Remove funds from an account (balance must be sufficient)</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Transfer</h3>
              <p>Send funds between two different accounts</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
