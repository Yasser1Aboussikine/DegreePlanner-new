import { apiSlice } from "./apiSlice";

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface StudentDashboardData {
  degreeProgress: ChartDataPoint[];
  courseStatus: ChartDataPoint[];
  creditsByCategory: ChartDataPoint[];
  timelineProgress: ChartDataPoint[];
  approvalStatus: ChartDataPoint[];
}

export interface MentorDashboardData {
  menteesProgress: ChartDataPoint[];
  planStatus: ChartDataPoint[];
  aggregateCredits: ChartDataPoint[];
  riskLevel: ChartDataPoint[];
  decisionOutcomes: ChartDataPoint[];
}

export interface AdvisorDashboardData {
  studentPlanStatus: ChartDataPoint[];
  advisorDecision: ChartDataPoint[];
  requirementsCoverage: ChartDataPoint[];
  studentRisk: ChartDataPoint[];
  classification: ChartDataPoint[];
}

export interface RegistrarDashboardData {
  programsByDepartment: ChartDataPoint[];
  coursesByType: ChartDataPoint[];
  coursesByLevel: ChartDataPoint[];
  activeCourses: ChartDataPoint[];
  programCredits: ChartDataPoint[];
}

export interface AdminDashboardData {
  usersByRole: ChartDataPoint[];
  systemActivity: ChartDataPoint[];
  courseCatalog: ChartDataPoint[];
  degreeProgress: ChartDataPoint[];
  approvalWorkflow: ChartDataPoint[];
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentDashboard: builder.query<StudentDashboardData, void>({
      query: () => "/dashboard/student",
      transformResponse: (response: { message: string; data: StudentDashboardData }) =>
        response.data,
      providesTags: ["DegreePlan", "Semester", "PlannedCourse"],
      keepUnusedDataFor: 60,
    }),

    getMentorDashboard: builder.query<MentorDashboardData, void>({
      query: () => "/dashboard/mentor",
      transformResponse: (response: { message: string; data: MentorDashboardData }) =>
        response.data,
      providesTags: ["DegreePlan"],
      keepUnusedDataFor: 60,
    }),

    getAdvisorDashboard: builder.query<AdvisorDashboardData, void>({
      query: () => "/dashboard/advisor",
      transformResponse: (response: { message: string; data: AdvisorDashboardData }) =>
        response.data,
      providesTags: ["DegreePlan"],
      keepUnusedDataFor: 60,
    }),

    getRegistrarDashboard: builder.query<RegistrarDashboardData, void>({
      query: () => "/dashboard/registrar",
      transformResponse: (response: { message: string; data: RegistrarDashboardData }) =>
        response.data,
      providesTags: ["Program"],
      keepUnusedDataFor: 60,
    }),

    getAdminDashboard: builder.query<AdminDashboardData, void>({
      query: () => "/dashboard/admin",
      transformResponse: (response: { message: string; data: AdminDashboardData }) =>
        response.data,
      providesTags: ["DegreePlan", "User"],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetStudentDashboardQuery,
  useGetMentorDashboardQuery,
  useGetAdvisorDashboardQuery,
  useGetRegistrarDashboardQuery,
  useGetAdminDashboardQuery,
} = dashboardApi;
