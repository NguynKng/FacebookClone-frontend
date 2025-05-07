import { ElementType, useState } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import ChatBox from "./ChatBox";
import ListFriend from "./ListFriend";
import { Friend } from "../types/Friend";

function MainLayout({ Element } : { Element: ElementType }) {
    const [showChat, setShowChat] = useState(false); // giữ nguyên qua các route
    const [activeChatUser, setActiveChatUser] = useState<Friend>();
    const handleToggleChat = (friend: Friend) => {
        setActiveChatUser(friend);
        setShowChat(true); // ensure ChatBox shows when a friend is clicked
      };
    
      const handleCloseChat = () => {
        setShowChat(false);
        setActiveChatUser(undefined);
      };
    
    return (
        <>
            <Header onToggleChat={handleToggleChat} />
            <Navbar />
            <div className="relative pt-[60px] bg-gray-100 lg:ml-[25%] flex">
                <div className="lg:w-[60%] w-full px-4 md:px-8 min-h-[90vh]">
                    <Element />
                </div>
                <div className="md:w-[40%] md:block hidden">
                    <ListFriend onToggleChat={handleToggleChat} />
                </div>
                {showChat && activeChatUser && (
                    <ChatBox userChat={activeChatUser} onClose={handleCloseChat} />
                )}
            </div>
        </>
    )
}

export default MainLayout