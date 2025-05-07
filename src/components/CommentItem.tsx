import { useState } from "react";
import { Link } from "react-router-dom";
import Config from "../envVars";
import { formatTime } from "../utils/timeUtils";
import CommentInput from "./CommentInput";
import { Comment } from "../types/Comment";

type CommentItemProps = {
  userId: string;
  comment: Comment;
  onReply: (commentId: string, content: string) => void;
};

function CommentItem({ userId, comment, onReply }: CommentItemProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [openReplies, setOpenReplies] = useState(false);

  const toggleReplies = () => setOpenReplies((prev) => !prev);

  const handleReplySubmit = async (content: string) => {
    await onReply(comment._id, content);
    setReplyingTo(null); // Hide input after submit
  };

  return (
    <div className="flex items-start gap-2 w-full max-w-full">
      <Link
        to={`/profile/${comment.user._id}`}
        className="size-10 rounded-full hover:brightness-105"
      >
        <img
          src={
            comment.user.avatar
              ? `${Config.BACKEND_URL}${comment.user.avatar}`
              : "/user.png"
          }
          className="size-full object-cover rounded-full"
        />
      </Link>

      <div className="flex flex-col gap-1 w-full">
        <div className="py-2 px-4 rounded-3xl bg-gray-200 w-fit max-w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/profile/${comment.user._id}`}
              className="text-[16px] font-semibold hover:text-blue-600"
            >
              {`${comment.user.firstName} ${comment.user.surname} `}
            </Link>
            {comment.user._id === userId && (
              <span className="text-sm text-gray-500">Tác giả</span>
            )}
          </div>
          <p className="text-base break-words">{comment.content}</p>
        </div>

        <div className="flex items-center gap-2 px-3 text-sm flex-wrap">
          <span className="text-gray-500">{formatTime(comment.createdAt)}</span>
          <button
            onClick={() => setReplyingTo(comment._id)}
            className="text-gray-500 hover:underline cursor-pointer"
          >
            Trả lời
          </button>
        </div>

        {comment?.replies?.length > 0 && (
          <button
            className="text-sm text-blue-500 hover:underline w-fit cursor-pointer"
            onClick={toggleReplies}
          >
            {openReplies
              ? "Ẩn phản hồi"
              : `Xem ${comment.replies?.length} phản hồi`}
          </button>
        )}

        {openReplies &&
          comment.replies.map((reply) => (
            <div
              key={reply._id}
              className="flex gap-2 mt-2 ml-4 sm:ml-6 w-full"
            >
              <Link
                to={`/profile/${reply.user._id}`}
                className="size-9 rounded-full hover:brightness-105 min-w-[36px]"
              >
                <img
                  src={
                    reply.user.avatar
                      ? `${Config.BACKEND_URL}${reply.user.avatar}`
                      : "/user.png"
                  }
                  className="size-full object-cover rounded-full"
                />
              </Link>
              <div className="flex flex-col gap-1 w-full">
                <div className="py-2 px-4 rounded-3xl bg-gray-100 w-fit max-w-full">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/profile/${reply.user._id}`}
                      className="text-[15px] font-semibold hover:text-blue-600"
                    >
                      {`${reply.user.firstName} ${reply.user.surname} `}
                    </Link>
                    {reply.user._id === userId && (
                      <span className="text-sm text-gray-500">Tác giả</span>
                    )}
                  </div>
                  <p className="text-base break-words">{reply.content}</p>
                </div>
                <span className="text-sm px-3 text-gray-500">
                  {formatTime(reply.createdAt)}
                </span>
              </div>
            </div>
          ))}

        {replyingTo === comment._id && (
          <CommentInput
            placeholder={`Phản hồi ${comment.user.surname} ${comment.user.firstName}...`}
            onSubmit={handleReplySubmit}
          />
        )}
      </div>
    </div>
  );
}

export default CommentItem;
