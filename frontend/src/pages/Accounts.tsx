import { FC } from "react";
import { Card } from "../components/atoms";
import { AccountForm } from "../components/molecules";
import { AccountCard } from "../components/organisms";
import { useAccounts } from "../hooks";

export const AccountsPage: FC = () => {
  const {
    accounts,
    selectedAccount,
    isLoading,
    isFetchingDetails,
    error,
    statusMessage,
    createAccount,
    getAccountDetails,
    clearErrors,
  } = useAccounts();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Accounts</h2>

          {error && (
            <Card className="mb-4 border border-red-200 bg-red-50">
              <p className="text-sm text-red-700">{error}</p>
              <button
                className="mt-2 text-xs font-semibold text-red-700 underline"
                onClick={clearErrors}
              >
                Dismiss
              </button>
            </Card>
          )}

          {!error && statusMessage && (
            <Card className="mb-4 border border-green-200 bg-green-50">
              <p className="text-sm text-green-700">{statusMessage}</p>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <AccountCard
                key={account.accountId}
                account={account}
                onViewDetails={getAccountDetails}
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
        <AccountForm onSubmit={createAccount} isLoading={isLoading} />

        {isFetchingDetails && (
          <Card className="mt-6">
            <p className="text-sm text-gray-600">Loading account details...</p>
          </Card>
        )}

        {selectedAccount && (
          <Card className="mt-6">
            <h3 className="text-lg font-bold mb-4">Account Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">ID:</span>{" "}
                {selectedAccount.accountId}
              </p>
              <p>
                <span className="font-semibold">Holder:</span>{" "}
                {selectedAccount.holderName}
              </p>
              <p>
                <span className="font-semibold">Balance:</span> $
                {selectedAccount.balance.toFixed(2)}
              </p>
              <p>
                <span className="font-semibold">Version:</span>{" "}
                {selectedAccount.version}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
