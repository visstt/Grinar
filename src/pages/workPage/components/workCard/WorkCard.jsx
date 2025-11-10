import { getPhotoUrl } from "../../../../shared/utils/getProjectImageUrl";
import styles from "./WorkCard.module.css";

const jobFormatMap = {
  office: "Офис",
  remote: "Удалённо",
  hybrid: "Гибрид",
  Удаленно: "Удалённо",
  Офис: "Офис",
  Гибрид: "Гибрид",
};

export default function WorkCard({ job, onClick }) {
  const jobFormat =
    jobFormatMap[job?.jobFormat] || job?.jobFormat || "Формат не указан";
  return (
    <div
      className={styles.card}
      onClick={() => {
        console.log("Card clicked", job);
        if (onClick) onClick(job);
      }}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.name}>
        <div className={styles.typeAndDate}>
          <p>{job?.type || "Тип не указан"}</p>
          <p>{job?.createdAt || "Дата не указана"}</p>
        </div>
        <h1>{job?.name || "Без названия"}</h1>
      </div>
      <div className={styles.gap}>
        <div className={styles.salary}>
          <h2>от {job?.minWage ? job.minWage + "₽" : "-"}</h2>
          <p>{jobFormat}</p>
        </div>
        <div className={styles.user}>
          <img src={getPhotoUrl("advertisement", job?.photoName)} alt="user" />
          <div>
            <p>Работодатель</p>
            <h3>{job?.companyName || "-"}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
