import { apiSlice } from './apiSlice';
import type { DegreePlan, CreateDegreePlanInput, UpdateDegreePlanInput } from '../types';

export const degreePlanApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/degree-plan - Get all degree plans (Admin/Advisor only)
    getAllDegreePlans: builder.query<DegreePlan[], void>({
      query: () => '/degree-plan',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'DegreePlan' as const, id })),
              { type: 'DegreePlan', id: 'LIST' },
            ]
          : [{ type: 'DegreePlan', id: 'LIST' }],
    }),

    // GET /api/degree-plan/me - Get my degree plan
    getMyDegreePlan: builder.query<DegreePlan, void>({
      query: () => '/degree-plan/me',
      providesTags: (result) =>
        result ? [{ type: 'DegreePlan', id: result.id }] : [],
    }),

    // GET /api/degree-plan/user/:userId - Get degree plan by user ID
    getDegreePlanByUserId: builder.query<DegreePlan, string>({
      query: (userId) => `/degree-plan/user/${userId}`,
      providesTags: (result) =>
        result ? [{ type: 'DegreePlan', id: result.id }] : [],
    }),

    // GET /api/degree-plan/:id - Get degree plan by ID
    getDegreePlanById: builder.query<DegreePlan, string>({
      query: (id) => `/degree-plan/${id}`,
      providesTags: (_, __, id) => [{ type: 'DegreePlan', id }],
    }),

    // POST /api/degree-plan - Create degree plan
    createDegreePlan: builder.mutation<DegreePlan, CreateDegreePlanInput>({
      query: (data) => ({
        url: '/degree-plan',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'DegreePlan', id: 'LIST' }],
    }),

    // PUT /api/degree-plan/:id - Update degree plan
    updateDegreePlan: builder.mutation<DegreePlan, { id: string; data: UpdateDegreePlanInput }>({
      query: ({ id, data }) => ({
        url: `/degree-plan/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'DegreePlan', id },
        { type: 'DegreePlan', id: 'LIST' },
      ],
    }),

    // DELETE /api/degree-plan/:id - Delete degree plan
    deleteDegreePlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/degree-plan/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'DegreePlan', id },
        { type: 'DegreePlan', id: 'LIST' },
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
