import { param, body } from "express-validator";

export class AccountValidation {
  static createAccount = [
    body("accountId")
      .exists({ values: "falsy" })
      .withMessage("accountId is required")
      .isString()
      .withMessage("accountId must be a string")
      .trim()
      .notEmpty()
      .withMessage("accountId cannot be empty"),

    body("holderName")
      .exists({ values: "falsy" })
      .withMessage("holderName is required")
      .isString()
      .withMessage("holderName must be a string")
      .trim()
      .notEmpty()
      .withMessage("holderName cannot be empty"),

    body("initialBalance")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("initialBalance must be a number greater than or equal to 0")
      .toFloat(),
  ];

  static getAccountById = [
    param("accountId")
      .exists({ values: "falsy" })
      .withMessage("accountId is required")
      .isString()
      .withMessage("accountId must be a string")
      .trim()
      .notEmpty()
      .withMessage("accountId cannot be empty"),
  ];
}
