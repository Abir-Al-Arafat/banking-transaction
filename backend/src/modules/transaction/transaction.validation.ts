import { body } from "express-validator";

export class TransactionValidation {
  static createTransaction = [
    body("type")
      .exists({ values: "falsy" })
      .withMessage("type is required")
      .isIn(["deposit", "withdraw", "transfer"])
      .withMessage("type must be one of: deposit, withdraw, transfer"),

    body("amount")
      .exists({ values: "falsy" })
      .withMessage("amount is required")
      .isFloat({ gt: 0 })
      .withMessage("amount must be greater than 0")
      .toFloat(),

    body("accountId")
      .if(body("type").isIn(["deposit", "withdraw"]))
      .exists({ values: "falsy" })
      .withMessage("accountId is required for deposit/withdraw")
      .isString()
      .withMessage("accountId must be a string")
      .trim()
      .notEmpty()
      .withMessage("accountId cannot be empty"),

    body("fromAccountId")
      .if(body("type").equals("transfer"))
      .exists({ values: "falsy" })
      .withMessage("fromAccountId is required for transfer")
      .isString()
      .withMessage("fromAccountId must be a string")
      .trim()
      .notEmpty()
      .withMessage("fromAccountId cannot be empty"),

    body("toAccountId")
      .if(body("type").equals("transfer"))
      .exists({ values: "falsy" })
      .withMessage("toAccountId is required for transfer")
      .isString()
      .withMessage("toAccountId must be a string")
      .trim()
      .notEmpty()
      .withMessage("toAccountId cannot be empty")
      .custom((value, { req }) => value !== req.body.fromAccountId)
      .withMessage("toAccountId must be different from fromAccountId"),
  ];
}
