import { Ellipsis } from "lucide-react";
import { Link } from "react-router-dom";

const notifications = [
  {
    id: 1,
    content: "Người dùng Nguyễn Văn A vừa theo dõi bạn.",
    time: "2 phút trước",
    avatar: "/user.png",
  },
  {
    id: 2,
    content: "Bạn có lời mời kết bạn mới.",
    time: "10 phút trước",
    avatar: "/user.png",
  },
  {
    id: 3,
    content: "Bài viết của bạn vừa nhận được 5 lượt thích.",
    time: "1 giờ trước",
    avatar: "/user.png",
  },
  {
    id: 4,
    content: "Người dùng Trần Thị B bình luận về bài viết của bạn.",
    time: "2 giờ trước",
    avatar: "/user.png",
  },
  {
    id: 5,
    content: "Tài khoản của bạn đã được cập nhật thành công.",
    time: "3 giờ trước",
    avatar: "/user.png",
  },
  {
    id: 6,
    content: "Bình luận của bạn vừa nhận được phản hồi.",
    time: "4 giờ trước",
    avatar: "/user.png",
  },
  {
    id: 7,
    content: "Hôm nay là sinh nhật của bạn. Chúc mừng sinh nhật 🎉",
    time: "5 giờ trước",
    avatar: "/user.png",
  },
  {
    id: 8,
    content: "Có người đã đề cập đến bạn trong một bài viết.",
    time: "6 giờ trước",
    avatar: "/user.png",
  },
];

function DropdownNotification() {
  return (
    <div className="absolute right-0 top-[110%] bg-white rounded-xl shadow-xl z-50 p-4 custom-scroll min-w-92 h-[40rem] overflow-y-auto space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">Notifications</h1>
        <div className="bg-white hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer">
          <Ellipsis className="size-5 text-gray-500" />
        </div>  
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-blue-200 text-blue-500 rounded-full py-2 hover:opacity-75 cursor-pointer px-3 font-medium">All</div>
        <div className="text-black rounded-full hover:bg-gray-100 cursor-pointer py-2 px-3 font-medium">Unread</div>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-medium">Earlier</h1>
        <h1 className="text-blue-500 p-2 hover:bg-gray-100 rounded-md cursor-pointer">See all</h1>
      </div>
      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          Không có thông báo mới
        </div>
      ) : (
        notifications.map((noti) => (
          <Link to="#"
            key={noti.id}
            className={`
              flex gap-3 p-2 border-b border-gray-100 last:border-none rounded-xl
              transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50
            `}
          >
            <img
              src={noti.avatar}
              alt="avatar"
              className="size-16 rounded-full object-cover shadow-sm border border-blue-100"
            />
            <div className="self-center">
              <p className="text-sm text-gray-800 leading-tight">
                {noti.content.length > 100 ? `${noti.content.slice(0, 100)}...` : noti.content}
              </p>
              <span className="text-xs text-gray-500">{noti.time}</span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default DropdownNotification;
