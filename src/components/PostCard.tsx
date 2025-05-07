import { MessageCircle, ThumbsUp } from "lucide-react";
import { Post } from "../types/Post";
import Config from "../envVars";
import { formatTime } from "../utils/timeUtils";
import { Link } from "react-router-dom";
import { JSX, useCallback, useEffect, useMemo, useState } from "react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import {
  createComment,
  replyToComment,
  getCommentsByPostId,
} from "../services/commentApi";
import { Comment } from "../types/Comment";
import SpinnerLoading from "./SpinnerLoading";
import { reactToPost } from "../services/postApi";
import useAuthStore from "../store/authStore";
import { Reaction } from "../types/Reaction";
import emotions from "../data/emotion";

function PostCard({ post }: { post: Post }) {
  const [openComment, setOpenComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const { author, createdAt, content, images } = post;
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null);
  const [hoveredEmotionUser, setHoveredEmotionUser] = useState<string | null>(
    null
  );
  const [loadingComment, setLoadingComment] = useState(false);
  const { user } = useAuthStore();
  const [reactions, setReactions] = useState<Reaction[]>(post.reactions);
  const filteredReactions = hoveredEmotionUser
    ? reactions.filter((r) => r.type === hoveredEmotionUser)
    : [];
  const myReaction = useMemo(
    () => reactions.find((reaction) => reaction?.user?._id === user?._id),
    [reactions, user]
  );

  const isReacted = useMemo(() => !!myReaction, [myReaction]);

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComment(true);
      try {
        const data = await getCommentsByPostId(post._id);
        setComments(data.data || []);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      } finally {
        setLoadingComment(false);
      }
    };
    fetchComments();
  }, [openComment, post, user]);

  const handleReactPost = useCallback(
    async (
      type: "Like" | "Love" | "Haha" | "Care" | "Wow" | "Sad" | "Angry"
    ) => {
      if (!user) return;

      const prevReactions = [...reactions];

      try {
        const response = await reactToPost(post._id, type);
        if (!response.success) return;

        const serverReaction = response.data;

        if (myReaction?.type === type) {
          // Nếu cùng loại → xóa
          const updated = reactions.filter((r) => r.user._id !== user._id);
          setReactions(updated);
        } else if (myReaction) {
          // Nếu đã từng react khác loại → cập nhật
          const updated = reactions.map((r) =>
            r.user._id === user._id ? serverReaction : r
          );
          setReactions(updated);
        } else {
          // Nếu chưa react → thêm mới
          setReactions([...reactions, serverReaction]);
        }
      } catch (error) {
        console.error("❌ Failed to react to post:", error);
        setReactions(prevReactions); // rollback nếu lỗi
      }
    },
    [post._id, user, reactions, myReaction]
  );

  const handleCommentSubmit = async (content: string) => {
    const res = await createComment(post._id, content);
    if (res.success && res.data) {
      setComments((prev) => [res.data, ...prev]);
    }
  };

  const handleReplySubmit = async (commentId: string, content: string) => {
    const res = await replyToComment(post._id, commentId, content);
    if (res.success && res.data) {
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, replies: [...c.replies, res.data] } : c
        )
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md space-y-2">
      <div className="flex items-center space-x-2 pt-4 pl-4">
        <Link
          to={`/profile/${author._id}`}
          className="size-10 rounded-full border-2 border-indigo-500"
        >
          <img
            src={
              author?.avatar
                ? `${Config.BACKEND_URL}${author.avatar}`
                : "/user.png"
            }
            alt="User Avatar"
            className="size-full rounded-full object-cover"
          />
        </Link>
        <div>
          <Link
            to={`/profile/${author._id}`}
            className="text-black font-semibold hover:underline underline-offset-2"
          >{`${author.firstName} ${author.surname}`}</Link>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <span>{formatTime(createdAt)}</span>
            <span className="text-gray-400">•</span>
            <img src="/globe.png" className="size-4 object-cover" />
          </div>
        </div>
      </div>
      {/*Content*/}
      <p className="text-gray-800 px-4 w-full">{content}</p>
      {/*Images*/}
      {images && images.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 border-y-[1px] border-gray-200">
          {images.slice(0, 4).map((img, index) => (
            <div
              key={index}
              className="relative"
              style={{
                flex:
                  images.length === 1 ? "1 1 100%" : "1 1 calc(50% - 0.5rem)",
                minHeight: "240px",
              }}
            >
              <img
                src={`${Config.BACKEND_URL}${img}`}
                alt={`post-img-${index}`}
                className="w-full h-full object-cover"
              />

              {/* If more than 4 images, show a "+n" on the last visible one */}
              {index === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/50 text-white text-2xl font-bold flex items-center justify-center rounded-lg">
                  +{images.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/*Like and Shares*/}
      <div className="px-4 w-full">
        {/*Like, Share and Comment number*/}
        <div className="flex justify-between items-center pb-2 border-b-2 border-gray-200">
          {reactions.length > 0 && (
            <div className="flex items-center">
              <div className="flex items-center relative group">
                {emotions.reduce((acc: JSX.Element[], emotion) => {
                  if (reactions.some((r) => r.type === emotion.name)) {
                    const visibleIndex = acc.length;
                    acc.push(
                      <div
                        key={emotion.id}
                        onMouseEnter={() => setHoveredEmotionUser(emotion.name)}
                        onMouseLeave={() => setHoveredEmotionUser(null)}
                        className="relative"
                      >
                        <img
                          src={emotion.icon}
                          className={`size-6 object-cover cursor-pointer ${
                            visibleIndex !== 0 ? "-ml-1" : ""
                          } relative z-[${10 - visibleIndex}]`}
                        />
                        {hoveredEmotionUser === emotion.name && (
                          <div className="absolute -bottom-15 mb-2 left-0 -translate-x-1/2 px-2 py-1 bg-black text-white text-sm rounded shadow-lg whitespace-nowrap z-50">
                            <h3 className="font-medium">
                              {hoveredEmotionUser}
                            </h3>
                            <div className="flex flex-col mt-1">
                              {filteredReactions.map((reaction) => (
                                <span>{`${reaction.user.firstName} ${reaction.user.surname}`}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return acc;
                }, [])}
              </div>
              <span className="text-gray-600">{reactions.length}</span>
            </div>
          )}
          {comments.length > 0 && (
            <div className="flex gap-3 items-center">
              <div
                className="flex gap-1 items-center text-gray-500 cursor-pointer"
                onClick={() => setOpenComment(!openComment)}
              >
                <span>{comments.length}</span>
                <span>comments</span>
              </div>
              <div className="flex gap-1 items-center text-gray-500">
                <span>2</span>
                <span>shares</span>
              </div>
            </div>
          )}
        </div>
        {/*Like, Share and Comment buttons*/}
        <div className="flex gap-2 py-1 items-center">
          <div className="relative group w-1/3">
            {!isReacted ? (
              <button
                className="size-full py-2 px-4 flex items-center justify-center gap-1 text-gray-500 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() => handleReactPost("Like")}
              >
                <ThumbsUp className={`size-5`} />
                <span>Like</span>
              </button>
            ) : (
              <div
                className="size-full py-2 px-4 flex items-center justify-center gap-1 text-gray-500 rounded-md hover:bg-gray-100 cursor-pointer"
                onClick={() => handleReactPost(myReaction?.type)}
              >
                <img
                  src={
                    emotions.find(
                      (emotion) => emotion.name === myReaction?.type
                    )?.icon
                  }
                  className="size-6 object-cover"
                />
                <span
                  className={`font-medium`}
                  style={{
                    color: `${
                      emotions.find(
                        (emotion) => emotion.name === myReaction?.type
                      )?.color
                    }`,
                  }}
                >
                  {
                    emotions.find(
                      (emotion) => emotion.name === myReaction?.type
                    )?.name
                  }
                </span>
              </div>
            )}

            <div className="absolute bottom-[120%] left-0 z-50 invisible group-hover:visible transition-all delay-200">
              <div className="flex bg-white rounded-full shadow-md border border-gray-200 relative z-50">
                {emotions.map((emotion) => (
                  <div
                    key={emotion.id}
                    className="relative size-12 transition-transform transform hover:scale-125 cursor-pointer"
                    onMouseEnter={() => setHoveredEmotion(emotion.name)} // Show tooltip on hover
                    onMouseLeave={() => setHoveredEmotion(null)}
                    onClick={() => handleReactPost(emotion.name)} // Handle click event
                  >
                    <img
                      src={emotion.icon}
                      alt={emotion.name}
                      className="w-full h-full object-contain"
                    />
                    {/* Tooltip */}

                    {/* Tooltip */}
                    {hoveredEmotion === emotion.name && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 opacity-100 transition-all bg-black text-gray-300 text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none">
                        {emotion.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            className="w-1/3 py-2 px-4 flex items-center justify-center gap-2 text-gray-500 rounded-md hover:bg-gray-100 cursor-pointer"
            onClick={() => setOpenComment(!openComment)}
          >
            <img src="/speech-bubble.png" className="size-5 object-cover" />
            <span>Comment</span>
          </button>
          <button
            className="w-1/3 py-2 px-4 flex items-center justify-center gap-2 text-gray-500 rounded-md hover:bg-gray-100 cursor-pointer"
            onClick={() => setOpenComment(!openComment)}
          >
            <img src="/share.png" className="size-5 object-cover" />
            <span>Share</span>
          </button>
        </div>
        {openComment && (
          <div className="py-2 px-4 border-t-2 border-gray-200 space-y-4">
            <h1 className="text-lg">Tất cả bình luận</h1>
            <CommentInput
              onSubmit={handleCommentSubmit}
              placeholder="Write a comment..."
            />
            <div className="space-y-2">
              {loadingComment ? (
                <SpinnerLoading />
              ) : (
                comments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    userId={author._id}
                    comment={comment}
                    onReply={handleReplySubmit}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCard;
