import { Transaction, TransactionType } from "../types";
import { API_BASE, requestJson } from "./http";

interface TransactionPayload {
  type: TransactionType;
  amount: number;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
}

export const transactionService = {
  create: async (payload: TransactionPayload): Promise<Transaction> => {
    const data = await requestJson<Transaction>(`${API_BASE}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!data.data) throw new Error(data.message);
    return data.data;
  },
};
