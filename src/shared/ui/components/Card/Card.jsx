import {
  getProjectPhotoUrl,
  getUserLogoUrl,
} from "../../../utils/getProjectImageUrl";
import styles from "./Card.module.css";

export default function Card({ project }) {
  if (!project) return null;
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={getProjectPhotoUrl(project.projectPhotoName)}
          alt="cardImage"
        />
        {project.category && (
          <span className={styles.category}>{project.category}</span>
        )}
      </div>
      <h3>{project.name}</h3>
      <div className={styles.author}>
        <img src={getUserLogoUrl(project.userLogoPhotoName)} alt="authorLogo" />
        <div className={styles.author__text}>
          <h3>{project.fullName}</h3>
          <p>{project.specialization}</p>
        </div>
      </div>
    </div>
  );
}
