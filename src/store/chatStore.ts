import { create } from "zustand";
import { persist } from "zustand/middleware";
import { newMessagePayload } from "../types/Message";

interface ChatState {
    messages: newMessagePayload[]
    isMessagesLoading: boolean,
}
