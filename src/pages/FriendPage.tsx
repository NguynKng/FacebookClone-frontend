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

const FriendPage = () => {
    const { user, updateUser } = useAuthStore();
    const { profile, loading } = useGetUserProfile(user?._id || "");
    const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
    
    useEffect(() => {
        if (profile?.friendRequests) {
            setFriendRequests(profile.friendRequests);
        }
    }, [profile]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-200">
                <SpinnerLoading />
            </div>
        );
    }

    const handleAcceptFriendRequest = async (UserId: string) => {
        try {
            const response = await AcceptFriendRequest(UserId || "");
            if (!response.success) {
                toast.error("Failed to accept friend request.");
                return;
            }
            updateUser({ friends: response?.data?.friends, friendRequests: response?.data?.friendRequests });
            // Cập nhật UI tại local
        setFriendRequests((prev) =>
            prev.filter((r) => r._id !== UserId)
        );
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
            setFriendRequests((prev) =>
                prev.filter((r) => r._id !== UserId)
            );
          toast.success("Friend request declined successfully!");
        } catch (error) {
          console.error("Error declining friend request:", error);
          toast.error("Failed to decline friend request.");
        }
      };


  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 mt-[10vh] py-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Friend Requests ({friendRequests.length})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
          {friendRequests.length === 0 ? (
            <p className="text-gray-500 col-span-full">Không có lời mời nào</p>
          ) : (
            friendRequests.map((requester) => (
              <div
                key={requester._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 p-4 flex flex-col items-center text-center"
              >
                <Link to={`/profile/${requester._id}`} className="flex flex-col items-center">
                  <img
                    src={
                      requester.avatar
                        ? `${Config.BACKEND_URL}${requester.avatar}`
                        : "/user.png"
                    }
                    alt={`${requester.firstName} avatar`}
                    className="w-24 h-24 rounded-full object-cover mb-3"
                  />
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    {`${requester.firstName} ${requester.surname}`}
                  </p>
                </Link>

                <button
                  className="text-sm font-medium bg-[#1b74e4] hover:bg-[#155fc3] text-white px-4 py-2 rounded-md w-full mb-2 transition cursor-pointer" onClick={() => handleAcceptFriendRequest(requester._id)}
                >
                  Accept
                </button>
                <button
                  className="text-sm font-medium border border-gray-300 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md w-full transition cursor-pointer" onClick={() => handleDeclineFriendRequest(requester._id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          People you may know
        </h2>
        <p className="text-gray-500">This feature may available soon...</p>
      </div>
    </>
  );
};

export default FriendPage;
