import { useCallback, useState } from "react";

interface UseApiRequestState<TData> {
  data: TData | null;
  isLoading: boolean;
  error: string | null;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function useApiRequest<TArgs extends unknown[], TResult>(
  requestFn: (...args: TArgs) => Promise<TResult>,
) {
  const [state, setState] = useState<UseApiRequestState<TResult>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await requestFn(...args);
        setState({ data: result, isLoading: false, error: null });
        return result;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: toErrorMessage(error),
        }));
        return null;
      }
    },
    [requestFn],
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    execute,
    clearError,
  };
}
