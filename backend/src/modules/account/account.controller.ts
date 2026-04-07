import { Request, Response } from "express";
import { AppError } from "../../core/errors/AppError";
import { ResponseBuilder } from "../../core/utils/apiResponse";
import { AccountService } from "./account.service";

export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  createAccount = async (req: Request, res: Response): Promise<void> => {
    const account = await this.accountService.createAccount(req.body);

    res
      .status(201)
      .json(ResponseBuilder.success("Account created successfully", account));
  };

  getAccountById = async (req: Request, res: Response): Promise<void> => {
    if (!req.params.accountId || Array.isArray(req.params.accountId)) {
      throw new AppError("Invalid accountId parameter", 400);
    }

    const account = await this.accountService.getAccountById(
      req.params.accountId,
    );

    res
      .status(200)
      .json(ResponseBuilder.success("Account fetched successfully", account));
  };
}
