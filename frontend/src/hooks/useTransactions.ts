import { useMemo, useState } from "react";
import { transactionService } from "../services";
import { Transaction, TransactionType } from "../types";
import { useApiRequest } from "./useApiRequest";

interface TransactionPayload {
  type: TransactionType;
  amount: number;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
}

export function useTransactions() {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );

  const createTransactionRequest = useApiRequest(transactionService.create);

  const submitTransaction = async (
    payload: TransactionPayload,
  ): Promise<void> => {
    const transaction = await createTransactionRequest.execute(payload);

    if (!transaction) {
      throw new Error(
        createTransactionRequest.error || "Failed to process transaction",
      );
    }

    setRecentTransactions((prev) => [transaction, ...prev].slice(0, 8));
  };

  const error = createTransactionRequest.error;
  const isLoading = createTransactionRequest.isLoading;

  const statusMessage = useMemo(() => {
    if (!createTransactionRequest.data) return "";

    const typeLabel = createTransactionRequest.data.type;
    return `${typeLabel[0].toUpperCase()}${typeLabel.slice(1)} transaction completed.`;
  }, [createTransactionRequest.data]);

  return {
    recentTransactions,
    isLoading,
    error,
    statusMessage,
    submitTransaction,
    clearError: createTransactionRequest.clearError,
  };
}
