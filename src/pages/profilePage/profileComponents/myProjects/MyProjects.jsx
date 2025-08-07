import Card from "../../../../shared/ui/components/Card/Card";
import useMyProfile from "../../hooks/useMyProfile";
import styles from "./MyProjects.module.css";

export default function MyProjects() {
  const { profile, loading, error } = useMyProfile();

  if (loading) return <div>Загрузка...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>
        Ошибка: {typeof error === "string" ? error : error?.message || "Ошибка"}
      </div>
    );
  if (!profile?.projects?.length) return <div>Нет проектов</div>;

  return (
    <div className={styles.projectsContainer}>
      <div className={styles.card_wrapper}>
        {profile.projects.map((project) => (
          <Card
            key={project.id}
            project={{
              id: project.id,
              projectPhotoName: project.photoName,
              name: project.name,
              userLogoPhotoName: profile.logoFileName,
              fullName: profile.fullName,
              specialization: profile.specialization,
              category: project.category,
              userId: profile.id,
            }}
          />
        ))}
      </div>
    </div>
  );
}
