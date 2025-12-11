import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { logout as logoutAction } from "@/store";
import { withToast } from "@/utils/toastHelpers";

/**
 * Custom hook that provides a reusable logout handler with toast notifications
 *
 * @returns Object containing logout handler function and loading state
 *
 * @example
 * const { handleLogout, isLoggingOut } = useLogoutHandler();
 *
 * <Button onClick={handleLogout} disabled={isLoggingOut}>
 *   Logout
 * </Button>
 */
export function useLogoutHandler() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Use withToast to handle loading/success/error states
      await withToast(logoutMutation().unwrap(), {
        loading: "Logging out...",
        success: "Logged out successfully",
        error: "Logout failed",
      });

      // Clear local state
      dispatch(logoutAction());

      // Navigate to home page and replace history to prevent back navigation
      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);

      // Still clear local state even if API call fails
      dispatch(logoutAction());
      navigate("/home", { replace: true });
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
}
