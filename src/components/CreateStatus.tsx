import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import useAuthStore from "../store/authStore";
import Config from "../envVars";
import { Link } from "react-router-dom";
import { Post } from "../types/Post";

function CreateStatus({ onPostCreated }: { onPostCreated: (post: Post) => void }) {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="px-4 bg-white dark:bg-[rgb(35,35,35)] rounded-lg">
        <div className="flex items-center gap-2 py-4 border-b-[1px] border-gray-200 dark:border-gray-500">
          <Link to={`/profile/${user?._id}`} className="rounded-full size-12">
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
            className="py-2 px-4 rounded-full bg-gray-100 dark:bg-[rgb(52,52,53)] w-full dark:hover:bg-[rgb(56,56,56)] hover:bg-gray-200 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-gray-500 dark:text-gray-400 text-lg">{`What's on your mind, ${user?.firstName}?`}</span>
          </div>
        </div>
        <div className="flex items-center py-2">
          <div
            className="flex flex-wrap items-center justify-center w-1/3 gap-2 hover:bg-gray-100 dark:hover:bg-[rgb(56,56,56)] cursor-pointer rounded-md py-2 px-4"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src="/video-player.png"
              className="object-cover size-6"
              alt="video-player"
            />
            <span className="text-gray-600 text-center dark:text-gray-400">Live video</span>
          </div>
          <div
            className="flex flex-wrap items-center justify-center w-1/3 gap-2 hover:bg-gray-100 dark:hover:bg-[rgb(56,56,56)] cursor-pointer rounded-md py-2 px-4"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src="/photos.png"
              className="object-cover size-6"
              alt="video-player"
            />
            <span className="text-gray-600 text-center dark:text-gray-400">Photo / video</span>
          </div>
          <div
            className="flex flex-wrap items-center justify-center w-1/3 gap-2 hover:bg-gray-100 dark:hover:bg-[rgb(56,56,56)] cursor-pointer rounded-md py-2 px-4"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src="/smiling-face.png"
              className="object-cover size-6"
              alt="video-player"
            />
            <span className="text-gray-600 text-center dark:text-gray-400">
              Feeling / activity
            </span>
          </div>
        </div>
      </div>
      {/* Modal tạo bài viết */}
      {isModalOpen && (
        <CreatePostModal
          onClose={() => setIsModalOpen(false)}
          onPostCreated={onPostCreated}
        />
      )}
    </>
  );
}

export default CreateStatus;
