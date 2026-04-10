import { FC, useState } from "react";
import { Button, Input, Card } from "../atoms";

interface AccountFormProps {
  onSubmit: (data: {
    accountId: string;
    holderName: string;
    initialBalance: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const AccountForm: FC<AccountFormProps> = ({ onSubmit, isLoading }) => {
  const [accountId, setAccountId] = useState("");
  const [holderName, setHolderName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!accountId.trim() || !holderName.trim() || !initialBalance) {
      setError("All fields are required");
      return;
    }

    if (Number(initialBalance) < 0) {
      setError("Balance cannot be negative");
      return;
    }

    try {
      await onSubmit({
        accountId: accountId.trim(),
        holderName: holderName.trim(),
        initialBalance: Number(initialBalance),
      });
      setAccountId("");
      setHolderName("");
      setInitialBalance("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Account ID"
          type="text"
          placeholder="e.g., ACC-001"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          disabled={isLoading}
        />
        <Input
          label="Holder Name"
          type="text"
          placeholder="e.g., John Doe"
          value={holderName}
          onChange={(e) => setHolderName(e.target.value)}
          disabled={isLoading}
        />
        <Input
          label="Initial Balance"
          type="number"
          placeholder="0.00"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Account"}
        </Button>
      </form>
    </Card>
  );
};
