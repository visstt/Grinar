import Card from "../../../../shared/ui/components/Card/Card";
import EmptyState from "../../../../shared/ui/components/emptyState/EmptyState";
import { useDeleteProject } from "../../hooks/useDeleteProject";
import useMyProfile from "../../hooks/useMyProfile";
import styles from "./MyProjects.module.css";

export default function MyProjects() {
  const { profile, loading, error, removeProject } = useMyProfile();
  const { deleteProject, loading: deleteLoading } = useDeleteProject();

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот проект?")) {
      const success = await deleteProject(projectId);
      if (success) {
        removeProject(projectId);
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>
        Ошибка: {typeof error === "string" ? error : error?.message || "Ошибка"}
      </div>
    );

  if (!profile?.projects?.length) {
    return (
      <EmptyState
        icon="📁"
        title="Пока нет проектов"
        description="Создайте свой первый проект и поделитесь им с сообществом"
        actionText="Добавить проект"
        onAction={() => (window.location.href = "/create-project")}
      />
    );
  }

  return (
    <div className={styles.projectsContainer}>
      <div className={styles.card_wrapper}>
        {profile.projects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <Card
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
            <button
              className={styles.deleteButton}
              onClick={() => handleDeleteProject(project.id)}
              disabled={deleteLoading}
              title="Удалить проект"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 5H4.16667H17.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.66699 5V3.33333C6.66699 2.89131 6.84259 2.46738 7.15515 2.15482C7.46771 1.84226 7.89164 1.66667 8.33366 1.66667H11.667C12.109 1.66667 12.533 1.84226 12.8455 2.15482C13.1581 2.46738 13.3337 2.89131 13.3337 3.33333V5M15.8337 5V16.6667C15.8337 17.1087 15.6581 17.5326 15.3455 17.8452C15.033 18.1577 14.609 18.3333 14.167 18.3333H5.83366C5.39164 18.3333 4.96771 18.1577 4.65515 17.8452C4.34259 17.5326 4.16699 17.1087 4.16699 16.6667V5H15.8337Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.33301 9.16667V14.1667"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.667 9.16667V14.1667"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
