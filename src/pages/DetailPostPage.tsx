import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import SpinnerLoading from "../components/SpinnerLoading";
import { getPostById } from "../services/postApi";
import { Post } from "../types/Post"; // <-- import the correct type if you have it

function DetailPostPage() {
  const navigate = useNavigate();
  const { postId } = useParams(); // Use lowercase to match route param
  const [detailPost, setDetailPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setNotFound(true);
        return;
      }

      setLoading(true);
      try {
        const response = await getPostById(postId);
        if (response.success) {
            console.log(response)
          setDetailPost(response.data);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        setNotFound(true);
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SpinnerLoading />
      </div>
    );
  }

  if (notFound || !detailPost) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4 min-h-[92vh]">
        <img src="/404-error.png" alt="Not Found" className="w-40 mb-2" />
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-white mb-2">
          Không tìm thấy bài viết
        </h1>
        <p className="text-gray-500 dark:text-gray-300 max-w-md">
          Bài viết bạn đang tìm có thể đã bị xóa hoặc không tồn tại. Vui lòng
          kiểm tra lại liên kết hoặc quay về trang trước.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8 px-4 md:px-0">
      <div className="w-full max-w-xl">
        <PostCard post={detailPost} showComment={true} />
      </div> 
    </div>
  );
}

export default DetailPostPage;
