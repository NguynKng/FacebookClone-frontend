import api from "./api";
import { ApiResponse } from "../types/ApiResponse";
import { Comment } from "../types/Comment";

// Bình luận vào bài viết
export const createComment = async (
  postId: string,
  content: string
): Promise<ApiResponse<Comment>> => {
  try {
    const response = await api.post(`/comments/${postId}`, { content });
    return {
        success: true,
        message: response.data.message, // Thông điệp có thể tuỳ chỉnh
        data: response.data.data || undefined, // Dữ liệu bài viết
      };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: "Đã có lỗi xảy ra khi bình luận",
      data: {} as Comment,
    };
  }
};

// Phản hồi bình luận
export const replyToComment = async (
  postId: string,
  parentCommentId: string,
  content: string
): Promise<ApiResponse<Comment>> => {
  try {
    const response = await api.post(
      `/comments/reply/${postId}/${parentCommentId}`,
      { content }
    );
    return {
        success: true,
        message: response.data.message, // Thông điệp có thể tuỳ chỉnh
        data: response.data.data || undefined, // Dữ liệu bài viết
      };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: "Đã có lỗi khi phản hồi bình luận",
      data: {} as Comment,
    };
  }
};

// Lấy danh sách comment và reply theo postId
export const getCommentsByPostId = async (
  postId: string
): Promise<ApiResponse<Comment[]>> => {
  try {
    const response = await api.get(`/comments/${postId}`);
    return {
        success: true,
        message: response.data.message, // Thông điệp có thể tuỳ chỉnh
        data: response.data.data || [], // Dữ liệu bài viết
      };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: "Không thể tải danh sách bình luận",
      data: [],
    };
  }
};
