import { useMemo, useState } from "react";

import Card from "../../shared/ui/components/Card/Card";
import Header from "../../shared/ui/components/header/Header";
import Input from "../../shared/ui/components/input/Input";
import { useFetchOptions } from "../createProject/information/hooks/useFetchOptions";
import styles from "./ProjectsPage.module.css";
import { useAllProjects } from "./hooks/useAllProjects";

export default function ProjectsPage() {
  const { specializations, categories, loading, error } = useFetchOptions();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useAllProjects();

  // Состояние для фильтров
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Фильтрация проектов
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Поиск по названию проекта (регистронезависимый)
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Фильтр по специализации автора
      const matchesSpecialization = selectedSpecialization
        ? project.author?.specializations?.some(
            (spec) => spec === selectedSpecialization,
          )
        : true;

      // Фильтр по категории проекта
      const matchesCategory = selectedCategory
        ? project.category?.id?.toString() === selectedCategory
        : true;

      return matchesSearch && matchesSpecialization && matchesCategory;
    });
  }, [projects, searchQuery, selectedSpecialization, selectedCategory]);

  return (
    <div className={styles.pageContainer}>
      <Header darkBackground={true} />
      <h1 className={styles.title}>Проекты на Benty</h1>
      <div className="container">
        {error && <div className={styles.errorMessage}>{error}</div>}
        <div className={styles.filters}>
          <div className={styles.searchWrapper}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.searchIcon}
            >
              <path
                d="M7.66536 14.4997C3.8987 14.4997 0.832031 11.433 0.832031 7.66634C0.832031 3.89967 3.8987 0.833008 7.66536 0.833008C11.432 0.833008 14.4987 3.89967 14.4987 7.66634C14.4987 11.433 11.432 14.4997 7.66536 14.4997ZM7.66536 1.83301C4.44536 1.83301 1.83203 4.45301 1.83203 7.66634C1.83203 10.8797 4.44536 13.4997 7.66536 13.4997C10.8854 13.4997 13.4987 10.8797 13.4987 7.66634C13.4987 4.45301 10.8854 1.83301 7.66536 1.83301Z"
                fill="#141414"
              />
              <path
                d="M14.6676 15.1666C14.5409 15.1666 14.4143 15.12 14.3143 15.02L12.9809 13.6866C12.7876 13.4933 12.7876 13.1733 12.9809 12.98C13.1743 12.7866 13.4943 12.7866 13.6876 12.98L15.0209 14.3133C15.2143 14.5066 15.2143 14.8266 15.0209 15.02C14.9209 15.12 14.7943 15.1666 14.6676 15.1666Z"
                fill="#141414"
              />
            </svg>
            <input
              type="text"
              placeholder="Поиск"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className={styles.filterSelect}
            disabled={loading}
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            <option value="">Все специализации</option>
            {specializations.map((specialization) => (
              <option key={specialization.value} value={specialization.label}>
                {specialization.label}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            disabled={loading}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Все ниши</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Отображение ошибки проектов */}
        {projectsError && (
          <div className={styles.errorMessage}>{projectsError}</div>
        )}

        {/* Отображение загрузки проектов */}
        {projectsLoading && (
          <div className={styles.loadingMessage}>Загружаем проекты...</div>
        )}

        {/* Отображение карточек проектов */}
        {!projectsLoading && !projectsError && (
          <>
            {filteredProjects.length > 0 ? (
              <>
                <div className={styles.cardContainer}>
                  {filteredProjects.map((project) => (
                    <Card key={project.id} project={project} />
                  ))}
                </div>
              </>
            ) : projects.length > 0 ? (
              <div className={styles.noResults}>
                По вашему запросу ничего не найдено. Попробуйте изменить
                фильтры.
              </div>
            ) : (
              <div className={styles.noProjects}>Проекты не найдены</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
