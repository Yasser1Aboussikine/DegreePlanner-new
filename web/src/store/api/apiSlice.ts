import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    // Get token from localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Custom base query with error handling
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Log errors for debugging
  if (result.error) {
    console.error("API Error:", {
      status: result.error.status,
      data: result.error.data,
      endpoint: typeof args === "string" ? args : args.url,
    });
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Course",
    "CoursePrereqs",
    "CourseDependents",
    "PlannedCourse",
    "Semester",
    "DegreePlan",
    "Program",
    "ProgramRequirement",
    "MentorAssignment",
    "AdvisorAssignment",
    "ReviewRequest",
    "Category",
    "Subcategory",
    "Area",
    "ChatThread",
    "Message",
    "UnreadCount",
  ],
  endpoints: () => ({}),
});
