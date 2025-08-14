import { useMemo, useState } from "react";

import useChats from "../../hooks/useChats";
import styles from "./ChatSidebar.module.css";
import PeopleCard from "./peopleCard/PeopleCard";

export default function ChatSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { chats, loading, error } = useChats();

  // Фильтрация чатов по поисковому запросу
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;

    return chats.filter(
      (chat) =>
        chat.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.content
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  }, [chats, searchQuery]);

  return (
    <div className={styles.chatSidebar}>
      <div className={styles.searchWrapper}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.searchIcon}
        >
          <path
            d="M8.58268 17.125C3.87435 17.125 0.0410156 13.2916 0.0410156 8.58329C0.0410156 3.87496 3.87435 0.041626 8.58268 0.041626C13.291 0.041626 17.1243 3.87496 17.1243 8.58329C17.1243 13.2916 13.291 17.125 8.58268 17.125ZM8.58268 1.29163C4.55768 1.29163 1.29102 4.56663 1.29102 8.58329C1.29102 12.6 4.55768 15.875 8.58268 15.875C12.6077 15.875 15.8743 12.6 15.8743 8.58329C15.8743 4.56663 12.6077 1.29163 8.58268 1.29163Z"
            fill="white"
            fillOpacity="0.4"
          />
          <path
            d="M17.3327 17.9583C17.1744 17.9583 17.016 17.9 16.891 17.775L15.2244 16.1083C14.9827 15.8666 14.9827 15.4666 15.2244 15.225C15.466 14.9833 15.866 14.9833 16.1077 15.225L17.7744 16.8916C18.016 17.1333 18.016 17.5333 17.7744 17.775C17.6494 17.9 17.491 17.9583 17.3327 17.9583Z"
            fill="white"
            fillOpacity="0.4"
          />
        </svg>
        <input
          type="text"
          placeholder="Поиск..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && <div className={styles.loading}>Загрузка чатов...</div>}
      {error && <div className={styles.error}>Ошибка: {error}</div>}

      <div className={styles.chatsList}>
        {filteredChats.length > 0
          ? filteredChats.map((chat) => (
              <PeopleCard key={chat.id} chat={chat} />
            ))
          : !loading && <div className={styles.noChats}>Чаты не найдены</div>}
      </div>
    </div>
  );
}
