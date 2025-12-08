import { useEffect } from 'react';
import { toast } from 'sonner';

interface UseMutationToastOptions {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: any;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Custom hook to show toast notifications for RTK Query mutations
 *
 * @example
 * const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
 * useMutationToast({
 *   isLoading,
 *   isSuccess,
 *   isError,
 *   error,
 *   loadingMessage: 'Logging in...',
 *   successMessage: 'Login successful!',
 * });
 */
export function useMutationToast({
  isLoading,
  isSuccess,
  isError,
  error,
  loadingMessage = 'Processing...',
  successMessage = 'Action completed successfully!',
  errorMessage,
}: UseMutationToastOptions) {
  useEffect(() => {
    let toastId: string | number | undefined;

    if (isLoading) {
      toastId = toast.loading(loadingMessage);
    }

    if (isSuccess && toastId) {
      toast.success(successMessage, { id: toastId });
    }

    if (isError) {
      const message = errorMessage || error?.data?.message || error?.message || 'An error occurred';
      if (toastId) {
        toast.error(message, { id: toastId });
      } else {
        toast.error(message);
      }
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [isLoading, isSuccess, isError, error, loadingMessage, successMessage, errorMessage]);
}
