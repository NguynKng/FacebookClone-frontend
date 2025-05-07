import CreateStatus from "../components/CreateStatus"
import Meta from "../components/Meta";
import PostCard from "../components/PostCard";  // Import PostCard
import { useGetAllPost } from "../hooks/usePost"; // Import useGetAllPost hook

function HomePage(){
    const { posts } = useGetAllPost(); // Fetch all posts using the custom hook
    return(
        <>
            <Meta title="Facebook" />
            <div className="p-4 space-y-4">
                <CreateStatus />
                {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
        </>
    )
}

export default HomePage