import { Account } from "../types";
import { API_BASE, requestJson } from "./http";

export const accountService = {
  create: async (
    accountId: string,
    holderName: string,
    initialBalance: number,
  ): Promise<Account> => {
    const data = await requestJson<Account>(`${API_BASE}/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId, holderName, initialBalance }),
    });

    if (!data.data) throw new Error(data.message);
    return data.data;
  },

  getById: async (accountId: string): Promise<Account> => {
    const data = await requestJson<Account>(
      `${API_BASE}/accounts/${accountId}`,
    );

    if (!data.data) throw new Error(data.message);
    return data.data;
  },
};
