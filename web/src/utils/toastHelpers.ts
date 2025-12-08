import { toast } from 'sonner';

/**
 * Toast helper utilities for common patterns in the application
 */

export const toastHelpers = {
  // Auth-related toasts
  auth: {
    loginSuccess: () => toast.success('Login successful!'),
    loginError: (message?: string) => toast.error(message || 'Login failed. Please check your credentials.'),
    logoutSuccess: () => toast.success('Logged out successfully'),
    signupSuccess: () => toast.success('Account created successfully!'),
    signupError: (message?: string) => toast.error(message || 'Failed to create account'),
  },

  // Course-related toasts
  course: {
    created: () => toast.success('Course created successfully!'),
    updated: () => toast.success('Course updated successfully!'),
    deleted: () => toast.success('Course deleted successfully!'),
    prerequisiteAdded: () => toast.success('Prerequisite added successfully!'),
    prerequisiteRemoved: () => toast.success('Prerequisite removed successfully!'),
    error: (message?: string) => toast.error(message || 'Course operation failed'),
  },

  // Degree Plan-related toasts
  degreePlan: {
    created: () => toast.success('Degree plan created successfully!'),
    updated: () => toast.success('Degree plan updated successfully!'),
    deleted: () => toast.success('Degree plan deleted successfully!'),
    error: (message?: string) => toast.error(message || 'Degree plan operation failed'),
  },

  // Semester-related toasts
  semester: {
    created: () => toast.success('Semester created successfully!'),
    updated: () => toast.success('Semester updated successfully!'),
    deleted: () => toast.success('Semester deleted successfully!'),
    error: (message?: string) => toast.error(message || 'Semester operation failed'),
  },

  // Planned Course-related toasts
  plannedCourse: {
    created: () => toast.success('Course added to plan successfully!'),
    updated: () => toast.success('Planned course updated successfully!'),
    deleted: () => toast.success('Course removed from plan successfully!'),
    error: (message?: string) => toast.error(message || 'Planned course operation failed'),
  },

  // Generic toasts
  generic: {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
    info: (message: string) => toast.info(message),
    warning: (message: string) => toast.warning(message),
  },
};

/**
 * Wrapper function for handling async operations with loading, success, and error toasts
 *
 * @example
 * await withToast(
 *   async () => await createCourse({ name: 'CS101' }).unwrap(),
 *   {
 *     loading: 'Creating course...',
 *     success: 'Course created successfully!',
 *     error: 'Failed to create course',
 *   }
 * );
 */
export async function withToast<T>(
  promise: Promise<T>,
  messages: {
    loading?: string;
    success?: string;
    error?: string;
  }
): Promise<T> {
  const toastId = messages.loading ? toast.loading(messages.loading) : undefined;

  try {
    const result = await promise;

    if (toastId && messages.success) {
      toast.success(messages.success, { id: toastId });
    } else if (messages.success) {
      toast.success(messages.success);
    }

    return result;
  } catch (error: any) {
    const errorMessage = messages.error || error?.data?.message || error?.message || 'An error occurred';

    if (toastId) {
      toast.error(errorMessage, { id: toastId });
    } else {
      toast.error(errorMessage);
    }

    throw error;
  }
}

/**
 * Extract error message from RTK Query error object
 */
export function getErrorMessage(error: any, fallback = 'An error occurred'): string {
  return error?.data?.message || error?.message || fallback;
}
