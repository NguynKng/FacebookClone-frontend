import { newMessagePayload } from "../types/Message";
import { useEffect, useState } from "react";
import { ApiResponse } from "../types/ApiResponse";
import { getRecentChats } from "../services/messageApi"; // Giả sử bạn đã định nghĩa `getPostById` trong `postApi`
import useChatStore from "../store/chatStore";

export const useGetRecentChats = () => {
  const { messages, setMessages, updateMessage } = useChatStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        // Giả sử getPostById trả về ApiResponse<Post[]>
        const response: ApiResponse<newMessagePayload[]> =
          await getRecentChats();

        if (response.success) {
          setMessages(response.data || []); // Lưu trữ các bài viết vào state
        } else {
          setError(response.message || "Failed to load posts");
        }
      } catch (err: any) {
        setError(err?.message || "An error occurred while fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [setMessages]);

  return { messages, loading, error, updateMessage };
};
