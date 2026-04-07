import { BaseRepository } from "../../repositories/base.repository";
import { Transaction, TransactionModel } from "./transaction.model";

export class TransactionRepository extends BaseRepository<Transaction> {
  constructor() {
    super(TransactionModel);
  }
}
