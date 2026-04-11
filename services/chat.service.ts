import { showInAppNotification } from "@/services/notification.service";
import { Message } from "@/types/chat.type";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let messageHandlers: ((msg: Message) => void)[] = [];

export function connectSocket(url = "", token?: string) {
  if (!url) return;
  if (socket?.connected) return;
  const opts: any = { transports: ["websocket"], reconnection: true };
  if (token) opts.auth = { token };
  socket = io(url, opts);

  socket.on("connect", () => {
    console.log("socket connected", socket?.id);
  });

  socket.on("message", (payload: Message) => {
    messageHandlers.forEach((h) => h(payload));
    // also show an in-app banner for incoming messages (minimal)
    try {
      showInAppNotification({
        title: "New message",
        body: payload.message,
        data: {
          conversationId: payload.conversationId,
          userId: payload.senderId,
        },
      });
    } catch {
      // ignore if notification service not available
    }
  });
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}

export function emitMessage(conversationId: string, text: string) {
  if (!socket?.connected) {
    console.warn("Socket not connected, message not sent");
    return;
  }
  socket.emit("message", { conversationId, text });
}

export function listenMessages(handler: (msg: Message) => void) {
  messageHandlers.push(handler);
  return () => {
    messageHandlers = messageHandlers.filter((h) => h !== handler);
  };
}
