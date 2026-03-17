import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";
import { API_BASE } from "./api";

const baseUrl = API_BASE || "";

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers) => {
    try {
      const token = await SecureStore.getItemAsync("pawmates_token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
    } catch {
      // ignore
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: "rtkApi",
  baseQuery,
  tagTypes: ["Conversations", "Messages"],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({ url: "/api/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<
      any,
      { name: string; email: string; password: string }
    >({
      query: (body) => ({ url: "/api/auth/register", method: "POST", body }),
    }),

    // Chat
    getConversations: builder.query<any[], void>({
      query: () => ({ url: "/api/chat/conversations" }),
      providesTags: ["Conversations"],
    }),
    getMessages: builder.query<any[], string>({
      query: (conversationId) => ({
        url: `/api/chat/messages/${conversationId}`,
      }),
      providesTags: (result, error, arg) => [{ type: "Messages", id: arg }],
    }),
    sendMessage: builder.mutation<
      any,
      { conversationId: string; text: string }
    >({
      query: (body) => ({ url: "/api/chat/messages", method: "POST", body }),
      invalidatesTags: (result, error, arg) => [
        { type: "Messages", id: arg.conversationId },
        "Conversations",
      ],
    }),
    markRead: builder.mutation<any, string>({
      query: (conversationId) => ({
        url: `/api/chat/messages/read/${conversationId}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Messages", id: arg },
        "Conversations",
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkReadMutation,
} = api;

export default api;
