import { Router } from "express";
import { asyncHandler } from "../../core/utils/asyncHandler";
import { validateRequestMiddleware } from "../../middlewares/validateRequest.middleware";
import { socketService } from "../../realtime/socket.service";
import { AccountRepository } from "../account/account.repository";
import { TransactionController } from "./transaction.controller";
import { TransactionRepository } from "./transaction.repository";
import { TransactionService } from "./transaction.service";
import { TransactionValidation } from "./transaction.validation";

const accountRepository = new AccountRepository();
const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(
  accountRepository,
  transactionRepository,
  socketService,
);
const transactionController = new TransactionController(transactionService);

const transactionRouter = Router();

transactionRouter.post(
  "/",
  TransactionValidation.createTransaction,
  validateRequestMiddleware,
  asyncHandler(transactionController.createTransaction),
);

export { transactionRouter };
