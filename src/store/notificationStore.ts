import { create } from "zustand";
import { Notification } from "../types/Notification";
import { markAsAllRead } from "../services/notificationApi";

interface NotificationState {
  notifications: Notification[];
  setUnreadCount: (count: number) => void;
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsAllRead: () => void;
}

const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  setUnreadCount: (count: number) => set({ unreadCount: count }),
  setNotifications: (notifications: Notification[]) => {
    const unread = notifications.filter((n) => !n.isRead).length;
    set({ notifications, unreadCount: unread });
  },
  addNotification: (notification: Notification) => {
    const currentNotifications = get().notifications;
    const updatedNotifications = [notification, ...currentNotifications];
    const unread = updatedNotifications.filter((n) => !n.isRead).length;
    set({ notifications: updatedNotifications, unreadCount: unread });
  },
  markAsAllRead: async () => {
    const response = await markAsAllRead();
    if (response.success) {
      set({ notifications: response.data, unreadCount: 0 });
    }
  },
}));

export default useNotificationStore;
