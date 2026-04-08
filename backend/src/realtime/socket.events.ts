export const SOCKET_EVENTS = {
  TRANSACTION_CREATED: "transaction:created",
  BALANCE_UPDATED: "balance:updated",
  TRANSACTION_FAILED: "transaction:failed",
} as const;

export interface TransactionCreatedPayload {
  transactionId: string;
  type: "deposit" | "withdraw" | "transfer";
  amount: number;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  status: "success" | "failed";
  createdAt?: Date;
}

export interface BalanceUpdatedPayload {
  accountId: string;
  balance: number;
  version: number;
}

export interface TransactionFailedPayload {
  type?: "deposit" | "withdraw" | "transfer";
  amount?: number;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  reason: string;
}
