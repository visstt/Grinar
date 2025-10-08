import { Link } from "react-router-dom";

import { getBlogPhotoUrl } from "../../../shared/utils/getProjectImageUrl";
import styles from "../BlogPage.module.css";
import { useBlogNavigation } from "../hooks/useBlogNavigation";

export default function BlogCard({ blog }) {
  const { navigateToBlog } = useBlogNavigation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleImageError = (e) => {
    e.target.src = "/images/projectPhoto.png";
  };

  const handleCardClick = () => {
    navigateToBlog(blog.id);
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation();
  };

  // Используем photoName вместо coverImage
  const imageUrl = getBlogPhotoUrl(blog.photoName);

  return (
    <div className={styles.blog_card} onClick={handleCardClick}>
      <img src={imageUrl} alt={blog.name} onError={handleImageError} />
      <div className={styles.info_block}>
        <p>{formatDate(blog.createdAt)}</p>
        <h2>{blog.name}</h2>
        <h4>{blog.description}</h4>
        <p>
          Автор:{" "}
          <Link to={`/user/${blog.author.id}`} onClick={handleAuthorClick}>
            {blog.author.name}
          </Link>
        </p>
      </div>
    </div>
  );
}
