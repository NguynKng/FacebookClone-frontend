import { useEffect, useState } from "react";
import Meta from "../components/Meta";
import {
  ChevronDown,
  Ellipsis,
  Plus,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";
import CreateStatus from "../components/CreateStatus";
import PostCard from "../components/PostCard";
import { Link, useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import ImageUploader from "../components/ImageUploader";
import Config from "../envVars";
import { useGetUserPosts } from "../hooks/usePost";
import { useGetUserProfile } from "../hooks/useProfile";
import SpinnerLoading from "../components/SpinnerLoading";
import {
  AddFriendRequest,
  AcceptFriendRequest,
  CancelFriendRequest,
  DeclineFriendRequest,
  DeleteFriend,
} from "../services/userApi";
import toast from "react-hot-toast";
import { Friend } from "../types/Friend";
import ChatBox from "../components/ChatBox";
import { Post } from "../types/Post";

function ProfilePage() {
  const [isFriend, setIsFriend] = useState(false);
  const [hasSentFriendRequest, setHasSentFriendRequest] = useState(false);
  const [isReceivingFriendRequest, setIsReceivingFriendRequest] =
    useState(false);
  const [isOpenFriendsDropdown, setIsOpenFriendsDropdown] = useState(false);
  const { UserId } = useParams();
  const [activeTab, setActiveTab] = useState("Posts");
  const { user, isLoading, setAvatar, setCoverPhoto, updateUser } =
    useAuthStore();
  const isMyProfile = user?._id === UserId;
  const { profile } = useGetUserProfile(UserId || "");
  const displayedUser = isMyProfile ? user : profile;
  const { posts, setPosts, loading } = useGetUserPosts(UserId || "");
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

  const tabs = [
    { name: "Posts" },
    { name: "About" },
    { name: "Friends" },
    { name: "Photos" },
    { name: "Videos" },
    { name: "Check-ins" },
  ];

  useEffect(() => {
    if (!user || !profile) return;
    const isFriendNow = (user.friends || []).includes(profile._id);
    const hasSent = (profile.friendRequests || []).some(
      (r) => r._id === user._id
    );
    const isReceiving = (user.friendRequests || []).includes(profile._id);

    setIsFriend(isFriendNow); // <-- dùng ở đây
    setHasSentFriendRequest(hasSent);
    setIsReceivingFriendRequest(isReceiving);
  }, [user, profile]);
  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleRemovePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  const handleAvatarUpload = async (file: File) => {
    await setAvatar(file);
  };

  const handleCoverPhotoUpload = async (file: File) => {
    await setCoverPhoto(file);
  };

  const handleDeleteFriend = async () => {
    try {
      const response = await DeleteFriend(UserId || "");
      if (!response.success) {
        toast.error("Failed to delete friend.");
        return;
      }
      updateUser({
        friends: response?.data?.friends,
      });
      setIsFriend(false);
      toast.success("Friend deleted successfully!");
    } catch (error) {
      console.error("Error deleting friend:", error);
      toast.error("Failed to delete friend.");
    }
  };

  const handleAddFriendRequest = async () => {
    try {
      const response = await AddFriendRequest(UserId || "");
      if (!response.success) {
        toast.error("Failed to send friend request.");
        return;
      }
      setHasSentFriendRequest(true);
      toast.success("Friend request sent successfully!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request.");
    }
  };

  const handleAcceptFriendRequest = async () => {
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
      setIsFriend(true);
      setIsReceivingFriendRequest(false);
      toast.success("Friend request accepted successfully!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Failed to accept friend request.");
    }
  };

  const handleCancelFriendRequest = async () => {
    try {
      const response = await CancelFriendRequest(UserId || "");
      if (!response.success) {
        toast.error("Failed to cancel friend request.");
        return;
      }
      setHasSentFriendRequest(false);
      toast.success("Friend request canceled successfully!");
    } catch (error) {
      console.error("Error canceling friend request:", error);
      toast.error("Failed to cancel friend request.");
    }
  };

  const handleDeclineFriendRequest = async () => {
    try {
      const response = await DeclineFriendRequest(UserId || "");
      if (!response.success) {
        toast.error("Failed to decline friend request.");
        return;
      }
      updateUser({ friendRequests: response?.data?.friendRequests });
      setIsReceivingFriendRequest(false);
      toast.success("Friend request declined successfully!");
    } catch (error) {
      console.error("Error declining friend request:", error);
      toast.error("Failed to decline friend request.");
    }
  };

  if (!displayedUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SpinnerLoading />;
      </div>
    );
  }

  return (
    <>
      <Meta title="Facebook" />
      {/*Section 1*/}
      <div className="w-full">
        <section className="lg:px-[15%] dark:bg-[rgb(52,52,52)] w-full">
          <div className="relative w-full h-[38rem]">
            {/*Cover Photo*/}
            <div className="relative w-full h-[71%] rounded-b-md">
              <img
                src={
                  displayedUser?.coverPhoto
                    ? `${Config.BACKEND_URL}${displayedUser?.coverPhoto}`
                    : "/background-gray.avif"
                }
                className="w-full h-full rounded-b-md object-cover"
                alt="Cover photo"
              />
              {/* Cover Photo Upload Button */}
              {isMyProfile && (
                <div className="absolute top-4 right-8 z-31">
                  <ImageUploader
                    onFileSelect={handleCoverPhotoUpload}
                    buttonText={
                      displayedUser?.coverPhoto ? "Change" : "Add Cover Photo"
                    }
                    icon="/camera.png"
                    className="flex gap-2 items-center justify-center rounded-md bg-white py-2 px-4 border-2 border-gray-100 hover:bg-gray-200 cursor-pointer"
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
            {/*Profile Container*/}
            <div className="absolute w-full -bottom-1">
              <div className="relative w-full">
                <div className="absolute top-0 w-full h-[30%] rounded-md"></div>
                {/*Profile*/}
                <div className="px-8">
                  <div className="flex lg:flex-row flex-col lg:justify-between justify-center lg:items-end items-center border-b-[1px] border-gray-200 dark:border-gray-100 pb-4">
                    {/*Profile Info*/}
                    <div className="flex lg:flex-row flex-col gap-2 justify-center items-center">
                      {/*Avatar*/}
                      <div className="relative rounded-full w-36 h-36 flex items-center justify-center p-1 bg-white">
                        <img
                          src={
                            displayedUser?.avatar
                              ? `${Config.BACKEND_URL}${displayedUser?.avatar}`
                              : "/user-none.webp"
                          }
                          className="size-full rounded-full object-cover border-2 border-gray-500 cursor-pointer"
                          alt="Avatar"
                        />
                        {isMyProfile && (
                          <div className="absolute bottom-4 right-0 p-2 size-9 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer">
                            <ImageUploader
                              onFileSelect={handleAvatarUpload}
                              buttonText=""
                              icon="/camera.png"
                              className="size-full"
                              isLoading={isLoading}
                            />
                          </div>
                        )}
                      </div>
                      {/*Info*/}
                      <div className="flex flex-col justify-center lg:items-start items-center self-end py-4 px-2">
                        <h1 className="text-3xl font-bold text-center bg-white/80 lg:bg-transparent px-2 rounded dark:text-white">
                          {displayedUser
                            ? `${displayedUser.firstName} ${displayedUser.surname}`
                            : "Loading..."}
                        </h1>
                        <p className="text-gray-500 text-center dark:text-gray-400 bg-white/80 lg:bg-transparent px-2 rounded">{`${profile?.friends?.length} friends`}</p>
                      </div>
                    </div>
                    {/*Edit Profile Button*/}
                    <div className="flex flex-col justify-end items-end py-4 z-30">
                      <div className="flex gap-2 items-center">
                        {isMyProfile ? (
                          <>
                            <button className="flex gap-2 bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-md py-2 px-4 text-white items-center justify-center">
                              <Plus className="size-5" />
                              <span>Add to story</span>
                            </button>
                            <button className="flex gap-2 items-center justify-center bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md py-2 px-4 text-black font-medium">
                              <img
                                src="/pen.png"
                                className="size-5 object-cover"
                              />
                              <span>Edit profile</span>
                            </button>
                          </>
                        ) : isFriend ? (
                          <>
                            <button
                              className="flex gap-2 relative bg-gray-200 text-black rounded-md py-2 px-4 font-medium items-center cursor-pointer hover:bg-gray-300"
                              onClick={() =>
                                setIsOpenFriendsDropdown(!isOpenFriendsDropdown)
                              }
                            >
                              <UserCheck className="fill-black" />
                              <span>Friends</span>
                              {isOpenFriendsDropdown && (
                                <div className="absolute right-0 top-full w-72 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                                  <ul className="p-2">
                                    <li
                                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                                      onClick={handleDeleteFriend}
                                    >
                                      <UserX />
                                      <span className="font-medium">
                                        Unfriend
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </button>
                            <button className="flex gap-2 items-center justify-center bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md py-2 px-4 text-black font-medium" onClick={() => handleToggleChat(displayedUser)}>
                              <img
                                src="/messenger-icon.png"
                                className="size-5 object-cover"
                              />
                              <span>Message</span>
                            </button>
                          </>
                        ) : isReceivingFriendRequest ? (
                          <>
                            <button
                              className="flex gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 font-medium items-center cursor-pointer"
                              onClick={handleAcceptFriendRequest}
                            >
                              <span>Accept</span>
                            </button>
                            <button
                              className="flex gap-2 bg-gray-200 hover:bg-gray-300 text-black rounded-md py-2 px-4 font-medium items-center cursor-pointer"
                              onClick={handleDeclineFriendRequest}
                            >
                              <span>Decline</span>
                            </button>
                            <button className="flex gap-2 items-center justify-center bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md py-2 px-4 text-black font-medium" onClick={() => handleToggleChat(displayedUser)}>
                              <img
                                src="/messenger-icon.png"
                                className="size-5 object-cover"
                              />
                              <span>Message</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={`flex gap-2 font-medium cursor-pointer ${
                                hasSentFriendRequest
                                  ? "bg-gray-200 hover:bg-gray-300 text-black"
                                  : "bg-blue-500 hover:bg-blue-600 text-white"
                              } rounded-md py-2 px-4 items-center justify-center`}
                              onClick={
                                hasSentFriendRequest
                                  ? handleCancelFriendRequest
                                  : handleAddFriendRequest
                              }
                            >
                              <UserPlus />
                              <span>
                                {hasSentFriendRequest
                                  ? "Cancel request"
                                  : "Add friend"}
                              </span>
                            </button>
                            <button className="flex gap-2 items-center justify-center bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md py-2 px-4 text-black font-medium" onClick={() => handleToggleChat(displayedUser)}>
                              <img
                                src="/messenger-icon.png"
                                className="size-5 object-cover"
                              />
                              <span>Message</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/*Profile Bar*/}
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex flex-wrap py-1">
                      {tabs.map((tab, index) => (
                        <div
                          key={index}
                          className={`cursor-pointer border-b-4 font-medium py-3 px-4 ${
                            activeTab === tab.name
                              ? "border-blue-500 text-blue-500 bg-transparent"
                              : "border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                          }`}
                          onClick={() => setActiveTab(tab.name)}
                        >
                          {tab.name}
                        </div>
                      ))}
                      <div className="flex gap-2 items-center justify-center hover:bg-gray-200 cursor-pointer rounded-md py-3 px-4 text-gray-500 dark:text-gray-400 dark:hover:bg-gray-600 font-medium">
                        <span>More</span>
                        <ChevronDown className="size-5" />
                      </div>
                    </div>
                    <div className="rounded-md text-black bg-gray-200 dark:bg-[rgb(35,35,35)] dark:hover:bg-gray-500 hover:bg-gray-300 cursor-pointer py-2 px-4">
                      <Ellipsis className="size-5 dark:text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*Section 2*/}
        <section className="bg-gray-200 dark:bg-[rgb(16,16,16)] lg:px-[17%] md:px-[10%] px-2 py-4 w-full">
          <div className="flex lg:flex-row flex-col gap-4">
            {/*Left Content*/}
            <div className="lg:w-[40%] w-full space-y-4 lg:sticky top-[8.5vh] h-fit">
              {/*Intro*/}
              <div className="rounded-md bg-white dark:bg-[rgb(35,35,35)] p-4 space-y-4">
                <h1 className="text-xl font-bold dark:text-white">Intro</h1>
                <button className="py-2 px-4 text-center w-full rounded-md bg-gray-200 font-medium  cursor-pointer hover:bg-gray-300 dark:bg-[rgb(52,52,53)] dark:text-white dark:hover:bg-[rgb(56,56,56)]">
                  Add Bio
                </button>
                <div className="flex gap-2 items-center">
                  <img src="/graduate.png" className="size-5" />
                  <span className="text-gray-600 dark:text-white">
                    Went to THPT Trần khai Nguyên
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <img src="/location-pin.png" className="size-5" />
                  <span className="text-gray-600 dark:text-white">
                    From Ho Chi Minh City, Vietnam
                  </span>
                </div>
                <button className="py-2 px-4 text-center w-full rounded-md bg-gray-200 font-medium cursor-pointer hover:bg-gray-300 dark:bg-[rgb(52,52,53)] dark:text-white dark:hover:bg-[rgb(56,56,56)]">
                  Edit details
                </button>
                <button className="py-2 px-4 text-center w-full rounded-md bg-gray-200 font-medium cursor-pointer hover:bg-gray-300 dark:bg-[rgb(52,52,53)] dark:text-white dark:hover:bg-[rgb(56,56,56)]">
                  Add Featured
                </button>
              </div>
              {/*Photos*/}
              <div className="rounded-md bg-white dark:bg-[rgb(35,35,35)] p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h1 className="text-xl font-bold dark:text-white">Photos</h1>
                  <h1 className="text-blue-500 rounded-md py-2 px-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-[rgb(56,56,56)]">
                    See All Photos
                  </h1>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {posts.map(
                    (post) =>
                      post.images &&
                      post.images.length > 0 && (
                        <div
                          key={post._id}
                          className="relative w-full lg:h-32 h-56 overflow-hidden rounded-md cursor-pointer hover:scale-105 transition-transform duration-300 border-2 border-gray-200"
                        >
                          <img
                            src={`${Config.BACKEND_URL}${post?.images[0]}`}
                            alt="Post"
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      )
                  )}
                </div>
              </div>
              {/*Friends*/}
              <div className="rounded-md bg-white dark:bg-[rgb(35,35,35)] p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h1 className="text-xl font-bold dark:text-white">Friends</h1>
                  <h1 className="text-blue-500 rounded-md py-2 px-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-[rgb(56,56,56)]">
                    See all friends
                  </h1>
                </div>
                <h1 className="text-gray-500 text-lg">{`${profile?.friends?.length} friends`}</h1>
                <div className="grid grid-cols-3 gap-2">
                  {profile?.friends?.map((friend) => (
                    <div key={friend._id} className="w-full rounded-md">
                      <Link to={`/profile/${friend._id}`}>
                        <img
                          src={
                            friend?.avatar
                              ? `${Config.BACKEND_URL}${friend.avatar}`
                              : "/user.png"
                          }
                          alt="avatar"
                          className="w-full lg:h-30 h-56 object-cover rounded-md"
                        />
                      </Link>
                      <Link
                        to={`/profile/${friend._id}`}
                        className="font-medium text-[13px] hover:underline-offset-2 hover:underline dark:text-white"
                      >{`${friend.firstName} ${friend.surname}`}</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/*Right Content*/}
            <div className="lg:w-[60%] w-full space-y-4">
              {isMyProfile && <CreateStatus onPostCreated={handleAddPost} />}
              <div className="py-2 px-4 bg-white dark:bg-[rgb(35,35,35)] rounded-lg">
                <h1 className="text-xl font-bold dark:text-white">Bài viết</h1>
              </div>
              {loading ? (
                <SpinnerLoading />
              ) : (
                <>
                  {posts && posts.length > 0 ? (
                    posts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        onDeletePost={handleRemovePost}
                      />
                    ))
                  ) : (
                    <p className="text-center text-2xl dark:text-white">
                      No post available
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
      {showChat && activeChatUser && (
        <ChatBox userChat={activeChatUser} onClose={handleCloseChat} />
      )}
    </>
  );
}

export default ProfilePage;
