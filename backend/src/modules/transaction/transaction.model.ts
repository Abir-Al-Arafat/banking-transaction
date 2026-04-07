import { HydratedDocument, model, Schema } from "mongoose";

export interface Transaction {
  type: "deposit" | "withdraw" | "transfer";
  amount: number;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  status: "success" | "failed";
  failureReason?: string;
}

const transactionSchema = new Schema<Transaction>(
  {
    type: {
      type: String,
      enum: ["deposit", "withdraw", "transfer"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    accountId: {
      type: String,
      trim: true,
    },
    fromAccountId: {
      type: String,
      trim: true,
    },
    toAccountId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
      default: "success",
    },
    failureReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export type TransactionDocument = HydratedDocument<Transaction>;

export const TransactionModel = model<Transaction>(
  "Transaction",
  transactionSchema,
);
