import mongoose from "mongoose";
import { AppError } from "../../core/errors/AppError";
import { AccountDocument } from "../account/account.model";
import { AccountRepository } from "../account/account.repository";
import { TransactionRequest } from "./transaction.types";
import { TransactionDocument } from "./transaction.model";
import { TransactionRepository } from "./transaction.repository";

export class TransactionService {
  private static readonly MAX_RETRIES = 5;

  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async createTransaction(
    payload: TransactionRequest,
  ): Promise<TransactionDocument> {
    if (payload.amount <= 0) {
      throw new AppError("Amount must be greater than zero", 400);
    }

    if (payload.type === "transfer") {
      return this.handleTransfer(payload);
    }

    if (payload.type !== "deposit" && payload.type !== "withdraw") {
      throw new AppError("Invalid transaction type", 400);
    }

    return this.handleSingleAccountTransaction(payload, payload.type);
  }

  private async handleSingleAccountTransaction(
    payload: TransactionRequest,
    action: "deposit" | "withdraw",
  ): Promise<TransactionDocument> {
    if (!payload.accountId) {
      throw new AppError("accountId is required for deposit/withdraw", 400);
    }

    const session = await mongoose.startSession();
    try {
      let createdTransaction: TransactionDocument | null = null;

      await session.withTransaction(async () => {
        const account = await this.updateBalanceWithRetry(
          payload.accountId as string,
          action,
          payload.amount,
          session,
        );

        createdTransaction = await this.transactionRepository.create(
          {
            type: action,
            amount: payload.amount,
            accountId: account.accountId,
            status: "success",
          },
          session,
        );
      });

      if (!createdTransaction) {
        throw new AppError("Failed to create transaction", 500);
      }

      return createdTransaction;
    } finally {
      await session.endSession();
    }
  }

  private async handleTransfer(
    payload: TransactionRequest,
  ): Promise<TransactionDocument> {
    if (!payload.fromAccountId || !payload.toAccountId) {
      throw new AppError(
        "fromAccountId and toAccountId are required for transfer",
        400,
      );
    }

    if (payload.fromAccountId === payload.toAccountId) {
      throw new AppError("Transfer must target a different account", 400);
    }

    const fromAccountId = payload.fromAccountId;
    const toAccountId = payload.toAccountId;

    const session = await mongoose.startSession();
    try {
      let createdTransaction: TransactionDocument | null = null;

      await session.withTransaction(async () => {
        await this.updateBalanceWithRetry(
          fromAccountId,
          "withdraw",
          payload.amount,
          session,
        );

        await this.updateBalanceWithRetry(
          toAccountId,
          "deposit",
          payload.amount,
          session,
        );

        createdTransaction = await this.transactionRepository.create(
          {
            type: "transfer",
            amount: payload.amount,
            fromAccountId,
            toAccountId,
            status: "success",
          },
          session,
        );
      });

      if (!createdTransaction) {
        throw new AppError("Failed to create transfer transaction", 500);
      }

      return createdTransaction;
    } finally {
      await session.endSession();
    }
  }

  private async updateBalanceWithRetry(
    accountId: string,
    action: "deposit" | "withdraw",
    amount: number,
    session: mongoose.ClientSession,
  ): Promise<AccountDocument> {
    for (
      let attempt = 0;
      attempt < TransactionService.MAX_RETRIES;
      attempt += 1
    ) {
      const current = await this.accountRepository.findByAccountId(
        accountId,
        session,
      );
      if (!current) {
        throw new AppError(`Account not found: ${accountId}`, 404);
      }

      const nextBalance =
        action === "deposit"
          ? current.balance + amount
          : current.balance - amount;

      if (nextBalance < 0) {
        throw new AppError(
          `Insufficient balance for account ${accountId}`,
          400,
        );
      }

      const updated = await this.accountRepository.updateByAccountIdAndVersion(
        accountId,
        current.version,
        nextBalance,
        session,
      );

      if (updated) {
        return updated;
      }
    }

    throw new AppError(
      "Could not process request due to concurrent update conflict",
      409,
    );
  }
}
