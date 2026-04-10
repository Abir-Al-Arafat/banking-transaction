import { ClientSession } from "mongoose";
import { BaseRepository } from "../../repositories/base.repository";
import { Account, AccountModel } from "./account.model";

export class AccountRepository extends BaseRepository<Account> {
  constructor() {
    super(AccountModel);
  }

  findByAccountId(accountId: string, session?: ClientSession) {
    const query = this.model.findOne({ accountId });
    if (session) {
      query.session(session);
    }

    return query;
  }

  updateByAccountIdAndVersion(
    accountId: string,
    version: number,
    nextBalance: number,
    session?: ClientSession,
  ) {
    const query = this.model.findOneAndUpdate(
      { accountId, version },
      {
        $set: {
          balance: nextBalance,
        },
        $inc: {
          version: 1,
        },
      },
      { returnDocument: "after" },
    );

    if (session) {
      query.session(session);
    }

    return query;
  }
}
