import { Post } from "../types/Post";
  
const posts_test: Post[] = [
{
    _id: "1",
    author: {
        _id: "1",
        surname: "Nguyễn Văn A",
        firstName: "Nguyễn Văn A",
        avatar: "/post/post-1.jpg",
    },
    content: "Thấy cục sạc 120W này tiếp tục còn có 5 lít, ai cần thì húp! \n 👉https://s.shopee.vn/8pYAelSGBj",
    images: [
        "/post/post-2.jpg",
    ],
    likes: 150,
    comments: 30,
    createdAt: "2025-04-14T16:33:00.588Z",
},
{
    _id: "2",
    author: {
        _id: "2",
        surname: "Nguyễn Văn A",
        firstName: "Nguyễn Văn A",
        avatar: "/post/post-1.jpg",
    },
    content: "Avatar mới của mình nè!",
    images: ["/post/post-1.jpg"],
    likes: 22,
    comments: 5,
    createdAt: "2025-04-14T16:33:00.588Z",
},
{
    _id: "3",
    author: {
        _id: "3",
        surname: "Nguyễn Văn A",
        firstName: "Nguyễn Văn A",
        avatar: "/post/post-1.jpg",
    },
    content: "Hình nền đẹp 4k cho máy tính nè!",
    images: ["/post/post-3.jpg"],
    likes: 22,
    comments: 5,
    createdAt: "2025-04-14T16:33:00.588Z",
},
{
    _id: "4",
    author: {
        _id: "1",
        surname: "Nguyễn Văn A",
        firstName: "Nguyễn Văn A",
        avatar: "/post/post-1.jpg",
    },
    content: "Hành trình của Faker",
    images: ["/post/post-4.png"],
    likes: 22,
    comments: 5,
    createdAt: "2025-04-14T16:33:00.588Z",
}

// Other posts...
];
  
export default posts_test;  