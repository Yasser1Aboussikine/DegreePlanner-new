import { apiSlice } from "./apiSlice";

export interface Minor {
  name: string;
  code: string;
}

export const minorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMinors: builder.query<{ data: Minor[] }, void>({
      query: () => "/minors",
    }),
  }),
});

export const { useGetAllMinorsQuery } = minorApi;
