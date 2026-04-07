import { Router } from "express";
import { asyncHandler } from "../../core/utils/asyncHandler";
import { AccountRepository } from "../account/account.repository";
import { TransactionController } from "./transaction.controller";
import { TransactionRepository } from "./transaction.repository";
import { TransactionService } from "./transaction.service";

const accountRepository = new AccountRepository();
const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(
  accountRepository,
  transactionRepository,
);
const transactionController = new TransactionController(transactionService);

const transactionRouter = Router();

transactionRouter.post(
  "/",
  asyncHandler(transactionController.createTransaction),
);

export { transactionRouter };
