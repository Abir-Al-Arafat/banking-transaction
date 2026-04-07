import { Request, Response } from "express";
import { ResponseBuilder } from "../../core/utils/apiResponse";
import { TransactionService } from "./transaction.service";

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  createTransaction = async (req: Request, res: Response): Promise<void> => {
    const result = await this.transactionService.createTransaction(req.body);

    res
      .status(201)
      .json(
        ResponseBuilder.success("Transaction processed successfully", result),
      );
  };
}
