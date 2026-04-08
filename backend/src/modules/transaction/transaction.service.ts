import mongoose from "mongoose";
import { AppError } from "../../core/errors/AppError";
import { AccountDocument } from "../account/account.model";
import { AccountRepository } from "../account/account.repository";
import { TransactionRequest } from "./transaction.types";
import { TransactionDocument } from "./transaction.model";
import { TransactionRepository } from "./transaction.repository";
import { SocketService } from "../../realtime/socket.service";

export class TransactionService {
  private static readonly MAX_RETRIES = 5;

  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly socketService: SocketService,
  ) {}

  async createTransaction(
    payload: TransactionRequest,
  ): Promise<TransactionDocument> {
    try {
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
    } catch (error) {
      const failedPayload: {
        reason: string;
        type?: "deposit" | "withdraw" | "transfer";
        amount?: number;
        accountId?: string;
        fromAccountId?: string;
        toAccountId?: string;
      } = {
        reason: this.getErrorMessage(error),
      };

      if (payload.type) {
        failedPayload.type = payload.type;
      }

      if (typeof payload.amount !== "undefined") {
        failedPayload.amount = payload.amount;
      }

      if (payload.accountId) {
        failedPayload.accountId = payload.accountId;
      }

      if (payload.fromAccountId) {
        failedPayload.fromAccountId = payload.fromAccountId;
      }

      if (payload.toAccountId) {
        failedPayload.toAccountId = payload.toAccountId;
      }

      this.socketService.emitTransactionFailed(failedPayload);

      throw error;
    }
  }

  private async handleSingleAccountTransaction(
    payload: TransactionRequest,
    action: "deposit" | "withdraw",
  ): Promise<TransactionDocument> {
    if (!payload.accountId) {
      throw new AppError("accountId is required for deposit/withdraw", 400);
    }

    const accountId = payload.accountId;

    const session = await mongoose.startSession();
    try {
      let createdTransaction: TransactionDocument | null = null;
      let updatedAccount: AccountDocument | null = null;

      await session.withTransaction(async () => {
        updatedAccount = await this.updateBalanceWithRetry(
          accountId,
          action,
          payload.amount,
          session,
        );

        createdTransaction = await this.transactionRepository.create(
          {
            type: action,
            amount: payload.amount,
            accountId,
            status: "success",
          },
          session,
        );
      });

      if (!createdTransaction) {
        throw new AppError("Failed to create transaction", 500);
      }

      const transactionForEvent = createdTransaction as unknown as {
        _id: unknown;
        type: "deposit" | "withdraw" | "transfer";
        amount: number;
        accountId?: string;
        status: "success" | "failed";
        createdAt?: Date;
      };

      const transactionCreatedPayload: {
        transactionId: string;
        type: "deposit" | "withdraw" | "transfer";
        amount: number;
        status: "success" | "failed";
        accountId?: string;
        createdAt?: Date;
      } = {
        transactionId: String(transactionForEvent._id),
        type: transactionForEvent.type,
        amount: transactionForEvent.amount,
        status: transactionForEvent.status,
      };

      if (transactionForEvent.accountId) {
        transactionCreatedPayload.accountId = transactionForEvent.accountId;
      }

      if (transactionForEvent.createdAt) {
        transactionCreatedPayload.createdAt = transactionForEvent.createdAt;
      }

      this.socketService.emitTransactionCreated(transactionCreatedPayload);

      if (updatedAccount) {
        const accountForEvent = updatedAccount as unknown as {
          accountId: string;
          balance: number;
          version: number;
        };

        this.socketService.emitBalanceUpdated({
          accountId: accountForEvent.accountId,
          balance: accountForEvent.balance,
          version: accountForEvent.version,
        });
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
      let fromUpdated: AccountDocument | null = null;
      let toUpdated: AccountDocument | null = null;

      await session.withTransaction(async () => {
        fromUpdated = await this.updateBalanceWithRetry(
          fromAccountId,
          "withdraw",
          payload.amount,
          session,
        );

        toUpdated = await this.updateBalanceWithRetry(
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

      const transferForEvent = createdTransaction as unknown as {
        _id: unknown;
        type: "transfer";
        amount: number;
        fromAccountId?: string;
        toAccountId?: string;
        status: "success" | "failed";
        createdAt?: Date;
      };

      const transferCreatedPayload: {
        transactionId: string;
        type: "deposit" | "withdraw" | "transfer";
        amount: number;
        status: "success" | "failed";
        fromAccountId?: string;
        toAccountId?: string;
        createdAt?: Date;
      } = {
        transactionId: String(transferForEvent._id),
        type: transferForEvent.type,
        amount: transferForEvent.amount,
        status: transferForEvent.status,
      };

      if (transferForEvent.fromAccountId) {
        transferCreatedPayload.fromAccountId = transferForEvent.fromAccountId;
      }

      if (transferForEvent.toAccountId) {
        transferCreatedPayload.toAccountId = transferForEvent.toAccountId;
      }

      if (transferForEvent.createdAt) {
        transferCreatedPayload.createdAt = transferForEvent.createdAt;
      }

      this.socketService.emitTransactionCreated(transferCreatedPayload);

      if (fromUpdated) {
        const fromAccountEvent = fromUpdated as unknown as {
          accountId: string;
          balance: number;
          version: number;
        };

        this.socketService.emitBalanceUpdated({
          accountId: fromAccountEvent.accountId,
          balance: fromAccountEvent.balance,
          version: fromAccountEvent.version,
        });
      }

      if (toUpdated) {
        const toAccountEvent = toUpdated as unknown as {
          accountId: string;
          balance: number;
          version: number;
        };

        this.socketService.emitBalanceUpdated({
          accountId: toAccountEvent.accountId,
          balance: toAccountEvent.balance,
          version: toAccountEvent.version,
        });
      }

      return createdTransaction;
    } finally {
      await session.endSession();
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return "Unknown transaction error";
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
