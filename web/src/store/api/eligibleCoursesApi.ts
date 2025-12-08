import { apiSlice } from "./apiSlice";
import type { EligibleCourse } from "../types";

export interface CheckEligibilityResponse {
  isEligible: boolean;
  reasonIneligible?: string;
  missingPrerequisites?: string[];
}

export const eligibleCoursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEligibleCoursesForCurrentUser: builder.query<
      EligibleCourse[],
      { search?: string; upToSemesterId?: string } | void
    >({
      query: (params) => ({
        url: "/eligible-courses/me",
        params: params
          ? { search: params.search, upToSemesterId: params.upToSemesterId }
          : undefined,
      }),
      transformResponse: (response: {
        success: boolean;
        data: EligibleCourse[];
      }) => response.data,
      providesTags: (_, __, arg) => [
        { type: "Course", id: "ELIGIBLE" },
        {
          type: "Course",
          id: `ELIGIBLE-UP-TO-${arg?.upToSemesterId || "ALL"}`,
        },
      ],
    }),

    getEligibleCoursesForUser: builder.query<
      EligibleCourse[],
      { userId: string; search?: string }
    >({
      query: ({ userId, search }) => ({
        url: `/eligible-courses/user/${userId}`,
        params: search ? { search } : undefined,
      }),
      transformResponse: (response: {
        success: boolean;
        data: EligibleCourse[];
      }) => response.data,
      providesTags: (_, __, { userId }) => [
        { type: "Course", id: `ELIGIBLE-${userId}` },
      ],
    }),

    getEligibleCoursesForDegreePlan: builder.query<
      EligibleCourse[],
      { degreePlanId: string; search?: string }
    >({
      query: ({ degreePlanId, search }) => ({
        url: `/eligible-courses/degree-plan/${degreePlanId}`,
        params: search ? { search } : undefined,
      }),
      transformResponse: (response: {
        success: boolean;
        data: EligibleCourse[];
      }) => response.data,
      providesTags: (_, __, { degreePlanId }) => [
        { type: "Course", id: `ELIGIBLE-PLAN-${degreePlanId}` },
      ],
    }),

    checkCourseEligibility: builder.query<CheckEligibilityResponse, string>({
      query: (courseCode) => `/eligible-courses/check/${courseCode}`,
      transformResponse: (response: {
        success: boolean;
        data: CheckEligibilityResponse;
      }) => response.data,
    }),

    getAllCourseRelationships: builder.query<
      Record<string, { prerequisites: string[]; dependents: string[] }>,
      void
    >({
      query: () => "/eligible-courses/relationships",
      transformResponse: (response: {
        success: boolean;
        data: Record<string, { prerequisites: string[]; dependents: string[] }>;
      }) => response.data,
    }),
  }),
});

export const {
  useGetEligibleCoursesForCurrentUserQuery,
  useLazyGetEligibleCoursesForCurrentUserQuery,
  useGetEligibleCoursesForUserQuery,
  useLazyGetEligibleCoursesForUserQuery,
  useGetEligibleCoursesForDegreePlanQuery,
  useLazyGetEligibleCoursesForDegreePlanQuery,
  useCheckCourseEligibilityQuery,
  useLazyCheckCourseEligibilityQuery,
  useGetAllCourseRelationshipsQuery,
  useLazyGetAllCourseRelationshipsQuery,
} = eligibleCoursesApi;
