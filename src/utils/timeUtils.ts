export const formatTime = (timestamp: string | number | Date): string => {
  if (!timestamp) return "";

  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) {
    return "Just now";
  }

  if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes}m`;
  }

  if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours}h`;
  }

  if (secondsAgo < 604800) {
    const days = Math.floor(secondsAgo / 86400);
    return `${days}d`;
  }

  if (secondsAgo < 2592000) {
    const weeks = Math.floor(secondsAgo / 604800);
    return `${weeks}w`;
  }

  if (secondsAgo < 31536000) {
    // Example: 27 March
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });
  }

  // Example: 27 March 2022
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatTimeToHourMinute = (
  timestamp: string | number | Date
): string => {
  if (!timestamp) return "";

  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};
