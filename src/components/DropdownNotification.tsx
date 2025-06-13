import { Ellipsis } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetNotifications } from "../hooks/useNotification";
import { useEffect } from "react";
import Config from "../envVars";
import { formatTime } from "../utils/timeUtils";
import SpinnerLoading from "./SpinnerLoading";
import useNotificationStore from "../store/notificationStore";
import useAuthStore from "../store/authStore";
import { Notification } from "../types/Notification";

function DropdownNotification() {
  const { sse } = useAuthStore();
  const { loading, notifications } = useGetNotifications();
  const { markAsAllRead } = useNotificationStore();

  const getLink = (noti: Notification) => {
    const enumPostType = ["new_post", "comment_post", "react_post"];
    const enumFriendType = ["friend_request", "accepted_request"];
    if (enumPostType.includes(noti.type) && noti.post) {
      return `/posts/${noti.post}`;
    } else if (enumFriendType.includes(noti.type) && noti.actor) {
      return `/profile/${noti.actor._id}`;
    } else {
      return "#";
    }
  };

  useEffect(() => {
    markAsAllRead();
  }, [sse, markAsAllRead]);

  return (
    <div className="absolute right-0 top-[110%] bg-white rounded-xl shadow-xl z-50 p-4 custom-scroll min-w-92 h-[42rem] overflow-y-auto space-y-2 dark:bg-[rgb(35,35,35)]">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl dark:text-white">
          Notifications
        </h1>
        <div className="bg-transparent hover:bg-gray-200 dark:hover:bg-[rgb(52,52,52)] rounded-full size-8 flex items-center justify-center cursor-pointer">
          <Ellipsis className="size-5 text-gray-500" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-blue-300 text-blue-500 rounded-full py-2 hover:opacity-75 cursor-pointer px-3 font-medium">
          All
        </div>
        <div className="text-black dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-[rgb(52,52,52)] cursor-pointer py-2 px-3 font-medium">
          Unread
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-medium dark:text-white">Earlier</h1>
        <h1 className="text-blue-500 p-2 hover:bg-gray-100 rounded-md cursor-pointer dark:hover:bg-[rgb(52,52,52)]">
          See all
        </h1>
      </div>
      {loading ? (
        <SpinnerLoading />
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          Không có thông báo mới
        </div>
      ) : (
        notifications.map((noti) => (
          <Link
            to={getLink(noti)}
            key={noti._id}
            className={`
              flex gap-3 p-2 last:border-none rounded-xl
              transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-lg dark:hover:bg-[rgb(56,56,56)]
            `}
          >
            <img
              src={
                noti.actor.avatar
                  ? `${Config.BACKEND_URL}${noti.actor.avatar}`
                  : "/user.png"
              }
              alt="avatar"
              className="size-16 rounded-full object-cover shadow-sm border border-blue-100"
            />
            <div className="flex-1">
              <p className="text-base leading-tight">
                <span className="dark:text-white font-medium">{`${noti.actor.firstName} ${noti.actor.surname} `}</span>
                <span className="dark:text-gray-300 text-gray-800">{`${noti.content}`}</span>
              </p>
              <span className="text-xs text-gray-500">
                {formatTime(noti.createdAt)}
              </span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default DropdownNotification;
