import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Send, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Friend } from "../types/Friend";
import Config from "../envVars";
import useAuthStore from "../store/authStore";
import { Message } from "../types/Message";
import {
  formatTimeToHourMinute,
  formatTimeToDateAndHour,
} from "../utils/timeUtils";
import { newMessagePayload } from "../types/Message";
import { useGetRecentChats } from "../hooks/useMessage";

function ChatBox({
  onClose,
  userChat,
}: {
  onClose: () => void;
  userChat: Friend;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const { user: currentUser, socket, onlineUsers } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOnline, setIsOnline] = useState(false);
  const { updateMessage } = useGetRecentChats();

  useEffect(() => {
    if (!socket || !currentUser || !userChat) return;
    setIsOnline(onlineUsers.includes(userChat._id));

    // 🚀 Emit load lịch sử khi mở ChatBox
    socket.emit("loadChatHistory", {
      userId1: currentUser._id,
      userId2: userChat._id,
    });

    const handleLoadHistory = (history: Message[]) => {
      if (Array.isArray(history)) {
        const formatted = history.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(formatted);
      }
    };

    const handleReceiveMessage = (message: Message) => {
      const { senderId, receiverId } = message;
      const isRelevant =
        (String(senderId) === String(currentUser._id) &&
          String(receiverId) === String(userChat._id)) ||
        (String(senderId) === String(userChat._id) &&
          String(receiverId) === String(currentUser._id));

      if (isRelevant) {
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            timestamp: new Date(message.timestamp),
          },
        ]);
      }
      console.log("[RECEIVE MESSAGE]", message);
    };

    const handleNewMessage = (newMessage: newMessagePayload) => {
      // ChatBox hiện tại thì chưa cần xử lý gì, có thể để console log cho dễ debug
      console.log("[NEW MESSAGE NOTIFY]", newMessage);
      updateMessage(newMessage, newMessage.senderId == currentUser._id); // Cập nhật lại danh sách tin nhắn
    };

    socket.on("loadChatHistory", handleLoadHistory);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("loadChatHistory", handleLoadHistory);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, currentUser, userChat, onlineUsers, updateMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!message.trim() || !currentUser || !socket) return;

    const data: Message = {
      _id: "", // ID sẽ được gán từ server
      senderId: currentUser._id,
      receiverId: userChat._id,
      text: message.trim(),
      timestamp: new Date(),
    };

    socket.emit("sendMessage", data);
    setMessage("");
  }, [message, currentUser, socket, userChat._id]);

  const handleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };
  return (
    <div className="fixed right-4 bottom-0 w-96 z-50 shadow-2xl">
      <div className="rounded-t-xl overflow-hidden bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
        {/* Header */}
        <div className="px-4 py-2 font-medium flex justify-between items-center bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${userChat._id}`} className="relative">
              <img
                src={
                  userChat.avatar
                    ? `${Config.BACKEND_URL}${userChat.avatar}`
                    : "/user.png"
                }
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </Link>
            <div className="leading-tight">
              <Link
                to={`/profile/${userChat._id}`}
                className="text-base font-semibold hover:underline"
              >
                {`${userChat.firstName} ${userChat.surname}`}
              </Link>
              {isOnline && (
                <p className="text-green-200 text-sm">Đang hoạt động</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleMinimize}
              className="hover:bg-white/20 p-1 rounded-full transition cursor-pointer"
            >
              <Minus size={18} />
            </button>
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-1 rounded-full transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          className={`transition-all duration-300 ${
            isMinimized ? "max-h-0" : "max-h-[30rem]"
          }`}
        >
          <div className="flex flex-col gap-3 px-3 py-2 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400">
            {messages.map((msg, index) => {
              const isMyMessage = msg.senderId === currentUser?._id;
              const currentDate = msg.timestamp.toDateString();
              const prevDate =
                index > 0 ? messages[index - 1].timestamp.toDateString() : null;
              const shouldShowDate = currentDate !== prevDate;

              return (
                <div key={msg._id + index}>
                  {shouldShowDate && (
                    <div className="text-center text-xs text-gray-500 mb-2 mt-1">
                      {formatTimeToDateAndHour(msg.timestamp)}
                    </div>
                  )}
                  <div
                    className={`flex gap-2 ${
                      isMyMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMyMessage && (
                      <img
                        src={
                          userChat.avatar
                            ? `${Config.BACKEND_URL}${userChat.avatar}`
                            : "/user.png"
                        }
                        className="w-8 h-8 rounded-full object-cover self-start"
                      />
                    )}
                    <div
                      className={`flex flex-col max-w-[75%] ${
                        isMyMessage
                          ? "self-end items-end"
                          : "self-start items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm break-words ${
                          isMyMessage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-[rgb(52,52,52)] dark:text-white"
                        }`}
                        style={{
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word",
                        }}
                      >
                        {msg.text}
                      </div>
                      <span
                        className={`text-xs mt-1 text-gray-400 ${
                          isMyMessage ? "pr-1" : "pl-1"
                        }`}
                      >
                        {formatTimeToHourMinute(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
