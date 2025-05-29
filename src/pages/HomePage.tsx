import { useEffect, useState } from "react";
import CreateStatus from "../components/CreateStatus";
import Meta from "../components/Meta";
import PostCard from "../components/PostCard"; // Import PostCard
import { useGetAllPost } from "../hooks/usePost"; // Import useGetAllPost hook
import { Post } from "../types/Post";
import SpinnerLoading from "../components/SpinnerLoading";
import useAuthStore from "../store/authStore";
import Navbar from "../components/Navbar";
import ListFriend from "../components/ListFriend";
import { Friend } from "../types/Friend";
import ChatBox from "../components/ChatBox";

function HomePage() {
  const { sse } = useAuthStore();
  const [showChat, setShowChat] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState<Friend>(); // State to hold the active chat user
  const { posts, setPosts, loading } = useGetAllPost(); // Fetch all posts using the custom hook
  const handleToggleChat = (friend : Friend) => {
    setActiveChatUser(friend);
    setShowChat(true); // ensure ChatBox shows when a friend is clicked
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setActiveChatUser(undefined);
  }; // giữ nguyên qua các route
  // Set posts when fetched
  useEffect(() => {
    if (sse) {
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "new_post") {
          console.log("[SSE NEW POST]", data);
          setPosts((prev) => [data.post, ...prev]);
        }
      };
    }
  }, [sse, setPosts]);

  const handleAddPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleRemovePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  return (
    <>
      <Meta title="Facebook" />
      <Navbar />
      <div className="flex lg:p-4 md:p-2 p-1 lg:ml-[25%]">
        <div className="md:w-[60%] w-full px-2 md:px-8 space-y-4">
          <CreateStatus onPostCreated={handleAddPost} />
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
                <p className="text-center text-2xl dark:text-white">No feeds available</p>
              )}
            </>
          )}
        </div>
        <div className="md:w-[40%] md:block hidden">
          <ListFriend onToggleChat={handleToggleChat} />
        </div>  
      </div>
      {showChat && activeChatUser && (
        <ChatBox userChat={activeChatUser} onClose={handleCloseChat} />
      )}
    </>
  );
}

export default HomePage;
