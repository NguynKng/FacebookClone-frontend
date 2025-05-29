import { useState, ChangeEvent, FormEvent } from "react";
import Config from "../envVars";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/authStore.js";
import { Post } from "../types/Post.js";

interface PostModalProps {
  onClose: () => void;
  onPostCreated?: (post: Post) => void; // <-- add this line
}

const CreatePostModal: React.FC<PostModalProps> = ({
  onClose,
  onPostCreated,
}) => {
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { createPost, user } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!content.trim() && images.length === 0) {
        toast.error("Bài viết không được để trống.");
        setLoading(false);
        return;
      }

      // Submit each image as one post with content (you can change to support multiple images per post)
      const newPost = await createPost(content, images);
      
      if (onPostCreated) {
        onPostCreated(newPost); // Send it back to HomePage
      }

      setContent("");
      setImages([]);
      setImagesPreview([]);
      onClose();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setImagesPreview((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagesPreview((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-white dark:bg-[rgb(35,35,35)] opacity-90 backdrop-blur-sm"></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white dark:bg-[rgb(52,52,53)] rounded-lg w-full max-w-xl p-4 shadow-xl z-10"
      >
        <button
          type="button"
          className="absolute p-2 rounded-full size-10 bg-gray-200 hover:bg-gray-300 top-2 right-2 text-black cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center mb-4 pb-2 border-b-2 border-gray-200 dark:border-gray-500 dark:text-gray-400">
          Create post
        </h2>

        <div className="flex gap-3 items-center mb-4">
          <img
            src={
              user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : "/user.png"
            }
            className="w-10 h-10 rounded-full object-cover"
            alt="avatar"
          />
          <div>
            <p className="font-medium dark:text-gray-400">{`${user?.firstName} ${user?.surname}`}</p>
            <select className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-500 rounded px-2 py-1">
              <option>Friend</option>
              <option>Public</option>
              <option>Private</option>
            </select>
          </div>
        </div>

        <textarea
          className="w-full h-40 resize-none p-2 border border-gray-300 rounded focus:outline-none placeholder:text-gray-400 dark:text-white"
          placeholder={`${user?.firstName} ${user?.surname}, what are you thinking?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {imagesPreview.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {imagesPreview.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-black/50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <label
            htmlFor="uploadImage"
            className="flex items-center gap-2 text-purple-600 cursor-pointer hover:text-purple-800"
          >
            <img src="/photos.png" className="w-6 h-6" alt="upload" />
            <span>Image</span>
          </label>
          <input
            id="uploadImage"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePostModal;
