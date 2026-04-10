import { useMemo, useState } from "react";
import { Account } from "../types";
import { accountService } from "../services";
import { useApiRequest } from "./useApiRequest";

interface CreateAccountInput {
  accountId: string;
  holderName: string;
  initialBalance: number;
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const createAccountRequest = useApiRequest(accountService.create);
  const fetchAccountRequest = useApiRequest(accountService.getById);

  const createAccount = async (input: CreateAccountInput): Promise<void> => {
    const created = await createAccountRequest.execute(
      input.accountId,
      input.holderName,
      input.initialBalance,
    );

    if (!created) {
      throw new Error(createAccountRequest.error || "Failed to create account");
    }

    setAccounts((prev) => {
      const exists = prev.some((item) => item.accountId === created.accountId);
      if (exists) return prev;
      return [...prev, created];
    });
  };

  const getAccountDetails = async (accountId: string): Promise<void> => {
    const account = await fetchAccountRequest.execute(accountId);

    if (!account) {
      throw new Error(fetchAccountRequest.error || "Failed to fetch account");
    }

    setSelectedAccount(account);
  };

  const clearErrors = () => {
    createAccountRequest.clearError();
    fetchAccountRequest.clearError();
  };

  const error = createAccountRequest.error || fetchAccountRequest.error;
  const isLoading = createAccountRequest.isLoading;
  const isFetchingDetails = fetchAccountRequest.isLoading;

  const statusMessage = useMemo(() => {
    if (createAccountRequest.data) return "Account created successfully.";
    if (fetchAccountRequest.data) return "Account details loaded.";
    return "";
  }, [createAccountRequest.data, fetchAccountRequest.data]);

  return {
    accounts,
    selectedAccount,
    isLoading,
    isFetchingDetails,
    error,
    statusMessage,
    createAccount,
    getAccountDetails,
    clearErrors,
  };
}
