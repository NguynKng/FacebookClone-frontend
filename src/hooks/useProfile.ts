import { useEffect, useState } from "react";
import { getUserById, getUserByName } from "../services/userApi"; // Giả sử bạn đã định nghĩa `getPostById` trong `postApi`
import { User } from "../types/User";
import { Profile } from "../types/Profile";
import { ApiResponse } from "../types/ApiResponse"; // Import ApiResponse từ types

interface UseGetUserProfileOptions {
    enabled?: boolean
  }

export const useGetUserProfile = (UserId: string) => {
  const [profile, setProfile] = useState<Profile>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!UserId) return;

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Giả sử getPostById trả về ApiResponse<Post[]>
        const response: ApiResponse<Profile> = await getUserById(UserId);

        if (response.success) {
          setProfile(response.data || undefined); // Lưu trữ các bài viết vào state
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

  return { profile, loading, error };
};

export const useGetUserProfileByName = (name: string, options: UseGetUserProfileOptions = {}) => {
    const [listUser, setListUser] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const shouldFetch = options.enabled !== false;
  
    useEffect(() => {
        if (!shouldFetch) 
            return;
  
      const fetchUser = async () => {
        setLoading(true);
        setError(null);
  
        try {
          // Giả sử getPostById trả về ApiResponse<Post[]>
          const response: ApiResponse<User[]> = await getUserByName(name);
  
          if (response.success) {
            setListUser(response.data || []); // Lưu trữ các bài viết vào state
          } else {
            setError(response.message || "Failed to load posts");
          }
        } catch (err: any) {
          setError(err?.message || "An error occurred while fetching posts");
        } finally {
          setLoading(false);
        }
      };
  
      fetchUser();
    }, [name, shouldFetch]);
  
    return { listUser, loading, error };
  };
