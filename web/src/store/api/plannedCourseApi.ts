import { apiSlice } from './apiSlice';
import type {
  PlannedCourse,
  PlannedCourseStatus,
  CreatePlannedCourseInput,
  UpdatePlannedCourseInput,
} from '../types';

export const plannedCourseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/planned-course - Get all planned courses (Admin/Advisor only)
    getAllPlannedCourses: builder.query<PlannedCourse[], void>({
      query: () => '/planned-course',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'PlannedCourse' as const, id })),
              { type: 'PlannedCourse', id: 'LIST' },
            ]
          : [{ type: 'PlannedCourse', id: 'LIST' }],
    }),

    // GET /api/planned-course/status/:status - Get planned courses by status (Admin/Advisor only)
    getPlannedCoursesByStatus: builder.query<PlannedCourse[], PlannedCourseStatus>({
      query: (status) => `/planned-course/status/${status}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'PlannedCourse' as const, id })),
              { type: 'PlannedCourse', id: 'LIST' },
            ]
          : [{ type: 'PlannedCourse', id: 'LIST' }],
    }),

    // GET /api/planned-course/semester/:planSemesterId - Get planned courses by semester
    getPlannedCoursesByPlanSemesterId: builder.query<PlannedCourse[], string>({
      query: (planSemesterId) => `/planned-course/semester/${planSemesterId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'PlannedCourse' as const, id })),
              { type: 'PlannedCourse', id: 'LIST' },
            ]
          : [{ type: 'PlannedCourse', id: 'LIST' }],
    }),

    // GET /api/planned-course/:id - Get planned course by ID
    getPlannedCourseById: builder.query<PlannedCourse, string>({
      query: (id) => `/planned-course/${id}`,
      providesTags: (_, __, id) => [{ type: 'PlannedCourse', id }],
    }),

    // POST /api/planned-course - Create planned course
    createPlannedCourse: builder.mutation<PlannedCourse, CreatePlannedCourseInput>({
      query: (data) => ({
        url: '/planned-course',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'PlannedCourse', id: 'LIST' }],
    }),

    // PUT /api/planned-course/:id - Update planned course
    updatePlannedCourse: builder.mutation<PlannedCourse, { id: string; data: UpdatePlannedCourseInput }>({
      query: ({ id, data }) => ({
        url: `/planned-course/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'PlannedCourse', id },
        { type: 'PlannedCourse', id: 'LIST' },
      ],
    }),

    // DELETE /api/planned-course/:id - Delete planned course
    deletePlannedCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/planned-course/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'PlannedCourse', id },
        { type: 'PlannedCourse', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllPlannedCoursesQuery,
  useLazyGetAllPlannedCoursesQuery,
  useGetPlannedCoursesByStatusQuery,
  useLazyGetPlannedCoursesByStatusQuery,
  useGetPlannedCoursesByPlanSemesterIdQuery,
  useLazyGetPlannedCoursesByPlanSemesterIdQuery,
  useGetPlannedCourseByIdQuery,
  useLazyGetPlannedCourseByIdQuery,
  useCreatePlannedCourseMutation,
  useUpdatePlannedCourseMutation,
  useDeletePlannedCourseMutation,
} = plannedCourseApi;
