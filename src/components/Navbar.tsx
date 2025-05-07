import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Config from "../envVars";

function Navbar() {
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuthStore();
  const avatarUrl = user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : "/user.png";
  const fullName = user?.surname && user?.firstName ? `${user.firstName} ${user.surname}` : "User";

  const navbarData = [
    { src: avatarUrl, text: fullName, link: `/profile/${user?._id}` },
    { src: "/two-people.png", text: "Friends", link: "/friends" },
    { src: "/clock.png", text: "Memories", link: "#" },
    { src: "/bookmark.png", text: "Saved", link: "#" },
    { src: "/group.png", text: "Groups", link: "#" },
    { src: "/video.png", text: "Video", link: "#" },
    { src: "/shops.png", text: "Marketplace", link: "#" },
    { src: "/feed.png", text: "Feeds", link: "#" },
    { src: "/analytics.png", text: "Ads Manager", link: "#" },
    { src: "/present.png", text: "Birthdays", link: "#" },
    { src: "/earth.png", text: "Climate Science Centre", link: "#" },
    { src: "/star.png", text: "Events", link: "#" },
    { src: "/heart.png", text: "Fundraiser", link: "#" },
    { src: "/game-console.png", text: "Gaming video", link: "#" },
    { src: "/messenger.png", text: "Messenger", link: "#" },
    { src: "/communication.png", text: "Messenger Kids", link: "#" },
    { src: "/contactless.png", text: "Orders and payments", link: "#" },
    { src: "/facebook-page.png", text: "Pages", link: "#" },
    { src: "/game.png", text: "Play games", link: "#" },
    { src: "/activity.png", text: "Recent ad activity", link: "#" },
    { src: "/reels.png", text: "Reels", link: "#" },
  ];

  const displayData = showAll
    ? navbarData
    : navbarData.slice(0, navbarData.findIndex((item) => item.text === "Feeds") + 1);

  return (
    <nav className="fixed top-[60px] left-0 h-[92vh] w-[25%] pl-4 py-4 overflow-y-auto z-40 hidden lg:block custom-scroll bg-gray-100">
      <div className="space-y-2">
        {displayData.map((item, index) => (
          <Link key={index} to={item.link}
            className="flex gap-4 items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
            <img src={item.src} className={`size-8 object-cover ${index == 0 && 'rounded-full'}`} />
            <span className="font-medium text-[15px]">{item.text}</span>
          </Link>
        ))}

        {/* Toggle Button */}
        <button className="flex gap-4 items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer w-full"
          onClick={() => setShowAll((prev) => !prev)}>
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                {showAll ? <ChevronUp /> : <ChevronDown className="size-6" />}
            </div>
          <span className="font-medium text-[15px]">
            {showAll ? "See less" : "See more"}
          </span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;