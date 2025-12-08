import { apiSlice } from "./apiSlice";
import type {
  PlannedCourse,
  CreatePlannedCourseInput,
  UpdatePlannedCourseInput,
} from "../types";

export const plannedCourseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/planned-courses - Get all planned courses (Admin/Advisor only)
    getAllPlannedCourses: builder.query<PlannedCourse[], void>({
      query: () => "/planned-courses",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "PlannedCourse" as const,
                id,
              })),
              { type: "PlannedCourse", id: "LIST" },
            ]
          : [{ type: "PlannedCourse", id: "LIST" }],
    }),

    // GET /api/planned-courses/semester/:planSemesterId - Get planned courses by semester
    getPlannedCoursesByPlanSemesterId: builder.query<PlannedCourse[], string>({
      query: (planSemesterId) => `/planned-courses/semester/${planSemesterId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "PlannedCourse" as const,
                id,
              })),
              { type: "PlannedCourse", id: "LIST" },
            ]
          : [{ type: "PlannedCourse", id: "LIST" }],
    }),

    // GET /api/planned-courses/:id - Get planned course by ID
    getPlannedCourseById: builder.query<PlannedCourse, string>({
      query: (id) => `/planned-courses/${id}`,
      providesTags: (_, __, id) => [{ type: "PlannedCourse", id }],
    }),

    // POST /api/planned-courses - Create planned course
    createPlannedCourse: builder.mutation<
      PlannedCourse,
      CreatePlannedCourseInput
    >({
      query: (data) => ({
        url: "/planned-courses",
        method: "POST",
        body: data,
      }),
      transformResponse: (
        response: {
          success?: boolean;
          data?: PlannedCourse;
          message?: string;
        } & PlannedCourse
      ) => {
        return response.data || response;
      },
      invalidatesTags: [
        { type: "PlannedCourse", id: "LIST" },
        { type: "DegreePlan", id: "LIST" },
        { type: "Course", id: "ELIGIBLE" },
      ],
    }),

    // PUT /api/planned-courses/:id - Update planned course
    updatePlannedCourse: builder.mutation<
      PlannedCourse,
      { id: string; data: UpdatePlannedCourseInput }
    >({
      query: ({ id, data }) => ({
        url: `/planned-courses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "PlannedCourse", id },
        { type: "PlannedCourse", id: "LIST" },
      ],
    }),

    // DELETE /api/planned-courses/:id - Delete planned course
    deletePlannedCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/planned-courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "PlannedCourse", id },
        { type: "PlannedCourse", id: "LIST" },
      ],
    }),

    // DELETE /api/planned-courses/:id/with-dependents - Delete planned course with all dependents
    deletePlannedCourseWithDependents: builder.mutation<
      { deletedCount: number; deletedCourses: string[] },
      string
    >({
      query: (id) => ({
        url: `/planned-courses/${id}/with-dependents`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        success: boolean;
        message: string;
        data: { deletedCount: number; deletedCourses: string[] };
      }) => response.data,
      invalidatesTags: [
        { type: "PlannedCourse", id: "LIST" },
        { type: "DegreePlan", id: "LIST" },
        { type: "Course", id: "ELIGIBLE" },
      ],
    }),

    // GET /api/planned-courses/:id/dependents - Get dependents for a planned course
    getPlannedCourseDependents: builder.query<PlannedCourse[], string>({
      query: (id) => `/planned-courses/${id}/dependents`,
      transformResponse: (response: {
        success: boolean;
        count: number;
        data: PlannedCourse[];
      }) => response.data,
      providesTags: (_, __, id) => [
        { type: "PlannedCourse", id: `DEPENDENTS-${id}` },
      ],
    }),
  }),
});

export const {
  useGetAllPlannedCoursesQuery,
  useLazyGetAllPlannedCoursesQuery,
  useGetPlannedCoursesByPlanSemesterIdQuery,
  useLazyGetPlannedCoursesByPlanSemesterIdQuery,
  useGetPlannedCourseByIdQuery,
  useLazyGetPlannedCourseByIdQuery,
  useCreatePlannedCourseMutation,
  useUpdatePlannedCourseMutation,
  useDeletePlannedCourseMutation,
  useDeletePlannedCourseWithDependentsMutation,
  useGetPlannedCourseDependentsQuery,
  useLazyGetPlannedCourseDependentsQuery,
} = plannedCourseApi;
