import { FC, useState } from "react";
import { Button, Input, Card } from "../atoms";

interface TransactionFormProps {
  type: "deposit" | "withdraw" | "transfer";
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
  accountId?: string;
}

export const TransactionForm: FC<TransactionFormProps> = ({
  type,
  onSubmit,
  isLoading,
  accountId: defaultAccountId,
}) => {
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState(defaultAccountId || "");
  const [toAccountId, setToAccountId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (type !== "transfer" && !accountId) {
      setError("Account ID is required");
      return;
    }

    if (type === "transfer" && (!accountId || !toAccountId)) {
      setError("From and To account IDs are required");
      return;
    }

    if (type === "transfer" && accountId === toAccountId) {
      setError("Cannot transfer to the same account");
      return;
    }

    try {
      const payload: Record<string, unknown> = {
        type,
        amount: Number(amount),
      };

      if (type === "transfer") {
        payload.fromAccountId = accountId;
        payload.toAccountId = toAccountId;
      } else {
        payload.accountId = accountId;
      }

      await onSubmit(payload);
      setAmount("");
      if (!defaultAccountId) setAccountId("");
      setToAccountId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  const title = {
    deposit: "Deposit",
    withdraw: "Withdraw",
    transfer: "Transfer",
  }[type];

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <form onSubmit={handleSubmit}>
        {type !== "transfer" && (
          <Input
            label="Account ID"
            type="text"
            placeholder="Account ID"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            disabled={isLoading || !!defaultAccountId}
          />
        )}
        {type === "transfer" && (
          <>
            <Input
              label="From Account ID"
              type="text"
              placeholder="From Account ID"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              disabled={isLoading}
            />
            <Input
              label="To Account ID"
              type="text"
              placeholder="To Account ID"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              disabled={isLoading}
            />
          </>
        )}
        <Input
          label="Amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : title}
        </Button>
      </form>
    </Card>
  );
};
