import { apiSlice } from "./apiSlice";
import type {
  MentorAssignment,
  CreateMentorAssignmentInput,
  User,
} from "../types";

export const mentorAssignmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMentorAssignments: builder.query<{ data: MentorAssignment[] }, void>({
      query: () => "/mentor-assignments",
      providesTags: ["MentorAssignment"],
    }),

    getMentorAssignmentsByMentorId: builder.query<
      { data: MentorAssignment[] },
      string
    >({
      query: (mentorId) => `/mentor-assignments/mentor/${mentorId}`,
      providesTags: (_result, _error, mentorId) => [
        { type: "MentorAssignment", id: mentorId },
      ],
    }),

    getMentorAssignmentsByStudentId: builder.query<
      { data: MentorAssignment[] },
      string
    >({
      query: (studentId) => `/mentor-assignments/student/${studentId}`,
      providesTags: (_result, _error, studentId) => [
        { type: "MentorAssignment", id: studentId },
      ],
    }),

    getStudentsByMentorId: builder.query<{ data: Partial<User>[] }, string>({
      query: (mentorId) => `/mentor-assignments/mentor/${mentorId}/students`,
      providesTags: (_result, _error, mentorId) => [
        { type: "MentorAssignment", id: `${mentorId}-students` },
      ],
    }),

    createMentorAssignment: builder.mutation<
      { data: MentorAssignment },
      CreateMentorAssignmentInput
    >({
      query: (body) => ({
        url: "/mentor-assignments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MentorAssignment"],
    }),

    deleteMentorAssignment: builder.mutation<{ data: null }, string>({
      query: (id) => ({
        url: `/mentor-assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MentorAssignment"],
    }),
  }),
});

export const {
  useGetAllMentorAssignmentsQuery,
  useGetMentorAssignmentsByMentorIdQuery,
  useGetMentorAssignmentsByStudentIdQuery,
  useGetStudentsByMentorIdQuery,
  useCreateMentorAssignmentMutation,
  useDeleteMentorAssignmentMutation,
} = mentorAssignmentApi;
