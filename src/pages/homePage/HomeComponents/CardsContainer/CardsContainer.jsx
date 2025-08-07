import Card from "../../../../shared/ui/components/Card/Card";
import useProjects from "../../hooks/useProjects";
import styles from "./CardsContainer.module.css";

export default function CardsContainer() {
  const { projects, loading, error } = useProjects();

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error?.message || error}</div>;

  return (
    <div className="container" id="cardsContainer">
      <div className={styles.cardContainer}>
        {projects.slice(0, 8).map((project) => (
          <Card key={project.id} project={project} />
        ))}
      </div>
      <h2 className={styles.title}>Популярное</h2>
      <div className={styles.cardContainer__popular}>
        {projects.slice(0, 4).map((project) => (
          <Card key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
