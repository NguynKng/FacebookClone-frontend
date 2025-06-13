import { useMemo, useState } from "react";
import { Bell, CircleUserRound, House, Grip, MonitorPlay, Search, Store, UsersRound, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Config from "../envVars";
import DropdownChat from "./DropdownChat";
import DropdownUser from "./DropdownUser";
import DropdownNotification from "./DropdownNotification";
import DropdownMenu from "./DropdownMenu";
import debounce from "lodash.debounce"
import { useGetUserProfileByName } from "../hooks/useProfile";
import SpinnerLoading from "./SpinnerLoading";
import { Friend } from "../types/Friend";
import { useGetNotifications } from "../hooks/useNotification";

function Header({ onToggleChat }: { onToggleChat: (friend: Friend) => void }) {
    const { unreadCount } = useGetNotifications();
    const [searchName, setSearchName] = useState("");
    const isSearchingName = searchName.length > 0;
    const { listUser, loading } = useGetUserProfileByName(searchName, { enabled: isSearchingName });
    const [hoveredTab, setHoveredTab] = useState("");
    const location = useLocation();
    const [dropdown, setDropdown] = useState({
        user: false,
        chat: false,
        notification: false,
        menu: false
    });
    const { user, theme } = useAuthStore();

    const handleSearch = debounce((name: string) => {
        setSearchName(name);
    }, 500);

    const activeTab = useMemo(() => {
        const path = location.pathname;
        if (path.startsWith("/friends")) return "Friends";
        else if (path.startsWith("/watch")) return "Watch";
        else if (path.startsWith("/quiz")) return "Quiz";
        else if (path.startsWith("/profile")) return "Profile";
        else if (path === "/") return "Home";
        return "home"; // default case
    }, [location.pathname]);

    const tabs = [
        { id: "Home", icon: <House />, link: `/` },
        { id: "Friends", icon: <UsersRound />, link: '/friends' },
        { id: "Video", icon: <MonitorPlay />, link: '#' },
        { id: "Marketplace", icon: <Store />, link: '#' },
        { id: "Profile", icon: <CircleUserRound />, link: `/profile/${user?._id}` },
    ];

    const toggleDropdown = (type: "user" | "chat" | "notification" | "menu") => {
        setDropdown(prev => ({
            user: type === "user" ? !prev.user : false,
            chat: type === "chat" ? !prev.chat : false,
            notification: type === "notification" ? !prev.notification : false,
            menu: type === "menu" ? !prev.menu : false,
        }));
    };

    return (
        <header className="fixed top-0 left-0 h-[60px] w-full z-50 bg-white shadow-md dark:bg-[rgb(35,35,35)]">
            <div className="w-full h-full flex justify-between items-center px-4 gap-2">
                {/* Logo + Search */}
                <div className="flex items-center gap-2">
                    <Link to="/" className="min-w-[40px] h-[40px]">
                        <img src="/facebook-logo.webp" alt="facebook-logo" className="w-full h-full object-cover"/>
                    </Link>
                    <div className="relative max-w-[16rem]">
                        <Search className="absolute size-5 top-2.5 left-3 text-gray-500 dark:text-gray-300" />
                        <input type="text" placeholder="Search Facebook" className="dark:text-white text-gray-900 w-full py-2 pl-10 bg-gray-100 dark:bg-[rgb(52,52,53)] rounded-full focus:outline-none dark:placeholder:text-gray-300"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {searchName.length > 0 && (
                            <div className="absolute top-[110%] right-0 w-full max-h-96 overflow-y-auto shadow-xl bg-white rounded-lg z-50 p-2 custom-scroll">
                                {loading ? (
                                    <SpinnerLoading />
                                ) : listUser.length === 0 ? (
                                    <div className="text-center text-gray-500 py-2 px-4">User not found</div>
                                ) : (
                                    listUser.map((user) => (
                                        <Link
                                            to={`/profile/${user._id}`}
                                            key={user._id}
                                            className="w-full py-2 px-4 flex items-center justify-between gap-2 hover:bg-blue-100 rounded-md transition duration-200"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-full bg-blue-200 p-2">
                                                    <Search className="size-5 text-blue-600" />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800">{`${user.firstName} ${user.surname}`}</span>
                                            </div>
                                            <img
                                                src={user.avatar ? `${Config.BACKEND_URL}${user.avatar}` : "/user.png"}
                                                alt={'user-avatar'}
                                                className="size-8 object-cover rounded-lg shadow-sm"
                                            />
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs with Tooltip */}
                <div className="hidden md:flex items-center justify-center flex-1 gap-1">
                    {tabs.map((tab) => (
                        <Link to={tab.link} key={tab.id}
                            className={`relative py-4 lg:px-10 md:px-6 cursor-pointer transition 
                                ${activeTab === tab.id ? "border-b-4 border-blue-500 text-blue-500 bg-transparent" : "text-gray-500 dark:text-white dark:hover:bg-[rgb(56,56,56)] hover:bg-gray-200 rounded-md"}`}
                            onMouseEnter={() => setHoveredTab(tab.id)}
                            onMouseLeave={() => setHoveredTab("")}
                        >
                            {tab.icon}

                            {/* Tooltip */}
                            {hoveredTab === tab.id && (
                                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap">
                                    {tab.id}
                                </div>
                            )}
                        </Link>
                    ))}
                </div>

                {/* Right icons */}
                <div className="flex items-center gap-2">
                    <div className="relative dark:bg-[rgb(70,70,71)] dark:hover:bg-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full size-10 p-2.5 flex items-center justify-center cursor-pointer group" onClick={() => toggleDropdown("menu")}>
                        <Grip className="text-black dark:text-white" />
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap group-hover:block hidden transition-opacity duration-500 delay-300 z-50">
                            Menu
                        </div>
                    </div>
                    <div className="relative dark:bg-[rgb(70,70,71)] bg-gray-200 dark:hover:bg-gray-600 hover:bg-gray-300 rounded-full size-10 p-2.5 flex items-center justify-center cursor-pointer group" onClick={() => toggleDropdown("chat")}>
                        <img src={theme === "light" ? "/messenger-icon.png" : "/messenger-icon-white.png"} className="size-full object-cover" />
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap group-hover:block hidden transition-opacity duration-500 delay-300 z-50">
                            Messenger
                        </div>
                    </div>
                    <div className="relative dark:bg-[rgb(70,70,71)] bg-gray-200 dark:hover:bg-gray-600 hover:bg-gray-300 rounded-full size-10 p-2.5 flex items-center justify-center cursor-pointer group" onClick={() => toggleDropdown("notification")}>
                        <Bell className="fill-black dark:text-white dark: dark:fill-white" />
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap group-hover:block hidden transition-opacity duration-500 delay-300 z-50">
                            Notifications
                        </div>
                        {/* Unread Count */}
                        {unreadCount > 0 && (
                            <div className="absolute -top-1.5 -right-0.5 bg-red-500 size-5 flex items-center justify-center rounded-full">
                                <span className="text-white text-xs font-semibold">{unreadCount}</span>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        {/* Avatar + Tooltip */}
                        <div className="bg-gray-200 hover:bg-gray-300 rounded-full size-10 flex items-center justify-center cursor-pointer group" onClick={() => toggleDropdown("user")}>
                            <img src={user?.avatar ? `${Config.BACKEND_URL}${user?.avatar}` : '/user.png'} className="size-full rounded-full object-cover" />
                            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-3 py-2 rounded-xl shadow-lg whitespace-nowrap hidden group-hover:block transition-opacity duration-300 z-50">
                                Account
                            </div>
                            <div className="absolute rounded-full bottom-0 -right-0.5 bg-gray-100 size-4 flex items-center justify-center dark:bg-[rgb(70,70,71)]">
                                <ChevronDown className="size-3.5 text-black dark:text-white" />
                            </div>
                        </div>
                        {/* Dropdown User */}
                        {dropdown.user && (
                            <DropdownUser />
                        )}
                        {/* Dropdown Chat */}
                        {dropdown.chat && (
                            <DropdownChat onToggleChat={onToggleChat} />
                        )}
                        {/* Dropdown Notification */}
                        {dropdown.notification && (
                            <DropdownNotification />
                        )}
                        {/* Dropdown Menu */}
                        {dropdown.menu && (
                            <DropdownMenu />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;