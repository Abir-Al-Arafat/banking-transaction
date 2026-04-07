import { AppError } from "../../core/errors/AppError";
import { AccountInput } from "./account.types";
import { AccountRepository } from "./account.repository";
import { AccountDocument } from "./account.model";

export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async createAccount(payload: AccountInput): Promise<AccountDocument> {
    const existing = await this.accountRepository.findByAccountId(
      payload.accountId,
    );
    if (existing) {
      throw new AppError("Account already exists", 409);
    }

    const balance = payload.initialBalance ?? 0;
    if (balance < 0) {
      throw new AppError("Initial balance cannot be negative", 400);
    }

    return this.accountRepository.create({
      accountId: payload.accountId,
      holderName: payload.holderName,
      balance,
    });
  }

  async getAccountById(accountId: string): Promise<AccountDocument> {
    const account = await this.accountRepository.findByAccountId(accountId);
    if (!account) {
      throw new AppError("Account not found", 404);
    }

    return account;
  }
}
