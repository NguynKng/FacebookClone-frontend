import { ElementType, useCallback, useEffect, useState } from "react";
import Header from "./Header";
import ChatBox from "./ChatBox";
import { Friend } from "../types/Friend";
import useNotificationStore from "../store/notificationStore";
import useAuthStore from "../store/authStore";
import { Notification } from "../types/Notification";
import NotificationPopup from "./NotificationPopup";

function MainLayout({ Element }: { Element: ElementType }) {
  const { addNotification } = useNotificationStore();
  const { sse } = useAuthStore();
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
    (notification: Notification) => {
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
    if (sse) {
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type) {
          if (data.type === "new_message") {
            console.log("[SSE NEW MESSAGE]", data);
            handleGetNewMessage(data.sender);
          } else {
            console.log("[SSE NEW NOTIFICATION]", data);
            handleGetNotificationsAndPopup(data.notification);
          }
        }
      };
    }
  }, [sse, handleGetNotificationsAndPopup, handleGetNewMessage]);

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
