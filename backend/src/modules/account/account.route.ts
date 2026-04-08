import { Router } from "express";
import { asyncHandler } from "../../core/utils/asyncHandler";
import { validateRequestMiddleware } from "../../middlewares/validateRequest.middleware";
import { AccountController } from "./account.controller";
import { AccountRepository } from "./account.repository";
import { AccountService } from "./account.service";
import { AccountValidation } from "./account.validation";

const accountRepository = new AccountRepository();
const accountService = new AccountService(accountRepository);
const accountController = new AccountController(accountService);

const accountRouter = Router();

accountRouter.post(
  "/",
  AccountValidation.createAccount,
  validateRequestMiddleware,
  asyncHandler(accountController.createAccount),
);
accountRouter.get(
  "/:accountId",
  AccountValidation.getAccountById,
  validateRequestMiddleware,
  asyncHandler(accountController.getAccountById),
);

export { accountRouter };
