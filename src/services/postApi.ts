import api from "./api";
import { ApiResponse } from "../types/ApiResponse";
import { Post } from "../types/Post";
import { Reaction } from "../types/Reaction";

export const createPost = (formData: FormData) =>
  api.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });


export const getPostById = async (
  PostId: string
): Promise<ApiResponse<Post>> => {
  try {
    const response = await api.get(`/posts/${PostId}`);

    // Giả sử response.data.posts chứa mảng bài viết
    return {
      success: true,
      message: response.data.message, // Thông điệp có thể tuỳ chỉnh
      data: response.data.data || {}, // Dữ liệu bài viết
    };
  } catch (error: any) {
    // Trong trường hợp có lỗi, bạn trả về thông báo lỗi
    return {
      success: false,
      message: error.message || "Failed to fetch posts",
      data: {} as Post, // Mảng trống nếu có lỗi
    };
  }
};


export const getPostByUserId = async (
  UserId: string
): Promise<ApiResponse<Post[]>> => {
  try {
    const response = await api.get(`/posts/user/${UserId}`);

    // Giả sử response.data.posts chứa mảng bài viết
    return {
      success: true,
      message: response.data.message, // Thông điệp có thể tuỳ chỉnh
      data: response.data.data || [], // Dữ liệu bài viết
    };
  } catch (error: any) {
    // Trong trường hợp có lỗi, bạn trả về thông báo lỗi
    return {
      success: false,
      message: error.message || "Failed to fetch posts",
      data: [], // Mảng trống nếu có lỗi
    };
  }
};

export const getAllPost = async (): Promise<ApiResponse<Post[]>> => {
  try {
    const response = await api.get(`/posts`);

    // Giả sử response.data.posts chứa mảng bài viết
    return {
      success: true,
      message: response.data.message, // Thông điệp có thể tuỳ chỉnh
      data: response.data.data || [], // Dữ liệu bài viết
    };
  } catch (error: any) {
    // Trong trường hợp có lỗi, bạn trả về thông báo lỗi
    return {
      success: false,
      message: error.message || "Failed to fetch posts",
      data: [], // Mảng trống nếu có lỗi
    };
  }
};

export const reactToPost = async (
  postId: string,
  type: string
): Promise<ApiResponse<Reaction>> => {
  try {
    const response = await api.post(`/posts/react`, { postId, type });
    return {
      success: true,
      message: response.data.message, // Thông điệp có thể tuỳ chỉnh
      data: response.data.data || {}, // Dữ liệu thả cảm xúc
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: "Đã có lỗi xảy ra khi thả cảm xúc",
      data: {} as Reaction,
    };
  }
};

export const deletePost = async (
  postId: string
): Promise<ApiResponse<Post>> => {
  try {
    const response = await api.delete(`/posts/${postId}`);
    return {
      success: true,
      message: response.data.message,
      data: response.data.data || {}, // Dữ liệu bài viết đã xóa
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: "Đã có lỗi xảy ra khi xóa bài viết",
      data: {} as Post,
    };
  }
};
