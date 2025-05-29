import { useEffect, useState } from "react";
import { ApiResponse } from "../types/ApiResponse";
import { Notification } from "../types/Notification";
import { getNotifications } from "../services/notificationApi";
import useNotificationStore from "../store/notificationStore";

export const useGetNotifications = () => {
  const { notifications, setNotifications, unreadCount } = useNotificationStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already fetched, don't fetch again
    if (notifications.length > 0) return;

    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: ApiResponse<Notification[]> = await getNotifications();

        if (response.success) {
          setNotifications(response.data || []);
        } else {
          setError(response.message || "Không thể tải thông báo");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Có lỗi xảy ra khi tải thông báo");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [notifications, setNotifications]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
  };
};
