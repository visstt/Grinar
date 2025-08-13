import api from "../api/api";

const API_URL = api.defaults.baseURL?.replace(/\/$/, "") || "";

export function getPhotoUrl(type, filename) {
  if (!filename) {
    if (type === "avatar") return "/icons/Sample_User_Icon.png";
    if (type === "project") return "/images/cardImage.png";
    if (type === "cover") return "/images/defaultCover.png";
    return "";
  }
  return `${API_URL}/photo/photo/${type}/${filename}`;
}

export function getProjectPhotoUrl(filename) {
  return getPhotoUrl("project", filename);
}
export function getBlogPhotoUrl(filename) {
  return getPhotoUrl("blog", filename);
}

export function getUserLogoUrl(filename) {
  return getPhotoUrl("avatar", filename);
}
