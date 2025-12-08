import { apiSlice } from "./apiSlice";
import type {
  Program,
  ProgramRequirement,
  CreateProgramInput,
  UpdateProgramInput,
  CreateProgramWithRequirementsInput,
} from "../types";

export const programApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPrograms: builder.query<{ data: Program[] }, void>({
      query: () => "/programs",
      providesTags: ["Program"],
    }),

    getActivePrograms: builder.query<{ data: Program[] }, void>({
      query: () => "/programs/active",
      providesTags: ["Program"],
    }),

    getProgramById: builder.query<{ data: Program }, string>({
      query: (id) => `/programs/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Program", id }],
    }),

    getProgramByCode: builder.query<{ data: Program }, string>({
      query: (code) => `/programs/code/${code}`,
      providesTags: (_result, _error, code) => [{ type: "Program", id: code }],
    }),

    createProgram: builder.mutation<{ data: Program }, CreateProgramInput>({
      query: (body) => ({
        url: "/programs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Program"],
    }),

    createProgramWithRequirements: builder.mutation<
      { data: Program },
      CreateProgramWithRequirementsInput
    >({
      query: (body) => ({
        url: "/programs/with-requirements",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Program", "ProgramRequirement"],
    }),

    updateProgram: builder.mutation<
      { data: Program },
      { id: string; data: UpdateProgramInput }
    >({
      query: ({ id, data }) => ({
        url: `/programs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Program", id },
        "Program",
      ],
    }),

    deleteProgram: builder.mutation<{ data: null }, string>({
      query: (id) => ({
        url: `/programs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Program"],
    }),

    getProgramRequirements: builder.query<
      { data: ProgramRequirement[] },
      string
    >({
      query: (programId) => `/programs/${programId}/requirements`,
      providesTags: (_result, _error, programId) => [
        { type: "ProgramRequirement", id: programId },
      ],
    }),

    createProgramRequirement: builder.mutation<
      { data: ProgramRequirement },
      { programId: string; category: string; credits: number }
    >({
      query: (body) => ({
        url: "/programs/requirements",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProgramRequirement"],
    }),

    updateProgramRequirement: builder.mutation<
      { data: ProgramRequirement },
      { id: string; credits: number }
    >({
      query: ({ id, credits }) => ({
        url: `/programs/requirements/${id}`,
        method: "PUT",
        body: { credits },
      }),
      invalidatesTags: ["ProgramRequirement"],
    }),

    deleteProgramRequirement: builder.mutation<{ data: null }, string>({
      query: (id) => ({
        url: `/programs/requirements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProgramRequirement"],
    }),
  }),
});

export const {
  useGetAllProgramsQuery,
  useGetActiveProgramsQuery,
  useGetProgramByIdQuery,
  useGetProgramByCodeQuery,
  useCreateProgramMutation,
  useCreateProgramWithRequirementsMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
  useGetProgramRequirementsQuery,
  useCreateProgramRequirementMutation,
  useUpdateProgramRequirementMutation,
  useDeleteProgramRequirementMutation,
} = programApi;
