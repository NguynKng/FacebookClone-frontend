import { useEffect, useState } from "react";
import { getPostByUserId, getAllPost } from "../services/postApi"; // Giả sử bạn đã định nghĩa `getPostById` trong `postApi`
import { Post } from "../types/Post";
import { ApiResponse } from "../types/ApiResponse"; // Import ApiResponse từ types

export const useGetUserPosts = (UserId: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!UserId) return;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Giả sử getPostById trả về ApiResponse<Post[]>
        const response: ApiResponse<Post[]> = await getPostByUserId(UserId);

        if (response.success) {
          setPosts(response.data || []); // Lưu trữ các bài viết vào state
        } else {
          setError(response.message || "Failed to load posts");
        }
      } catch (err: any) {
        setError(err?.message || "An error occurred while fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [UserId]);

  return { posts, loading, error };
};

export const useGetAllPost = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchPosts = async () => {
        setLoading(true);
        setError(null);
  
        try {
          // Giả sử getPostById trả về ApiResponse<Post[]>
          const response: ApiResponse<Post[]> = await getAllPost();
  
          if (response.success) {
            setPosts(response.data || []); // Lưu trữ các bài viết vào state
          } else {
            setError(response.message || "Failed to load posts");
          }
        } catch (err: any) {
          setError(err?.message || "An error occurred while fetching posts");
        } finally {
          setLoading(false);
        }
      };
  
      fetchPosts();
    }, []);
  
    return { posts, loading, error };
  };
