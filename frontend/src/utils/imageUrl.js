const API_BASE = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

export const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image; // Cloudinary hoặc URL đầy đủ
  return `${API_BASE}${image}`; // Local uploads
};
