import { ApiResponse } from "../types/ApiResponse";
import { Profile } from "../types/Profile";
import { User } from "../types/User";
import api from "./api";

export const uploadAvatar = (formData: FormData) =>
  api.put("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const uploadCoverPhoto = (formData: FormData) =>
  api.put("/users/cover-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getUserById = async (
  userId: string
): Promise<ApiResponse<Profile>> => {
  try {
    const response = await api.get(`/users/profile/${userId}`);

    return {
      success: true,
      message: response.data.message,
      data: response.data.data || undefined, // Dữ liệu người dùng
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch user",
      data: undefined, // Trả về null nếu có lỗi
    };
  }
};

export const getUserByName = async (
  name: string
): Promise<ApiResponse<User[]>> => {
  try {
    const response = await api.get(`/users/search?name=${name}`);

    return {
      success: true,
      message: response.data.message,
      data: response.data.data || [], // Dữ liệu người dùng
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch user",
      data: [], // Trả về null nếu có lỗi
    };
  }
};

export const AddFriendRequest = async (
  userId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.post(`/users/friend-request/${userId}`);
    return {
      success: true,
      message: response.data.message,
      data: null, // Không có dữ liệu trả về
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add friend request",
      data: null, // Trả về null nếu có lỗi
    };
  }
};

export const CancelFriendRequest = async (
  userId: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/users/friend-request/${userId}`);
    return {
      success: true,
      message: response.data.message,
      data: null, // Không có dữ liệu trả về
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add friend request",
      data: null, // Trả về null nếu có lỗi
    };
  }
};

export const AcceptFriendRequest = async (
  userId: string
): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post(`/users/friend-request/accept/${userId}`);
    return {
      success: true,
      message: response.data.message,
      data: response.data.data || undefined, // Không có dữ liệu trả về
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add friend request",
      data: undefined, // Trả về null nếu có lỗi
    };
  }
};

export const DeclineFriendRequest = async (
  userId: string
): Promise<ApiResponse<User>> => {
  try {
    const response = await api.delete(
      `/users/friend-request/decline/${userId}`
    );
    return {
      success: true,
      message: response.data.message,
      data: response.data.data || undefined, // Không có dữ liệu trả về
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add friend request",
      data: undefined, // Trả về null nếu có lỗi
    };
  }
};
