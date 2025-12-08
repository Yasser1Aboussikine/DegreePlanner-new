import { apiSlice } from "./apiSlice";
import type { ChatThread, Message, SendMessageInput } from "../types/chat";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/chat/mentor-group - Get or create mentor group chat
    getMentorGroupChat: builder.query<ChatThread, void>({
      query: () => "/chat/mentor-group",
      transformResponse: (response: { success: boolean; data: ChatThread }) =>
        response.data,
      providesTags: ["ChatThread"],
    }),

    // GET /api/chat/threads - Get all threads for current user
    getUserThreads: builder.query<ChatThread[], void>({
      query: () => "/chat/threads",
      transformResponse: (response: { success: boolean; data: ChatThread[] }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "ChatThread" as const,
                id,
              })),
              { type: "ChatThread", id: "LIST" },
            ]
          : [{ type: "ChatThread", id: "LIST" }],
    }),

    // GET /api/chat/threads/:threadId/messages - Get messages for a thread
    getThreadMessages: builder.query<
      Message[],
      { threadId: string; limit?: number; skip?: number }
    >({
      query: ({ threadId, limit = 50, skip = 0 }) =>
        `/chat/threads/${threadId}/messages?limit=${limit}&skip=${skip}`,
      transformResponse: (response: { success: boolean; data: any[] }) => {
        // Transform isRead boolean to status enum for compatibility
        return response.data.map((msg: any) => ({
          ...msg,
          status: msg.status || (msg.isRead ? "READ" : "SENT"),
        }));
      },
      providesTags: (_, __, { threadId }) => [
        { type: "Message" as const, id: threadId },
      ],
    }),

    // POST /api/chat/threads/:threadId/messages - Send a message
    sendMessage: builder.mutation<
      Message,
      { threadId: string; data: SendMessageInput }
    >({
      query: ({ threadId, data }) => ({
        url: `/chat/threads/${threadId}/messages`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { success: boolean; data: any }) => {
        // Transform isRead boolean to status enum for compatibility
        const msg = response.data;
        return {
          ...msg,
          status: msg.status || (msg.isRead ? "READ" : "SENT"),
        };
      },
      // Note: No cache updates needed - using Socket.IO events for real-time updates
    }),

    // PUT /api/chat/threads/:threadId/read - Mark messages as read
    markMessagesAsRead: builder.mutation<void, string>({
      query: (threadId) => ({
        url: `/chat/threads/${threadId}/read`,
        method: "PUT",
      }),
      async onQueryStarted(threadId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // Update the messages cache to mark as read
          dispatch(
            chatApi.util.updateQueryData(
              "getThreadMessages",
              { threadId },
              (draft) => {
                draft.forEach((message) => {
                  message.status = "READ";
                });
              }
            )
          );
        } catch {
          // Ignore errors
        }
      },
    }),

    // GET /api/chat/unread-count - Get unread message count
    getUnreadCount: builder.query<number, void>({
      query: () => "/chat/unread-count",
      transformResponse: (response: {
        success: boolean;
        data: { count: number };
      }) => response.data.count,
      providesTags: ["UnreadCount"],
    }),
  }),
});

export const {
  useGetMentorGroupChatQuery,
  useLazyGetMentorGroupChatQuery,
  useGetUserThreadsQuery,
  useLazyGetUserThreadsQuery,
  useGetThreadMessagesQuery,
  useLazyGetThreadMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  useGetUnreadCountQuery,
  useLazyGetUnreadCountQuery,
} = chatApi;
