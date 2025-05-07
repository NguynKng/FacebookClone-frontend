import api from "./api";
import { ApiResponse } from "../types/ApiResponse";
import { newMessagePayload } from "../types/Message";

export const getRecentChats = async (): Promise<ApiResponse<newMessagePayload[]>> => {
  try {
    const response = await api.get("/messages");
    return {
      success: true,
      message: response.data.message, // Thông điệp có thể tuỳ chỉnh
      data: response.data.data || [], // Dữ liệu bài viết
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: "Đã có lỗi xảy ra khi lấy danh sách tin nhắn",
      data: [], // Mảng trống nếu có lỗi
    };
  }
};
