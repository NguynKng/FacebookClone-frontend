import { create } from "zustand";
import { newMessagePayload } from "../types/Message";

interface ChatStore {
  messages: newMessagePayload[];
  setMessages: (messages: newMessagePayload[]) => void;
  updateMessage: (newMessage: newMessagePayload, isSentByMe: boolean) => void;
}

// Create the Zustand store with proper types
const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (messages: newMessagePayload[]) => set({ messages }),
  updateMessage: (newMessage: newMessagePayload, isSentByMe: boolean) =>
    set((state) => {
      const index = state.messages.findIndex(
        (msg) => msg.participant._id === newMessage.participant._id
      );
      if (index !== -1) {
        const updatedChat: newMessagePayload = {
          ...state.messages[index],
          lastMessage: {
            text: newMessage.lastMessage.text,
            timestamp: newMessage.lastMessage.timestamp,
            isSentByMe,
          },
        };
        const newMessages = [
          updatedChat,
          ...state.messages.filter((_, i) => i !== index),
        ];
        return { messages: newMessages };
      } else {
        const newChat: newMessagePayload = {
          lastMessage: {
            text: newMessage.lastMessage.text,
            timestamp: newMessage.lastMessage.timestamp,
            isSentByMe,
          },
          participant: newMessage.participant,
          senderId: newMessage.senderId,
          receiverId: newMessage.receiverId,
        };
        return { messages: [newChat, ...state.messages] };
      }
    }),
}));

export default useChatStore;
