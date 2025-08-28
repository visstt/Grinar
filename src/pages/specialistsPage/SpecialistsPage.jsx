import { useMemo, useState } from "react";

import Header from "../../shared/ui/components/header/Header";
import styles from "./SpecialistsPage.module.css";
import SpecialistsPageCard from "./components/SpecialistsPageCard";
import { useAllSpecialists } from "./hooks/useAllSpecialists";

export default function SpecialistsPage() {
  const {
    specialists,
    loading: specialistsLoading,
    error: specialistsError,
  } = useAllSpecialists();

  const [activeTab, setActiveTab] = useState("best");
  const [searchQuery, setSearchQuery] = useState("");

  // Фильтрация специалистов по поисковому запросу
  const filteredSpecialists = useMemo(() => {
    if (activeTab === "search" && searchQuery) {
      return specialists.filter((specialist) =>
        specialist.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return specialists;
  }, [specialists, searchQuery, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "best") {
      setSearchQuery("");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header darkBackground={true} />

      {/* Табы */}
      <div className={styles.tabsContainer}>
        <div className="container">
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "best" ? styles.tabActive : ""}`}
              onClick={() => handleTabChange("best")}
            >
              Лучшие
            </button>
            <button
              className={`${styles.tab} ${activeTab === "search" ? styles.tabActive : ""}`}
              onClick={() => handleTabChange("search")}
            >
              Поиск
            </button>
          </div>
        </div>
      </div>
      {activeTab === "search" && (
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
            placeholder="Поиск специалистов"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}
      <h1 className={styles.title}>Лучшие на Benty</h1>

      <div className="container">
        {specialistsError && (
          <div className={styles.errorMessage}>{specialistsError}</div>
        )}

        {specialistsLoading && (
          <div className={styles.loadingMessage}>Загружаем специалистов...</div>
        )}

        {!specialistsLoading && !specialistsError && (
          <>
            {filteredSpecialists.length > 0 ? (
              <>
                <div className={styles.specialistsContainer}>
                  {filteredSpecialists.map((specialist) => (
                    <SpecialistsPageCard
                      key={specialist.id}
                      specialist={specialist}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.noSpecialists}>
                {activeTab === "search" && searchQuery
                  ? "Специалисты не найдены по вашему запросу"
                  : "Специалисты не найдены"}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
