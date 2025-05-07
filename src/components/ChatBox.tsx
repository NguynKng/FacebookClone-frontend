import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Send, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Friend } from "../types/Friend";
import Config from "../envVars";
import useAuthStore from "../store/authStore";
import { Message } from "../types/Message";
import { formatTimeToHourMinute } from "../utils/timeUtils";
import { newMessagePayload } from "../types/Message";

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
        (String(senderId) === String(currentUser._id) && String(receiverId) === String(userChat._id)) ||
        (String(senderId) === String(userChat._id) && String(receiverId) === String(currentUser._id));

      if (isRelevant) {
        setMessages((prev) => [...prev, {
          ...message,
          timestamp: new Date(message.timestamp),
        }]);
      }
      console.log("[RECEIVE MESSAGE]", message);
    };

    const handleNewMessage = (newMessage: newMessagePayload
    ) => {
        // ChatBox hiện tại thì chưa cần xử lý gì, có thể để console log cho dễ debug
        console.log('[NEW MESSAGE NOTIFY]', newMessage);
    };

    socket.on("loadChatHistory", handleLoadHistory);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("loadChatHistory", handleLoadHistory);
      socket.off("receiveMessage", handleReceiveMessage);
        socket.off("newMessage", handleNewMessage);
    };
  }, [socket, currentUser, userChat, onlineUsers]);

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
    <div className="fixed right-10 bottom-0 w-88 z-50">
      <div className="rounded-t-xl shadow-xl overflow-hidden bg-white border border-gray-200">
        <div className="px-4 py-2 font-semibold flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${userChat._id}`} className="relative rounded-full size-10">
              <img
                src={userChat.avatar ? `${Config.BACKEND_URL}${userChat.avatar}` : "/user.png"}
                className="object-cover size-full rounded-full"
              />
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </Link>
            <div>
                <Link to={`/profile/${userChat._id}`} className="text-base">
                {`${userChat.firstName} ${userChat.surname}`}
                </Link>
                {isOnline && (
                    <span className="text-green-500 block text-[13px]">Active now</span>
                )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
              onClick={handleMinimize}
            >
              <Minus />
            </button>
            <button
              className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
              onClick={onClose}
            >
              <X />
            </button>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ${
            isMinimized ? "max-h-0" : "max-h-[28rem]"
          }`}
        >
          <div className="flex flex-col gap-3 p-2 h-96 overflow-y-auto">
            {messages.map((msg) => {
                const isMyMessage: boolean = msg.senderId === currentUser?._id;
                return (
                <div key={msg._id} className={`flex gap-2 max-w-[75%] ${isMyMessage ? "self-end flex-row-reverse" : "self-start"}`}>
                    {!isMyMessage && (
                        <img src={`${Config.BACKEND_URL}${userChat.avatar}`} 
                        alt={`${userChat.firstName} ${userChat.surname}`}
                        className="w-8 h-8 rounded-full object-cover self-end"
                    />
                    )}
                    <div className="flex flex-col gap-1">
                        <span className={`text-gray-500 text-xs ${isMyMessage ? "self-end" : "self-start"}`}>
                            {formatTimeToHourMinute(msg.timestamp)}
                        </span>
                        <p className={`p-2 rounded-lg text-sm ${isMyMessage ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                            {msg.text}
                        </p>
                    </div>
                </div>
                );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="p-2 flex items-center gap-2 border-t border-gray-200"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Enter message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-300"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer"
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
