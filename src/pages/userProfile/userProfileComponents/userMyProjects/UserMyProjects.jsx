import Card from "../../../../shared/ui/components/Card/Card";
import EmptyState from "../../../../shared/ui/components/emptyState/EmptyState";
import styles from "./UserMyProjects.module.css";

export default function UserMyProjects({ userProfile }) {
  if (!userProfile?.projects?.length) {
    return (
      <EmptyState
        icon="📁"
        title="Нет проектов"
        description={`У ${userProfile?.fullName || "этого пользователя"} пока нет опубликованных проектов`}
      />
    );
  }

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
