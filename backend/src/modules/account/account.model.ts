import { HydratedDocument, model, Schema } from "mongoose";

export interface Account {
  accountId: string;
  holderName: string;
  balance: number;
  version: number;
}

const accountSchema = new Schema<Account>(
  {
    accountId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    holderName: {
      type: String,
      required: true,
      trim: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: "version",
  },
);

export type AccountDocument = HydratedDocument<Account>;

export const AccountModel = model<Account>("Account", accountSchema);
