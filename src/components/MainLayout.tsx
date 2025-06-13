import { ElementType, useCallback, useEffect, useState } from "react";
import Header from "./Header";
import ChatBox from "./ChatBox";
import { Friend } from "../types/Friend";
import useNotificationStore from "../store/notificationStore";
import NotificationPopup from "./NotificationPopup";
import useAuthStore from "../store/authStore";

function MainLayout({ Element }: { Element: ElementType }) {
  const { addNotification } = useNotificationStore();
  const { socket } = useAuthStore();
  const [showChat, setShowChat] = useState(false); // giữ nguyên qua các route
  const [activeChatUser, setActiveChatUser] = useState<Friend>();

  const [popup, setPopup] = useState({
    isPopup: false,
    content: {
      title: "",
      author_name: "",
      author_img: "",
    },
  });

  const handleGetNewMessage = useCallback(
    (sender: Friend) => {
      setShowChat(true);
      setActiveChatUser(sender);
    },
    [setShowChat, setActiveChatUser]
  );

  const handleGetNotificationsAndPopup = useCallback(
    (notification1: any) => {
      const { notification } = notification1;
      console.log("Received notification:", notification);
      addNotification(notification);
      setPopup({
        isPopup: true,
        content: {
          title: notification.content,
          author_img: notification.actor.avatar,
          author_name: `${notification.actor.firstName} ${notification.actor.surname}`,
        },
      });
      const timer = setTimeout(() => {
        setPopup({
          isPopup: false,
          content: {
            title: "",
            author_img: "",
            author_name: "",
          },
        });
      }, 10000);

      return () => clearTimeout(timer);
    },
    [addNotification, setPopup]
  ); // include dependencies if needed

  const handleClosePopup = () => {
    setPopup({
      isPopup: false,
      content: {
        title: "",
        author_name: "",
        author_img: "",
      },
    });
  };

  const handleToggleChat = (friend: Friend) => {
    setActiveChatUser(friend);
    setShowChat(true); // ensure ChatBox shows when a friend is clicked
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setActiveChatUser(undefined);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("getNewMessage", handleGetNewMessage);
    socket.on("new_notification", handleGetNotificationsAndPopup);

    return () => {
      socket.off("getNewMessage", handleGetNewMessage);
      socket.off("new_notification", handleGetNotificationsAndPopup);
    };
  }, [socket, handleGetNewMessage, handleGetNotificationsAndPopup]);

  return (
    <>
      <Header onToggleChat={handleToggleChat} />
      <div className="relative mt-[60px] bg-gray-100 dark:bg-[rgb(16,16,16)] min-h-[92vh]">
        <Element />
        {showChat && activeChatUser && (
          <ChatBox userChat={activeChatUser} onClose={handleCloseChat} />
        )}
      </div>
      {popup.isPopup && (
        <NotificationPopup content={popup.content} onClose={handleClosePopup} />
      )}
    </>
  );
}

export default MainLayout;
