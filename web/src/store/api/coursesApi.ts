import { apiSlice } from './apiSlice';
import type { Course, CreateCourseInput, UpdateCourseInput, CourseRelationship } from '../types';

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/courses - Get all courses
    getAllCourses: builder.query<Course[], void>({
      query: () => '/courses',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Course' as const, id })),
              { type: 'Course', id: 'LIST' },
            ]
          : [{ type: 'Course', id: 'LIST' }],
    }),

    // GET /api/courses/labels - Get all node labels
    getAllNodeLabels: builder.query<string[], void>({
      query: () => '/courses/labels',
    }),

    // GET /api/courses/search?q=... - Search courses
    searchCourses: builder.query<Course[], string>({
      query: (q) => `/courses/search?q=${encodeURIComponent(q)}`,
      providesTags: [{ type: 'Course', id: 'LIST' }],
    }),

    // GET /api/courses/:id - Get course by ID
    getCourseById: builder.query<Course, string>({
      query: (id) => `/courses/${id}`,
      providesTags: (_, __, id) => [{ type: 'Course', id }],
    }),

    // GET /api/courses/label/:label - Get courses by label
    getCoursesByLabel: builder.query<Course[], string>({
      query: (label) => `/courses/label/${label}`,
      providesTags: [{ type: 'Course', id: 'LIST' }],
    }),

    // GET /api/courses/discipline/:discipline - Get courses by discipline
    getCoursesByDiscipline: builder.query<Course[], string>({
      query: (discipline) => `/courses/discipline/${discipline}`,
      providesTags: [{ type: 'Course', id: 'LIST' }],
    }),

    // GET /api/courses/code/:course_code - Get course by course code
    getCourseByCourseCode: builder.query<Course, string>({
      query: (courseCode) => `/courses/code/${courseCode}`,
      providesTags: (result) =>
        result ? [{ type: 'Course', id: result.id }] : [],
    }),

    // POST /api/courses - Create course (Admin only)
    createCourse: builder.mutation<Course, CreateCourseInput>({
      query: (course) => ({
        url: '/courses',
        method: 'POST',
        body: course,
      }),
      invalidatesTags: [{ type: 'Course', id: 'LIST' }],
    }),

    // PUT /api/courses/:id - Update course (Admin only)
    updateCourse: builder.mutation<Course, { id: string; data: UpdateCourseInput }>({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Course', id },
        { type: 'Course', id: 'LIST' },
      ],
    }),

    // DELETE /api/courses/:id - Delete course (Admin only)
    deleteCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Course', id },
        { type: 'Course', id: 'LIST' },
      ],
    }),

    // GET /api/courses/:id/prerequisites - Get course prerequisites
    getCoursePrerequisites: builder.query<Course[], string>({
      query: (id) => `/courses/${id}/prerequisites`,
      providesTags: (_, __, id) => [{ type: 'Course', id }],
    }),

    // GET /api/courses/:id/dependents - Get course dependents
    getCourseDependents: builder.query<Course[], string>({
      query: (id) => `/courses/${id}/dependents`,
      providesTags: (_, __, id) => [{ type: 'Course', id }],
    }),

    // GET /api/courses/:id/prerequisite-chain - Get full prerequisite chain
    getPrerequisiteChain: builder.query<Course[], string>({
      query: (id) => `/courses/${id}/prerequisite-chain`,
      providesTags: (_, __, id) => [{ type: 'Course', id }],
    }),

    // GET /api/courses/:id/dependent-chain - Get full dependent chain
    getDependentChain: builder.query<Course[], string>({
      query: (id) => `/courses/${id}/dependent-chain`,
      providesTags: (_, __, id) => [{ type: 'Course', id }],
    }),

    // POST /api/courses/:id/prerequisites - Add prerequisite (Admin/Advisor)
    addPrerequisite: builder.mutation<CourseRelationship, { id: string; prerequisiteId: string }>({
      query: ({ id, prerequisiteId }) => ({
        url: `/courses/${id}/prerequisites`,
        method: 'POST',
        body: { prerequisiteId },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Course', id },
        { type: 'Course', id: 'LIST' },
      ],
    }),

    // DELETE /api/courses/:id/prerequisites/:prerequisiteId - Remove prerequisite (Admin/Advisor)
    removePrerequisite: builder.mutation<void, { id: string; prerequisiteId: string }>({
      query: ({ id, prerequisiteId }) => ({
        url: `/courses/${id}/prerequisites/${prerequisiteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Course', id },
        { type: 'Course', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useLazyGetAllCoursesQuery,
  useGetAllNodeLabelsQuery,
  useSearchCoursesQuery,
  useLazySearchCoursesQuery,
  useGetCourseByIdQuery,
  useLazyGetCourseByIdQuery,
  useGetCoursesByLabelQuery,
  useLazyGetCoursesByLabelQuery,
  useGetCoursesByDisciplineQuery,
  useLazyGetCoursesByDisciplineQuery,
  useGetCourseByCourseCodeQuery,
  useLazyGetCourseByCourseCodeQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursePrerequisitesQuery,
  useLazyGetCoursePrerequisitesQuery,
  useGetCourseDependentsQuery,
  useLazyGetCourseDependentsQuery,
  useGetPrerequisiteChainQuery,
  useLazyGetPrerequisiteChainQuery,
  useGetDependentChainQuery,
  useLazyGetDependentChainQuery,
  useAddPrerequisiteMutation,
  useRemovePrerequisiteMutation,
} = coursesApi;
