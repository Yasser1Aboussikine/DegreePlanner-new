import { apiSlice } from './apiSlice';
import type { PlanSemester, CreatePlanSemesterInput, UpdatePlanSemesterInput } from '../types';

export const planSemesterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/plan-semester - Get all plan semesters (Admin/Advisor only)
    getAllPlanSemesters: builder.query<PlanSemester[], void>({
      query: () => '/plan-semester',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Semester' as const, id })),
              { type: 'Semester', id: 'LIST' },
            ]
          : [{ type: 'Semester', id: 'LIST' }],
    }),

    // GET /api/plan-semester/degree-plan/:degreePlanId - Get plan semesters by degree plan
    getPlanSemestersByDegreePlanId: builder.query<PlanSemester[], string>({
      query: (degreePlanId) => `/plan-semester/degree-plan/${degreePlanId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Semester' as const, id })),
              { type: 'Semester', id: 'LIST' },
            ]
          : [{ type: 'Semester', id: 'LIST' }],
    }),

    // GET /api/plan-semester/:id - Get plan semester by ID
    getPlanSemesterById: builder.query<PlanSemester, string>({
      query: (id) => `/plan-semester/${id}`,
      providesTags: (_, __, id) => [{ type: 'Semester', id }],
    }),

    // POST /api/plan-semester - Create plan semester
    createPlanSemester: builder.mutation<PlanSemester, CreatePlanSemesterInput>({
      query: (data) => ({
        url: '/plan-semester',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Semester', id: 'LIST' }],
    }),

    // PUT /api/plan-semester/:id - Update plan semester
    updatePlanSemester: builder.mutation<PlanSemester, { id: string; data: UpdatePlanSemesterInput }>({
      query: ({ id, data }) => ({
        url: `/plan-semester/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Semester', id },
        { type: 'Semester', id: 'LIST' },
      ],
    }),

    // DELETE /api/plan-semester/:id - Delete plan semester
    deletePlanSemester: builder.mutation<void, string>({
      query: (id) => ({
        url: `/plan-semester/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Semester', id },
        { type: 'Semester', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllPlanSemestersQuery,
  useLazyGetAllPlanSemestersQuery,
  useGetPlanSemestersByDegreePlanIdQuery,
  useLazyGetPlanSemestersByDegreePlanIdQuery,
  useGetPlanSemesterByIdQuery,
  useLazyGetPlanSemesterByIdQuery,
  useCreatePlanSemesterMutation,
  useUpdatePlanSemesterMutation,
  useDeletePlanSemesterMutation,
} = planSemesterApi;
