import api from "../api/api";

const API_URL = api.defaults.baseURL?.replace(/\/$/, "") || "";

export function getProjectPhotoUrl(filename) {
  return filename
    ? `${API_URL}/project/photo/${filename}`
    : "/images/cardImage.png";
}

export function getUserLogoUrl(filename) {
  return filename
    ? `${API_URL}/user/photo/${filename}`
    : "/images/authorImage.svg";
}
