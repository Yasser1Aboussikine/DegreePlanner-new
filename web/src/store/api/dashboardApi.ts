import { apiSlice } from "./apiSlice";

export interface CategoryStats {
  name: string;
  planned: number;
  required: number;
  color: string;
}

export interface SemesterStats {
  total: number;
}

export interface CreditStats {
  planned: number;
  total: number;
}

export interface DashboardStats {
  categoryProgress: CategoryStats[];
  semesterStats: SemesterStats;
  totalCredits: CreditStats;
  overallProgress: number;
  creditProgress: number;
  creditsData: Array<{ name: string; value: number; color: string }>;
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/dashboard/student/stats - Get student dashboard statistics
    getStudentDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/dashboard/student/stats",
      transformResponse: (response: {
        success: boolean;
        data: DashboardStats;
      }) => response.data,
      providesTags: ["DegreePlan", "Semester", "PlannedCourse"],
    }),
  }),
});

export const {
  useGetStudentDashboardStatsQuery,
  useLazyGetStudentDashboardStatsQuery,
} = dashboardApi;
