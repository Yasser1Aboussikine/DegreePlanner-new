import { apiSlice } from "./apiSlice";

export interface RequestPasswordResetInput {
  emailOrUsername: string;
}

export interface VerifyResetTokenInput {
  token: string;
}

export interface VerifyResetTokenResponse {
  data: {
    isValid: boolean;
    userId?: string;
  };
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export const passwordResetApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestPasswordReset: builder.mutation<void, RequestPasswordResetInput>({
      query: (body) => ({
        url: "/password-reset/request",
        method: "POST",
        body,
      }),
    }),

    verifyResetToken: builder.mutation<VerifyResetTokenResponse, VerifyResetTokenInput>({
      query: (body) => ({
        url: "/password-reset/verify",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<void, ResetPasswordInput>({
      query: (body) => ({
        url: "/password-reset/reset",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRequestPasswordResetMutation,
  useVerifyResetTokenMutation,
  useResetPasswordMutation,
} = passwordResetApi;
