import { Ellipsis, Expand, Search, SquarePen } from "lucide-react";
import { Friend } from "../types/Friend";
import { useGetRecentChats } from "../hooks/useMessage";
import Config from "../envVars";
import { formatTimeToDateOrHour } from "../utils/timeUtils";
import SpinnerLoading from "./SpinnerLoading";
import useAuthStore from "../store/authStore";

function DropdownChat({
  onToggleChat,
}: {
  onToggleChat: (userChat: Friend) => void;
}) {
  const { messages, loading } = useGetRecentChats();
    const { onlineUsers } = useAuthStore();

  return (
    <div className="absolute top-[110%] right-0 min-w-92 rounded-lg shadow-lg border-2 border-transparent dark:bg-[rgb(35,35,35)] bg-white p-3 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold dark:text-white">Chats</h1>
        <div className="flex items-center gap-2">
          <div className="bg-transparent hover:bg-gray-200 dark:hover:bg-[rgb(52,52,52)] rounded-full size-8 flex items-center justify-center cursor-pointer">
            <Ellipsis className="size-5 text-gray-500" />
          </div>
          <div className="bg-transparent hover:bg-gray-200 dark:hover:bg-[rgb(52,52,52)] rounded-full size-8 flex items-center justify-center cursor-pointer">
            <Expand className="size-5 text-gray-500" />
          </div>
          <div className="bg-transparent hover:bg-gray-200 dark:hover:bg-[rgb(52,52,52)] rounded-full size-8 flex items-center justify-center cursor-pointer">
            <SquarePen className="size-5 text-gray-500" />
          </div>
        </div>
      </div>
      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute size-5 top-2.5 left-3 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search Messenger"
          className="text-gray-900 w-full py-2 pl-10 bg-gray-100 dark:bg-[rgb(52,52,53)] rounded-full focus:outline-none text-sm dark:placeholder:text-gray-300"
        />
      </div>
      {/* Tabs */}
      <div className="flex items-center gap-2">
        <h1 className="py-2 px-3 bg-blue-300 font-medium hover:bg-blue-400 dark:hover:bg-blue-400 cursor-pointer text-blue-500 rounded-full">
          Inbox
        </h1>
        <h1 className="py-2 px-3 bg-transparent font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-[rgb(52,52,52)] text-black dark:text-white rounded-full">
          Communities
        </h1>
      </div>
      {/* Chat List */}
      <div className="space-y-2 h-[26rem] overflow-y-auto">
        {loading ? (
          <SpinnerLoading />
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-2 px-4">
            No recent chats
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.participant._id}
              className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-[rgb(52,52,52)] rounded-lg px-2 py-2 cursor-pointer transition"
              onClick={() => onToggleChat(message.participant)}
            >
                <div className="relative size-10 rounded-full">
                    <img
                        src={message.participant.avatar ? `${Config.BACKEND_URL}${message.participant.avatar}` : "/user.png"}
                        alt={`user avatar`}
                        className="size-full rounded-full object-cover"
                    />
                    {onlineUsers.includes(message.participant._id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold dark:text-white">{`${message.participant.firstName} ${message.participant.surname}`}</h2>
                <p className="text-xs text-gray-500 truncate dark:text-white">
                  {message?.lastMessage?.isSentByMe ? "You: " : ""}
                  {message?.lastMessage?.text.length > 30
                    ? `${message?.lastMessage?.text.slice(0, 30)}...`
                    : message?.lastMessage?.text}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {formatTimeToDateOrHour(message.lastMessage.timestamp)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DropdownChat;
