import { apiSlice } from "./apiSlice";
import type {
  DegreePlan,
  CreateDegreePlanInput,
  UpdateDegreePlanInput,
} from "../types";

export const degreePlanApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/degree-plans - Get all degree plans (Admin/Advisor only)
    getAllDegreePlans: builder.query<DegreePlan[], void>({
      query: () => "/degree-plans",
      transformResponse: (response: { success: boolean; data: DegreePlan[] }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "DegreePlan" as const, id })),
              { type: "DegreePlan", id: "LIST" },
            ]
          : [{ type: "DegreePlan", id: "LIST" }],
    }),

    // GET /api/degree-plans/me - Get my degree plan
    getMyDegreePlan: builder.query<DegreePlan, void>({
      query: () => "/degree-plans/me",
      transformResponse: (response: { success: boolean; data: DegreePlan }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              { type: "DegreePlan", id: result.id },
              { type: "Semester", id: "LIST" },
              { type: "PlannedCourse", id: "LIST" },
            ]
          : [],
    }),

    // GET /api/degree-plans/user/:userId - Get degree plan by user ID
    getDegreePlanByUserId: builder.query<DegreePlan, string>({
      query: (userId) => `/degree-plans/user/${userId}`,
      transformResponse: (response: { success: boolean; data: DegreePlan }) =>
        response.data,
      providesTags: (result) =>
        result ? [{ type: "DegreePlan", id: result.id }] : [],
    }),

    // GET /api/degree-plans/:id - Get degree plan by ID
    getDegreePlanById: builder.query<DegreePlan, string>({
      query: (id) => `/degree-plans/${id}`,
      transformResponse: (response: { success: boolean; data: DegreePlan }) =>
        response.data,
      providesTags: (_, __, id) => [{ type: "DegreePlan", id }],
    }),

    // POST /api/degree-plans - Create degree plan
    createDegreePlan: builder.mutation<DegreePlan, CreateDegreePlanInput>({
      query: (data) => ({
        url: "/degree-plans",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "DegreePlan", id: "LIST" }],
    }),

    // PUT /api/degree-plans/:id - Update degree plan
    updateDegreePlan: builder.mutation<
      DegreePlan,
      { id: string; data: UpdateDegreePlanInput }
    >({
      query: ({ id, data }) => ({
        url: `/degree-plans/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "DegreePlan", id },
        { type: "DegreePlan", id: "LIST" },
      ],
    }),

    // DELETE /api/degree-plans/:id - Delete degree plan
    deleteDegreePlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/degree-plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "DegreePlan", id },
        { type: "DegreePlan", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllDegreePlansQuery,
  useLazyGetAllDegreePlansQuery,
  useGetMyDegreePlanQuery,
  useLazyGetMyDegreePlanQuery,
  useGetDegreePlanByUserIdQuery,
  useLazyGetDegreePlanByUserIdQuery,
  useGetDegreePlanByIdQuery,
  useLazyGetDegreePlanByIdQuery,
  useCreateDegreePlanMutation,
  useUpdateDegreePlanMutation,
  useDeleteDegreePlanMutation,
} = degreePlanApi;
