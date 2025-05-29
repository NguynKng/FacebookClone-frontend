import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Config from "../envVars";
import useAuthStore from "../store/authStore";
import { useGetUserProfile } from "../hooks/useProfile";
import { AcceptFriendRequest, DeclineFriendRequest } from "../services/userApi";
import SpinnerLoading from "../components/SpinnerLoading";
import { Friend } from "../types/Friend";
import ChatBox from "../components/ChatBox";

const FriendPage = () => {
  const { user, updateUser } = useAuthStore();
  const { profile, loading } = useGetUserProfile(user?._id || "");
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const [showChat, setShowChat] = useState(false); // giữ nguyên qua các route
  const [activeChatUser, setActiveChatUser] = useState<Friend>();
  const handleToggleChat = (friend: Friend) => {
    setActiveChatUser(friend);
    setShowChat(true); // ensure ChatBox shows when a friend is clicked
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setActiveChatUser(undefined);
  };

  useEffect(() => {
    if (profile?.friendRequests) {
      setFriendRequests(profile.friendRequests);
    }
  }, [profile]);

  const handleAcceptFriendRequest = async (UserId: string) => {
    try {
      const response = await AcceptFriendRequest(UserId || "");
      if (!response.success) {
        toast.error("Failed to accept friend request.");
        return;
      }
      updateUser({
        friends: response?.data?.friends,
        friendRequests: response?.data?.friendRequests,
      });
      // Cập nhật UI tại local
      setFriendRequests((prev) => prev.filter((r) => r._id !== UserId));
      toast.success("Friend request accepted successfully!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Failed to accept friend request.");
    }
  };

  const handleDeclineFriendRequest = async (UserId: string) => {
    try {
      const response = await DeclineFriendRequest(UserId || "");
      if (!response.success) {
        toast.error("Failed to decline friend request.");
        return;
      }
      updateUser({ friendRequests: response?.data?.friendRequests });
      setFriendRequests((prev) => prev.filter((r) => r._id !== UserId));
      toast.success("Friend request declined successfully!");
    } catch (error) {
      console.error("Error declining friend request:", error);
      toast.error("Failed to decline friend request.");
    }
  };

  return (
    <>
      <Header onToggleChat={handleToggleChat} />
      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-transparent">
          <SpinnerLoading />
        </div>
      ) : (
        <div className="dark:bg-[rgb(16,16,16)] mt-[8vh] min-h-[92vh]">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 dark:text-white">
              Friend Requests ({friendRequests.length})
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
              {friendRequests.length === 0 ? (
                <p className="text-gray-500 col-span-full dark:text-white">
                  Không có lời mời nào
                </p>
              ) : (
                friendRequests.map((requester) => (
                  <div
                    key={requester._id}
                    className="bg-white dark:bg-[rgb(36,36,36)] rounded-xl shadow-sm hover:shadow-md transition duration-300 p-4 flex flex-col items-center text-center"
                  >
                    <Link
                      to={`/profile/${requester._id}`}
                      className="flex flex-col items-center"
                    >
                      <img
                        src={
                          requester.avatar
                            ? `${Config.BACKEND_URL}${requester.avatar}`
                            : "/user.png"
                        }
                        alt={`${requester.firstName} avatar`}
                        className="w-24 h-24 rounded-full object-cover mb-3"
                      />
                      <p className="text-sm font-semibold text-gray-900 mb-2 dark:text-white">
                        {`${requester.firstName} ${requester.surname}`}
                      </p>
                    </Link>

                    <button
                      className="text-sm font-medium bg-[#1b74e4] hover:bg-[#155fc3] text-white px-4 py-2 rounded-md w-full mb-2 transition cursor-pointer"
                      onClick={() => handleAcceptFriendRequest(requester._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="text-sm font-medium border border-gray-300 text-gray-800 dark:bg-[rgb(36,36,36)] hover:bg-gray-100 px-4 py-2 rounded-md w-full transition cursor-pointer dark:text-white dark:hover:bg-[rgb(36,36,36)]"
                      onClick={() => handleDeclineFriendRequest(requester._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-8 dark:text-white">
              People you may know
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              This feature may available soon...
            </p>
          </div>
          {showChat && activeChatUser && (
            <ChatBox userChat={activeChatUser} onClose={handleCloseChat} />
          )}
        </div>
      )}
    </>
  );
};

export default FriendPage;
