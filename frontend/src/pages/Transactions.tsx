import { FC } from "react";
import { Card } from "../components/atoms";
import { TransactionForm } from "../components/molecules";
import { useTransactions } from "../hooks";
import { TransactionType } from "../types";

function toTransactionPayload(payload: Record<string, unknown>) {
  const type = payload.type as TransactionType;
  const amount = Number(payload.amount);

  return {
    type,
    amount,
    accountId: payload.accountId as string | undefined,
    fromAccountId: payload.fromAccountId as string | undefined,
    toAccountId: payload.toAccountId as string | undefined,
  };
}

export const TransactionsPage: FC = () => {
  const {
    recentTransactions,
    isLoading,
    error,
    statusMessage,
    submitTransaction,
    clearError,
  } = useTransactions();

  const handleTransaction = async (payload: Record<string, unknown>) => {
    await submitTransaction(toTransactionPayload(payload));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {error && (
        <div className="lg:col-span-3">
          <Card className="border border-red-200 bg-red-50">
            <p className="text-sm text-red-700">{error}</p>
            <button
              className="mt-2 text-xs font-semibold text-red-700 underline"
              onClick={clearError}
            >
              Dismiss
            </button>
          </Card>
        </div>
      )}

      {!error && statusMessage && (
        <div className="lg:col-span-3">
          <Card className="border border-green-200 bg-green-50">
            <p className="text-sm text-green-700">{statusMessage}</p>
          </Card>
        </div>
      )}

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

      <div className="lg:col-span-3">
        <Card>
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-500">No transactions yet.</p>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((item, index) => (
                <div
                  key={`${item._id || item.type}-${index}`}
                  className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm"
                >
                  <span className="font-medium capitalize">{item.type}</span>
                  <span>${item.amount.toFixed(2)}</span>
                  <span className="text-gray-500">
                    {item.accountId ||
                      `${item.fromAccountId} -> ${item.toAccountId}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
