import { Link } from "react-router-dom";

import { getPhotoUrl } from "../../../shared/utils/getProjectImageUrl";
import styles from "../BlogPage.module.css";

export default function BlogCard({ blog }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleImageError = (e) => {
    e.target.src = "/images/projectPhoto.png"; // fallback изображение
  };

  return (
    <div className={styles.blog_card}>
      <img
        src={getPhotoUrl("cover", blog.coverImage)}
        alt={blog.name}
        onError={handleImageError}
      />
      <div className={styles.info_block}>
        <p>{formatDate(blog.createdAt)}</p>
        <h2>{blog.name}</h2>
        <h4>
          описание описание описание описание описание описание описание
          описание описание описание описание описание
        </h4>
        <p>
          Автор: <Link to={`/user/${blog.author.id}`}>{blog.author.name}</Link>
        </p>
      </div>
    </div>
  );
}
