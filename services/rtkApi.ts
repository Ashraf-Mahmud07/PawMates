import { MessagesResponse } from "@/types/chat.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://192.168.10.152:5000/api",
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
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<
      any,
      { name: string; email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),

    // Chat
    getConversations: builder.query<any[], void>({
      query: () => ({ url: "/chat/conversations" }),
      providesTags: ["Conversations"],
    }),
    getMessages: builder.query<MessagesResponse, string>({
      query: (conversationId) => ({
        url: `/chat/messages/${conversationId}`,
      }),
      transformResponse: (response: any) => response?.messages ?? [],
      providesTags: (result, error, arg) => [{ type: "Messages", id: arg }],
    }),
    sendMessage: builder.mutation<
      any,
      {
        conversationId: string;
        message: string;
        messageType: string;
        receiverId: string;
      }
    >({
      query: (body) => ({ url: "/chat/messages", method: "POST", body }),
      invalidatesTags: (result, error, arg) => [
        { type: "Messages", id: arg.conversationId },
        "Conversations",
      ],
    }),
    markRead: builder.mutation<any, string>({
      query: (conversationId) => ({
        url: `/chat/messages/read/${conversationId}`,
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
