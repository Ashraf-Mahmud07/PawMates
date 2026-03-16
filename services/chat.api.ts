import client from "./api";

export async function getConversations() {
  const res = await client.get("/api/chat/conversations");
  return res.data;
}

export async function getMessages(conversationId: string) {
  const res = await client.get(`/api/chat/messages/${conversationId}`);
  return res.data;
}

export async function sendMessageAPI(conversationId: string, text: string) {
  const res = await client.post("/api/chat/messages", { conversationId, text });
  return res.data;
}

export async function markRead(conversationId: string) {
  const res = await client.put(`/api/chat/messages/read/${conversationId}`);
  return res.data;
}

export default { getConversations, getMessages, sendMessageAPI, markRead };
