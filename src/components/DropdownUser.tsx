import Config from "../envVars";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

function DropdownUser() {
  const { logout, user, theme, toggleTheme } = useAuthStore();
  const handleLogout = () => {
    logout();
  };
  const footerLinks = [
    "Privacy",
    "Terms",
    "Advertising",
    "Ad choices",
    "Cookies",
    "More",
    "Meta © 2025",
  ];
  return (
    <div className="absolute top-[110%] right-0 min-w-92 dark:bg-[rgb(35,35,35)] rounded-lg shadow-lg border-transparent bg-white p-3">
      {/* User */}
      <div className="shadow-lg p-1 w-full rounded-lg border-[1px] border-gray-200 dark:border-gray-700">
        <Link
          to={`/profile/${user?._id}`}
          className="p-2 hover:bg-gray-100 dark:hover:bg-[rgb(56,56,56)] w-full flex items-center gap-2 rounded-lg cursor-pointer"
        >
          <img
            src={
              user?.avatar
                ? `${Config.BACKEND_URL}${user?.avatar}`
                : "/user.png"
            }
            className="size-9 object-cover rounded-full"
          />
          <span className="text-[17px] dark:text-white">{`${user?.firstName} ${user?.surname}`}</span>
        </Link>
        <div className="w-full py-1 px-2">
          <div className="w-full border-1 border-gray-300 dark:border-gray-500"></div>
        </div>
        <div className="w-full p-2">
          <button className="rounded-md bg-gray-200 dark:bg-[rgb(52,52,52)] dark:hover:bg-gray-600 hover:bg-gray-300 flex items-center justify-center gap-2 w-full cursor-pointer py-2 px-4">
            <img src="/change-account.png" className="size-5 object-cover" />
            <span className="font-medium dark:text-white">See all profiles</span>
          </button>
        </div>
      </div>
      {/* Setting */}
      <div className="mt-4">
        {/* Setting and privacy */}
        <div className="rounded-md hover:bg-gray-100 dark:hover:bg-[rgb(56,56,56)] flex items-center gap-2 p-2 cursor-pointer">
          <div className="p-2 rounded-full bg-gray-300 dark:bg-white">
            <img src="/settings.png" className="size-5 object-cover" />
          </div>
          <span className="font-semibold dark:text-white">Settings & privacy</span>
        </div>
        {/* Help and support */}
        <div className="rounded-md hover:bg-gray-100 dark:hover:bg-[rgb(56,56,56)] flex items-center gap-2 p-2 cursor-pointer">
          <div className="p-2 rounded-full bg-gray-300 dark:bg-white">
            <img src="/help-web-button.png" className="size-5 object-cover" />
          </div>
          <span className="font-semibold dark:text-white">Help & support</span>
        </div>
        {/* Display and accessibility */}
        <div className="rounded-md hover:bg-gray-100 dark:hover:bg-[rgb(56,56,56)] flex items-center justify-between p-2 cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-gray-300 dark:bg-white">
              <img src="/moon.png" className="size-5 object-cover" />
            </div>
            <span className="font-semibold dark:text-white">Dark Mode</span>
          </div>
          {/* Toggle Switch */}
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer duration-300 ${
              theme === "dark" ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                theme === "dark" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        {/* Give feedback */}
        <div className="rounded-md hover:bg-gray-100 dark:hover:bg-[rgb(56,56,56)] flex items-center gap-2 p-2 cursor-pointer">
          <div className="p-2 rounded-full bg-gray-300 dark:bg-white">
            <img src="/feedback.png" className="size-5 object-cover" />
          </div>
          <span className="font-semibold dark:text-white">Give feedback</span>
        </div>
        {/* Logout */}
        <div
          className="rounded-md hover:bg-gray-100 dark:hover:bg-[rgb(56,56,56)] flex items-center gap-2 p-2 cursor-pointer"
          onClick={handleLogout}
        >
          <div className="p-2 rounded-full bg-gray-300 dark:bg-white">
            <img src="/logout.png" className="size-5 object-cover" />
          </div>
          <span className="font-semibold dark:text-white">Log out</span>
        </div>
      </div>
      {/* Privacy Term */}
      <div className="mt-4 flex flex-wrap items-center gap-1 text-gray-500 text-[13px] leading-4">
        {footerLinks.map((label, index) => (
          <div key={label} className="flex items-center">
            <Link to="#" className="hover:underline dark:text-gray-400">
              {label}
            </Link>
            {index < footerLinks.length - 1 && (
              <span className="mx-1 text-gray-400">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DropdownUser;
