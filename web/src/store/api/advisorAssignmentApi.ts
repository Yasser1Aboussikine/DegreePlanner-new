import { apiSlice } from "./apiSlice";
import type {
  AdvisorAssignment,
  CreateAdvisorAssignmentInput,
  User,
} from "../types";

export const advisorAssignmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdvisorAssignments: builder.query<
      { data: AdvisorAssignment[] },
      void
    >({
      query: () => "/advisor-assignments",
      providesTags: ["AdvisorAssignment"],
    }),

    getAdvisorAssignmentsByAdvisorId: builder.query<
      { data: AdvisorAssignment[] },
      string
    >({
      query: (advisorId) => `/advisor-assignments/advisor/${advisorId}`,
      providesTags: (_result, _error, advisorId) => [
        { type: "AdvisorAssignment", id: advisorId },
      ],
    }),

    getAdvisorAssignmentsByStudentId: builder.query<
      { data: AdvisorAssignment[] },
      string
    >({
      query: (studentId) => `/advisor-assignments/student/${studentId}`,
      providesTags: (_result, _error, studentId) => [
        { type: "AdvisorAssignment", id: studentId },
      ],
    }),

    getStudentsByAdvisorId: builder.query<{ data: Partial<User>[] }, string>({
      query: (advisorId) =>
        `/advisor-assignments/advisor/${advisorId}/students`,
      providesTags: (_result, _error, advisorId) => [
        { type: "AdvisorAssignment", id: `${advisorId}-students` },
      ],
    }),

    getUnassignedStudentsForAdvisor: builder.query<
      { data: Partial<User>[] },
      void
    >({
      query: () => "/advisor-assignments/unassigned-students",
      providesTags: ["AdvisorAssignment"],
    }),

    getUnassignedStudentsAndMentors: builder.query<
      { data: Partial<User>[] },
      void
    >({
      query: () => "/advisor-assignments/unassigned-students-and-mentors",
      providesTags: ["AdvisorAssignment"],
    }),

    createAdvisorAssignment: builder.mutation<
      { data: AdvisorAssignment },
      CreateAdvisorAssignmentInput
    >({
      query: (body) => ({
        url: "/advisor-assignments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdvisorAssignment"],
    }),

    deleteAdvisorAssignment: builder.mutation<{ data: null }, string>({
      query: (id) => ({
        url: `/advisor-assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdvisorAssignment"],
    }),
  }),
});

export const {
  useGetAllAdvisorAssignmentsQuery,
  useGetAdvisorAssignmentsByAdvisorIdQuery,
  useGetAdvisorAssignmentsByStudentIdQuery,
  useGetStudentsByAdvisorIdQuery,
  useGetUnassignedStudentsForAdvisorQuery,
  useGetUnassignedStudentsAndMentorsQuery,
  useCreateAdvisorAssignmentMutation,
  useDeleteAdvisorAssignmentMutation,
} = advisorAssignmentApi;
