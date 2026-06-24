const timeAgo = (dateString, publishedAtString) => {
  const now = new Date();

  // Check if dateString is a valid date
  const date = dateString ? new Date(dateString) : null;
  const publishedAt = publishedAtString ? new Date(publishedAtString) : null;

  // Check if the date is valid
  if (!date && !publishedAt) {
    return "Invalid date";
  }

  const diffInMilliseconds = Math.abs((date || publishedAt) - now);
  const diffInSeconds = diffInMilliseconds / 1000;

  if (diffInSeconds < 60) {
    return `${Math.floor(diffInSeconds)} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute ago' : 'minutes ago'}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour ago' : 'hours ago'}`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day ago' : 'days ago'}`;
  } else if (diffInSeconds < 2419200) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? 'week ago' : 'weeks ago'}`;
  } else {
    // Format the date in 'Month DD, YYYY' format
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = (date || publishedAt).toLocaleDateString('en-IN', options);

    return formattedDate;
  }
};

export default timeAgo;




