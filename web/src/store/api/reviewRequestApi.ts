import { apiSlice } from "./apiSlice";
import type {
  PlanSemesterReviewRequest,
  CreateReviewRequestInput,
  SubmitMentorReviewInput,
  SubmitAdvisorReviewInput,
} from "../types";

export const reviewRequestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviewRequests: builder.query<
      { data: PlanSemesterReviewRequest[] },
      void
    >({
      query: () => "/review-requests",
      providesTags: ["ReviewRequest"],
    }),

    getReviewRequestById: builder.query<
      { data: PlanSemesterReviewRequest },
      string
    >({
      query: (id) => `/review-requests/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ReviewRequest", id }],
    }),

    getReviewRequestsByStudentId: builder.query<
      { data: PlanSemesterReviewRequest[] },
      string
    >({
      query: (studentId) => `/review-requests/student/${studentId}`,
      providesTags: (_result, _error, studentId) => [
        { type: "ReviewRequest", id: `student-${studentId}` },
      ],
    }),

    getReviewRequestsByMentorId: builder.query<
      { data: PlanSemesterReviewRequest[] },
      string
    >({
      query: (mentorId) => `/review-requests/mentor/${mentorId}`,
      providesTags: (_result, _error, mentorId) => [
        { type: "ReviewRequest", id: `mentor-${mentorId}` },
      ],
    }),

    getReviewRequestsByAdvisorId: builder.query<
      { data: PlanSemesterReviewRequest[] },
      string
    >({
      query: (advisorId) => `/review-requests/advisor/${advisorId}`,
      providesTags: (_result, _error, advisorId) => [
        { type: "ReviewRequest", id: `advisor-${advisorId}` },
      ],
    }),

    getPendingMentorReviews: builder.query<
      { data: PlanSemesterReviewRequest[] },
      string
    >({
      query: (mentorId) => `/review-requests/mentor/${mentorId}/pending`,
      providesTags: (_result, _error, mentorId) => [
        { type: "ReviewRequest", id: `mentor-${mentorId}-pending` },
      ],
    }),

    getPendingAdvisorReviews: builder.query<
      { data: PlanSemesterReviewRequest[] },
      string
    >({
      query: (advisorId) => `/review-requests/advisor/${advisorId}/pending`,
      providesTags: (_result, _error, advisorId) => [
        { type: "ReviewRequest", id: `advisor-${advisorId}-pending` },
      ],
    }),

    createReviewRequest: builder.mutation<
      { data: PlanSemesterReviewRequest },
      CreateReviewRequestInput
    >({
      query: (body) => ({
        url: "/review-requests",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ReviewRequest"],
    }),

    createDegreePlanReview: builder.mutation<
      { data: PlanSemesterReviewRequest[] },
      { degreePlanId: string }
    >({
      query: (body) => ({
        url: "/review-requests/degree-plan",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ReviewRequest", "DegreePlan"],
    }),

    submitMentorReview: builder.mutation<
      { data: PlanSemesterReviewRequest },
      { id: string; data: SubmitMentorReviewInput }
    >({
      query: ({ id, data }) => ({
        url: `/review-requests/${id}/mentor-review`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ReviewRequest", id },
        "ReviewRequest",
      ],
    }),

    submitAdvisorReview: builder.mutation<
      { data: PlanSemesterReviewRequest },
      { id: string; data: SubmitAdvisorReviewInput }
    >({
      query: ({ id, data }) => ({
        url: `/review-requests/${id}/advisor-review`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ReviewRequest", id },
        "ReviewRequest",
      ],
    }),

    submitBulkMentorReview: builder.mutation<
      { data: PlanSemesterReviewRequest[] },
      {
        degreePlanId: string;
        approve: boolean;
        semesterComments: Array<{ requestId: string; comment?: string }>;
        generalRejectionReason?: string;
      }
    >({
      query: (body) => ({
        url: "/review-requests/bulk/mentor-review",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ReviewRequest"],
    }),

    submitBulkAdvisorReview: builder.mutation<
      { data: PlanSemesterReviewRequest[] },
      {
        degreePlanId: string;
        approve: boolean;
        semesterComments: Array<{ requestId: string; comment: string }>;
        generalRejectionReason?: string;
      }
    >({
      query: (body) => ({
        url: "/review-requests/bulk/advisor-review",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ReviewRequest"],
    }),

    deleteReviewRequest: builder.mutation<{ data: null }, string>({
      query: (id) => ({
        url: `/review-requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ReviewRequest"],
    }),
  }),
});

export const {
  useGetAllReviewRequestsQuery,
  useGetReviewRequestByIdQuery,
  useGetReviewRequestsByStudentIdQuery,
  useGetReviewRequestsByMentorIdQuery,
  useGetReviewRequestsByAdvisorIdQuery,
  useGetPendingMentorReviewsQuery,
  useGetPendingAdvisorReviewsQuery,
  useCreateReviewRequestMutation,
  useCreateDegreePlanReviewMutation,
  useSubmitMentorReviewMutation,
  useSubmitAdvisorReviewMutation,
  useSubmitBulkMentorReviewMutation,
  useSubmitBulkAdvisorReviewMutation,
  useDeleteReviewRequestMutation,
} = reviewRequestApi;
