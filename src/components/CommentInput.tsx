import { useState } from "react";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import Config from "../envVars";
import useAuthStore from "../store/authStore";

interface CommentInputProps {
  placeholder?: string;
  onSubmit: (content: string) => Promise<void> | void;
}

function CommentInput({ placeholder = "Write a comment...", onSubmit }: CommentInputProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await onSubmit(content.trim());
      setContent(""); // Clear input after submit
    } catch (error) {
      console.error("Comment submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 sm:gap-3 w-full flex-wrap sm:flex-nowrap"
    >
      <Link
        to={`/profile/${user?._id}`}
        className="size-10 rounded-full flex-shrink-0"
      >
        <img
          src={user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : "/user.png"}
          className="w-full h-full object-cover rounded-full"
        />
      </Link>

      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 min-w-0 py-2 px-4 rounded-full bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out hover:bg-gray-200 w-full sm:w-auto"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />

      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 ease-in-out flex items-center justify-center disabled:opacity-50"
        disabled={loading}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}

export default CommentInput;
