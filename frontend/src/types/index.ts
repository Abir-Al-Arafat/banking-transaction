export type TransactionType = "deposit" | "withdraw" | "transfer";
export type TransactionStatus = "success" | "failed";

export interface Account {
  _id?: string;
  accountId: string;
  holderName: string;
  balance: number;
  version: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Transaction {
  _id?: string;
  type: TransactionType;
  amount: number;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  status: TransactionStatus;
  failureReason?: string;
  createdAt?: Date;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
