import { ApiResponse } from "../types/ApiResponse";
import { Notification } from "../types/Notification";
import api from "./api";

export const getNotifications = async (): Promise<ApiResponse<Notification[]>> => {
  try {
    const response = await api.get(`/notifications`);
    return {
        success: true,
        message: response.data.message, // Thông điệp có thể tuỳ chỉnh
        data: response.data.data || [], // Dữ liệu bài viết
      };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: "Đã có lỗi xảy ra khi bình luận",
      data: [],
    };
  }
};

export const markAsAllRead = async (): Promise<ApiResponse<Notification[]>> => {
  try {
    const response = await api.put(`/notifications/mark-as-all-read`);
    return {
      success: true,
      message: response.data.message, // Thông điệp có thể tuỳ chỉnh
      data: response.data.data || [], // Dữ liệu bài viết
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: "Đã có lỗi xảy ra khi bình luận",
      data: [],
    };
  }
}