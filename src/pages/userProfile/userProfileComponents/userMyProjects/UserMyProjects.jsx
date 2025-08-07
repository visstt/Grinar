import Card from "../../../../shared/ui/components/Card/Card";
import styles from "./UserMyProjects.module.css";

export default function UserMyProjects({ userProfile }) {
  if (!userProfile?.projects?.length) return <div>Нет проектов</div>;

  return (
    <div className={styles.projectsContainer}>
      <div className={styles.card_wrapper}>
        {userProfile.projects.map((project) => (
          <Card
            key={project.id}
            project={{
              id: project.id,
              projectPhotoName: project.photoName,
              name: project.name,
              userLogoPhotoName: userProfile.logoFileName,
              fullName: userProfile.fullName,
              specialization: userProfile.specialization,
              category: project.category,
              userId: userProfile.id,
            }}
          />
        ))}
      </div>
    </div>
  );
}
