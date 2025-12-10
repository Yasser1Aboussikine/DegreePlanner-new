import { apiSlice } from "./apiSlice";
import type {
  User,
  SignupInput,
  LoginInput,
  RefreshTokenInput,
  AuthResponse,
  RefreshResponse,
} from "../types";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/auth/signup
    signup: builder.mutation<AuthResponse, SignupInput>({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // POST /api/auth/login
    login: builder.mutation<AuthResponse, LoginInput>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // POST /api/auth/refresh
    refresh: builder.mutation<RefreshResponse, RefreshTokenInput>({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
    }),

    // POST /api/auth/logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // GET /api/auth/me
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
      extraOptions: { maxRetries: 0 },
    }),

    // GET /api/auth/users/role/:role
    getUsersByRole: builder.query<{ data: User[] }, string>({
      query: (role) => `/auth/users/role/${role}`,
      providesTags: (_result, _error, role) => [{ type: "User", id: role }],
    }),

    // GET /api/auth/users
    getAllUsers: builder.query<
      {
        data: {
          users: User[];
          total: number;
          page: number;
          totalPages: number;
        };
      },
      { role?: string; search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.role) searchParams.append("role", params.role);
        if (params?.search) searchParams.append("search", params.search);
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit)
          searchParams.append("limit", params.limit.toString());
        return `/auth/users?${searchParams.toString()}`;
      },
      providesTags: ["User"],
    }),

    // PATCH /api/auth/users/:userId/role
    updateUserRole: builder.mutation<
      { data: User },
      { userId: string; role: string }
    >({
      query: ({ userId, role }) => ({
        url: `/auth/users/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    // PATCH /api/auth/users/:userId/status
    toggleUserStatus: builder.mutation<{ data: User }, string>({
      query: (userId) => ({
        url: `/auth/users/${userId}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),

    // GET /api/auth/users/:userId
    getUserById: builder.query<{ data: User }, string>({
      query: (userId) => `/auth/users/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: "User", id: userId }],
    }),

    // PATCH /api/auth/profile
    updatePersonalInfo: builder.mutation<
      { data: User },
      { name?: string; email?: string; minor?: string | null }
    >({
      query: (data) => ({
        url: `/auth/profile`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // PATCH /api/auth/users/:userId/classification
    updateUserClassification: builder.mutation<
      { data: User },
      { userId: string; classification: string }
    >({
      query: ({ userId, classification }) => ({
        url: `/auth/users/${userId}/classification`,
        method: "PATCH",
        body: { classification },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetUsersByRoleQuery,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserStatusMutation,
  useGetUserByIdQuery,
  useUpdatePersonalInfoMutation,
  useUpdateUserClassificationMutation,
} = authApi;
