import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { User, RegisterData } from "../types/User";
import {
  registerUser,
  loginUser,
  loadUserProfile,
  verifyUserEmail,
} from "../services/authApi";
import { uploadAvatar, uploadCoverPhoto } from "../services/userApi";
import { createPost as createPostApi } from "../services/postApi";
import { Socket, io } from "socket.io-client";
import Config from "../envVars";
import { Post } from "../types/Post";

const createSocketConnection = () => {
  return io(Config.BACKEND_URL as string, {
    withCredentials: true,
    transports: ["websocket"],
  });
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  socket: Socket | null;
  onlineUsers: string[];
  theme: string;
  sse: EventSource | null;

  register: (userData: RegisterData) => Promise<boolean>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;

  connectSocket: () => void;
  disconnectSocket: () => void;

  updateUser: (userData: Partial<User>) => void;

  setAvatar: (file: File) => Promise<string | null>;
  setCoverPhoto: (file: File) => Promise<string | null>;
  createPost: (content: string, images?: File[]) => Promise<Post>;

  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  toggleTheme: () => void;
  verifyEmail: (email: string, code: string) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      socket: null,
      onlineUsers: [],
      theme: "light",
      sse: null,
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => {
        if (error) toast.error(error);
        set({ error });
      },
      clearError: () => set({ error: null }),

      connectSocket: () => {
        const socket = createSocketConnection();
        socket.on("connect", () => {
          console.log("[SOCKET CONNECTED]", socket.id);
          const userId = get().user?._id;
          if (userId) {
            socket.emit("setup", userId);
          }
          socket.on("getOnlineUsers", (onlineUsers: string[]) => {
            set({ onlineUsers });
          });
        });
        set({ socket });
      },

      disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
          socket.disconnect();
          set({ socket: null });
        }
      },
      verifyEmail: async (email, code) => {
        try {
          set({ isLoading: true, error: null });
          const response = await verifyUserEmail(email, code);
          if (response.data.success) {
            const { token, user } = response.data;

            set({
              token,
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            get().connectSocket();
            toast.success(
              `Email verified successfully! Welcome aboard, ${user.firstName} ${user.surname}!`
            );
          } else {
            const message = response.data.message;
            set({ isLoading: false, error: message });
            toast.error(message);
          }
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message || "Email verification failed";
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            token: null,
            user: null,
          });
          toast.error(errorMessage);
        }
      },
      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await registerUser(userData);
          if (response.data.success) {
            set({ isLoading: false }); // <-- Dừng loading sau khi thành công
            return true;
          } else {
            const message = response.data.message;
            set({ isLoading: false, error: message });
            toast.error(message);
            return false;
          }
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message || "Registration failed";
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            token: null,
            user: null,
          });
          toast.error(errorMessage);
          return false;
        }
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await loginUser(email, password);
          const { token, user } = response.data;

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          get().connectSocket();
          toast.success(`Welcome back, ${user.firstName} ${user.surname}!`);
        } catch (err: any) {
          console.log(err);
          const errorMessage = err.response?.data?.message || "Login failed";
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            token: null,
            user: null,
          });
          toast.error(errorMessage);
        }
      },

      loadUser: async () => {
        const token = get().token;
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }
        try {
          set({ isLoading: true });
          const response = await loadUserProfile();
          const user = response.data.data;
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          if (!get().socket) {
            get().connectSocket();
          }
        } catch (err) {
          const errorMessage = "Session expired. Please login again.";
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          toast.error(errorMessage);
        }
      },

      logout: () => {
        get().disconnectSocket();
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          socket: null,
          error: null,
        });

        toast.success("Logged out successfully");
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (!currentUser) {
          toast.error("No user found to update.");
          return;
        }

        const updatedUser = { ...currentUser, ...userData };
        set({ user: updatedUser });
      },

      setAvatar: async (file) => {
        try {
          set({ isLoading: true, error: null });
          const token = get().token;
          if (!token) {
            set({
              isLoading: false,
              error: "You must be logged in to upload an avatar",
              isAuthenticated: false,
            });
            return null;
          }

          const formData = new FormData();
          formData.append("avatar", file);

          const response = await uploadAvatar(formData);
          if (get().user) {
            const currentUser = get().user as User;
            const updatedUser: User = {
              ...currentUser,
              avatar: response.data.data.avatar,
            };
            set({ user: updatedUser, isLoading: false });
            toast.success("Avatar updated successfully");
            return response.data.data.avatar;
          }
          set({ isLoading: false });
          return null;
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message || "Failed to upload avatar";
          set({ isLoading: false, error: errorMessage });
          toast.error(errorMessage);
          return null;
        }
      },

      setCoverPhoto: async (file) => {
        try {
          set({ isLoading: true, error: null });
          const token = get().token;
          if (!token) {
            set({
              isLoading: false,
              error: "You must be logged in to upload a cover photo",
              isAuthenticated: false,
            });
            return null;
          }

          const formData = new FormData();
          formData.append("coverPhoto", file);

          const response = await uploadCoverPhoto(formData);
          if (get().user) {
            const currentUser = get().user as User;
            const updatedUser: User = {
              ...currentUser,
              coverPhoto: response.data.data.coverPhoto,
            };
            set({ user: updatedUser, isLoading: false });
            toast.success("Cover photo updated successfully");
            return response.data.data.coverPhoto;
          }
          set({ isLoading: false });
          return null;
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message || "Failed to upload cover photo";
          set({ isLoading: false, error: errorMessage });
          toast.error(errorMessage);
          return null;
        }
      },

      createPost: async (content, images = []) => {
        try {
          const token = get().token;
          if (!token) {
            set({
              isLoading: false,
              error: "You must be logged in to create a post",
            });
            return;
          }

          const formData = new FormData();
          formData.append("content", content);
          images.forEach((img) => {
            formData.append("images", img);
          });

          const response = await createPostApi(formData);

          if (response.data.success) {
            toast.success(response.data.message);
            return response.data.data;
          } else {
            toast.error(response.data.message);
            return null;
          }
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message || "Failed to create post";
          set({ error: errorMessage });
          toast.error(errorMessage);
          return null;
        }
      },
    }),
    {
      name: "facebook-clone-auth",
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        theme: state.theme,
      }),
    }
  )
);

export default useAuthStore;
