import { User } from "../types/User";

const friends: Pick<User, "_id" | "firstName" | "surname" | "avatar">[] = [
    {
        _id: "1",
        firstName: "Nguyễn",
        surname: "Nguyện",
        avatar: "/avatar/avatar-1.png",
    },
    {
        _id: "2",
        firstName: "Nguyên",
        surname: "Khang",
        avatar: "/avatar/avatar-2.png",
    },
    {
        _id: "3",
        firstName: "Trương",
        surname: "Quang Long",
        avatar: "/avatar/avatar-3.png",
    },
    {
        _id: "4",
        firstName: "Cristiano",
        surname: "Ronaldo",
        avatar: "/avatar/avatar-4.png",
    },
    {
        _id: "5",
        firstName: "Lionel",
        surname: "Messi",
        avatar: "/avatar/avatar-5.jpg",
    },
    {
        _id: "6",
        firstName: "Goku",
        surname: "",
        avatar: "/avatar/avatar-7.png",
    },
    {
        _id: "7",
        firstName: "Lebron",
        surname: "James",
        avatar: "/avatar/avatar-6.jpg",
    }
];

export default friends;