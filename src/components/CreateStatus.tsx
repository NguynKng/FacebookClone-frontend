import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import useAuthStore from "../store/authStore";
import Config from "../envVars";
import { Link } from "react-router-dom";

function CreateStatus() {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="px-4 bg-white rounded-lg">
        <div className="flex items-center gap-2 py-4 border-b-2 border-gray-200">
          <Link to={`/profile/${user?._id}`} className="rounded-full size-10">
            <img
              src={
                user?.avatar
                  ? `${Config.BACKEND_URL}${user.avatar}`
                  : "/user.png"
              }
              alt="user-avatar"
              className="object-cover rounded-full size-full border-2 border-gray-300 cursor-pointer hover:opacity-[110%]"
            />
          </Link>
          <div
            className="py-2 px-4 rounded-full bg-gray-100 w-full hover:bg-gray-200 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-gray-500 text-[1.1rem]">{`What's on your mind, ${user?.firstName} ${user?.surname}`}</span>
          </div>
        </div>
        <div className="flex items-center py-2">
          <div
            className="flex flex-wrap items-center justify-center w-1/3 gap-2 hover:bg-gray-100 cursor-pointer rounded-md py-2 px-4"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src="/video-player.png"
              className="object-cover size-6"
              alt="video-player"
            />
            <span className="text-gray-600 text-center">Live video</span>
          </div>
          <div
            className="flex flex-wrap items-center justify-center w-1/3 gap-2 hover:bg-gray-100 cursor-pointer rounded-md py-2 px-4"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src="/photos.png"
              className="object-cover size-6"
              alt="video-player"
            />
            <span className="text-gray-600 text-center">Photo / video</span>
          </div>
          <div
            className="flex flex-wrap items-center justify-center w-1/3 gap-2 hover:bg-gray-100 cursor-pointer rounded-md py-2 px-4"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src="/smiling-face.png"
              className="object-cover size-6"
              alt="video-player"
            />
            <span className="text-gray-600 text-center">Feeling / activity</span>
          </div>
        </div>
      </div>
      {/* Modal tạo bài viết */}
      {isModalOpen && <CreatePostModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

export default CreateStatus;
