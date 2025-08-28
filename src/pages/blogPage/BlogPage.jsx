import { useMemo, useState } from "react";

import { Link } from "react-router-dom";

import EmptyState from "../../shared/ui/components/emptyState/EmptyState";
import Header from "../../shared/ui/components/header/Header";
import { useFetchOptions } from "../createProject/information/hooks/useFetchOptions";
import styles from "./BlogPage.module.css";
import BlogCard from "./components/BlogCard";
import { useAllBlogs } from "./hooks/useAllBlogs";

export default function BlogPage() {
  const {
    specializations,
    categories,
    loading: optionsLoading,
    error: optionsError,
  } = useFetchOptions();
  const { blogs, loading: blogsLoading, error: blogsError } = useAllBlogs();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialization = selectedSpecialization
        ? blog.specialization?.id === parseInt(selectedSpecialization)
        : true;

      const matchesCategory = selectedCategory
        ? blog.category?.id === parseInt(selectedCategory)
        : true;

      return matchesSearch && matchesSpecialization && matchesCategory;
    });
  }, [
    blogs,
    searchQuery,
    selectedSpecialization,
    selectedCategory,
    specializations,
    categories,
  ]);

  const loading = optionsLoading || blogsLoading;
  const error = optionsError || blogsError;

  return (
    <div>
      <Header darkBackground={true} />
      <div className="container">
        <h1 className={styles.title}>Блог</h1>
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
                <option key={specialization.value} value={specialization.value}>
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

          <div className={styles.cardContainer}>
            {loading && (
              <div className={styles.loadingMessage}>Загрузка блогов...</div>
            )}

            {error && <div className={styles.errorMessage}>{error}</div>}

            {!loading && !error && filteredBlogs.length === 0 && (
              <div className={styles.emptyMessage}>
                <EmptyState />
              </div>
            )}

            {!loading &&
              !error &&
              filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
