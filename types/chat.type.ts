interface Participant {
  _id: string;
  name: string;
  email: string;
}

interface UnreadCount {
  [userId: string]: number;
}

export interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: UnreadCount;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type ConversationsResponse = Conversation[];

type MessageType = "text" | "image" | "video" | "file";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  message: string;
  messageType: MessageType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type MessagesResponse = Message[];
