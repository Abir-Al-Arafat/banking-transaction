import { FC, useState } from "react";
import { Card } from "../components/atoms";
import { AccountForm } from "../components/molecules";
import { AccountCard } from "../components/organisms";
import { accountService } from "../services";

export const AccountsPage: FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccountDetails, setSelectedAccountDetails] =
    useState<any>(null);

  const handleCreateAccount = async (data: {
    accountId: string;
    holderName: string;
    initialBalance: number;
  }) => {
    setIsLoading(true);
    try {
      const newAccount = await accountService.create(
        data.accountId,
        data.holderName,
        data.initialBalance,
      );
      setAccounts((prev) => [...prev, newAccount]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (accountId: string) => {
    try {
      const account = await accountService.getById(accountId);
      setSelectedAccountDetails(account);
    } catch (error) {
      console.error("Failed to fetch account details");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <AccountCard
                key={account.accountId}
                account={account}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
          {accounts.length === 0 && (
            <Card>
              <p className="text-gray-500">No accounts created yet</p>
            </Card>
          )}
        </div>
      </div>

      <div>
        <AccountForm onSubmit={handleCreateAccount} isLoading={isLoading} />
        {selectedAccountDetails && (
          <Card className="mt-6">
            <h3 className="text-lg font-bold mb-4">Account Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">ID:</span>{" "}
                {selectedAccountDetails.accountId}
              </p>
              <p>
                <span className="font-semibold">Holder:</span>{" "}
                {selectedAccountDetails.holderName}
              </p>
              <p>
                <span className="font-semibold">Balance:</span> $
                {selectedAccountDetails.balance.toFixed(2)}
              </p>
              <p>
                <span className="font-semibold">Version:</span>{" "}
                {selectedAccountDetails.version}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
