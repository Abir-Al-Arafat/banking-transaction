export type TransactionType = "deposit" | "withdraw" | "transfer";

export interface TransactionRequest {
  type: TransactionType;
  amount: number;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
}
