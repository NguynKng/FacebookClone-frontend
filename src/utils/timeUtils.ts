export const getAgeFromDate = (date: Date) => {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--; // Chưa đến sinh nhật năm nay
  }

  if (age === 1) {
    return `${age} year old`;
  }
  return `${age} years old`;
};

export const formatTime = (timestamp: string | number | Date): string => {
  if (!timestamp) return '';

  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) {
    return 'Just now';
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
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
    });
  }

  // Example: 27 March 2022
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatTimeToHourMinute = (timestamp: string | number | Date): string => {
  if (!timestamp) return '';

  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};

export const formatTimeToDateOrHour = (timestamp: string | number | Date): string => {
  if (!timestamp) return '';

  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();

  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isSameDay) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Get the start of the current week (Monday)
  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when Sunday
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(now);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  if (date >= startOfWeek && date <= endOfWeek) {
    return date.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., Monday
  }

  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`; // e.g., 5-6-2025
};

export const isDifferentDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() !== date2.getFullYear() ||
    date1.getMonth() !== date2.getMonth() ||
    date1.getDate() !== date2.getDate()
  );
};

export const formatDateSeparator = (date: Date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return 'Hôm nay';
  } else if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Hôm qua';
  } else {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }
};

export const formatTimeToDateAndHour = (date: Date): string => {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    return `Hôm nay ${hours}:${minutes}`;
  } else if (isYesterday) {
    return `Hôm qua ${hours}:${minutes}`;
  } else {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
};
