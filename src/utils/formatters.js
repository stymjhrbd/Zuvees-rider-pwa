// Currency formatter
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

// Date formatter
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Time formatter
export const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Date and time formatter
export const formatDateTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Address formatter
export const formatAddress = (address) => {
  if (!address) return "";
  const parts = [
    address.street,
    address.city,
    `${address.state} ${address.zipCode}`.trim(),
  ].filter(Boolean);

  return parts.join(", ");
};

// Phone number formatter
export const formatPhone = (phone) => {
  if (!phone) return "";
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }

  // Format as +X XXX XXX XXXX
  if (cleaned.length === 11) {
    return `+${cleaned[0]} ${cleaned.slice(1, 4)} ${cleaned.slice(
      4,
      7
    )} ${cleaned.slice(7)}`;
  }

  return phone;
};

// Relative time formatter (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return "";

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  return formatDate(date);
};

// Order status formatter
export const formatOrderStatus = (status) => {
  const statusMap = {
    pending: "Pending",
    paid: "Paid",
    processing: "Processing",
    shipped: "In Transit",
    delivered: "Delivered",
    undelivered: "Undelivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };

  return statusMap[status] || status;
};

// Distance formatter
export const formatDistance = (meters) => {
  if (!meters) return "0 km";

  const km = meters / 1000;
  if (km < 1) {
    return `${Math.round(meters)} m`;
  }

  return `${km.toFixed(1)} km`;
};

// Duration formatter (seconds to human readable)
export const formatDuration = (seconds) => {
  if (!seconds) return "0 min";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes} min`;
};

// Percentage formatter
export const formatPercentage = (value, total) => {
  if (!total || total === 0) return "0%";
  const percentage = (value / total) * 100;
  return `${Math.round(percentage)}%`;
};
