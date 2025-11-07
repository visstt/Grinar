import { Home } from "lucide-react";

import Card from "../../../../shared/ui/components/Card/Card";
import usePopularProjects from "../../hooks/usePopularProjects";
import useProjects from "../../hooks/useProjects";
import HomeJobs from "../HomeJobs/HomeJobs";
import styles from "./CardsContainer.module.css";

export default function CardsContainer() {
  const { projects, loading, error } = useProjects();
  const {
    popularProjects,
    loading: popularLoading,
    error: popularError,
  } = usePopularProjects();

  if (loading || popularLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error?.message || error}</div>;
  if (popularError)
    return (
      <div>
        Ошибка загрузки популярных проектов:{" "}
        {popularError?.message || popularError}
      </div>
    );

  return (
    <div className="container" id="cardsContainer">
      <div className={styles.cardContainer}>
        {projects.slice(0, 8).map((project) => (
          <Card key={project.id} project={project} />
        ))}
      </div>
      <HomeJobs />
      <h2 className={styles.title}>Популярное</h2>
      <div className={styles.cardContainer__popular}>
        {popularProjects.slice(0, 4).map((project) => (
          <Card key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
