import { Router } from "express";
import { asyncHandler } from "../../core/utils/asyncHandler";
import { AccountController } from "./account.controller";
import { AccountRepository } from "./account.repository";
import { AccountService } from "./account.service";

const accountRepository = new AccountRepository();
const accountService = new AccountService(accountRepository);
const accountController = new AccountController(accountService);

const accountRouter = Router();

accountRouter.post("/", asyncHandler(accountController.createAccount));
accountRouter.get(
  "/:accountId",
  asyncHandler(accountController.getAccountById),
);

export { accountRouter };
