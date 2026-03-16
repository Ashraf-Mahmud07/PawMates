import { showInAppNotification } from "@/services/notification.service";
import { io, Socket } from "socket.io-client";

type IncomingMessage = {
  id: string;
  conversationId: string;
  text: string;
  senderId: string;
  timestamp: string;
};

let socket: Socket | null = null;
let messageHandlers: ((msg: IncomingMessage) => void)[] = [];

export function connectSocket(url = "", token?: string) {
  if (!url) return;
  if (socket) return;
  const opts: any = { transports: ["websocket"], reconnection: true };
  if (token) opts.auth = { token };
  socket = io(url, opts);

  socket.on("connect", () => {
    console.log("socket connected", socket?.id);
  });

  socket.on("message", (payload: IncomingMessage) => {
    messageHandlers.forEach((h) => h(payload));
    // also show an in-app banner for incoming messages (minimal)
    try {
      showInAppNotification({
        title: "New message",
        body: payload.text,
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
  if (!socket) return;
  socket.emit("message", { conversationId, text });
}

export function listenMessages(handler: (msg: IncomingMessage) => void) {
  messageHandlers.push(handler);
  return () => {
    messageHandlers = messageHandlers.filter((h) => h !== handler);
  };
}

// Note: no default export to avoid import ambiguity between named and default exports.
