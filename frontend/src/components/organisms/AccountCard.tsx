import { FC } from "react";
import { Card, Badge } from "../atoms";
import { Account } from "../../types";

interface AccountCardProps {
  account: Account;
  onViewDetails?: (accountId: string) => void;
}

export const AccountCard: FC<AccountCardProps> = ({
  account,
  onViewDetails,
}) => {
  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {account.accountId}
          </h3>
          <p className="text-sm text-gray-600">{account.holderName}</p>
        </div>
        <Badge color="green">${account.balance.toFixed(2)}</Badge>
      </div>
      <div className="text-sm text-gray-500 mb-4">
        <p>Version: {account.version}</p>
      </div>
      {onViewDetails && (
        <button
          onClick={() => onViewDetails(account.accountId)}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
        >
          View Details →
        </button>
      )}
    </Card>
  );
};
