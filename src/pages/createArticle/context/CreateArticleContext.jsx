import React, { createContext, useContext, useEffect, useState } from "react";

import { useBlogStore } from "../../../shared/store/blogStore";

const CreateArticleContext = createContext();

export const useCreateArticleContext = () => {
  const context = useContext(CreateArticleContext);
  if (!context) {
    throw new Error(
      "useCreateArticleContext must be used within CreateArticleProvider",
    );
  }
  return context;
};

export const CreateArticleProvider = ({ children }) => {
  const {
    blogData,
    setBlogData,
    resetBlog,
    updateBlogData,
    saveToLocalStorage,
  } = useBlogStore();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  // Инициализация данных при первой загрузке
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editBlogId = urlParams.get("edit");

    setCurrentEditId(editBlogId);

    if (editBlogId) {
      // Загружаем данные из localStorage для режима редактирования
      const editingBlog = localStorage.getItem("editingBlog");
      if (editingBlog) {
        try {
          const blogData = JSON.parse(editingBlog);
          if (blogData.id && blogData.id.toString() === editBlogId) {
            console.log("Загружены данные из localStorage:", blogData);
            setBlogData(blogData);
          } else {
            localStorage.removeItem("editingBlog");
          }
        } catch (error) {
          console.error("Ошибка при парсинге данных блога:", error);
          localStorage.removeItem("editingBlog");
        }
      }
    } else {
      // Если не в режиме редактирования, проверяем есть ли черновик
      const draftData = localStorage.getItem("blog-draft-storage");
      if (draftData) {
        try {
          const parsed = JSON.parse(draftData);
          if (parsed.state?.blogData && !parsed.state.blogData.id) {
            setBlogData(parsed.state.blogData);
          }
        } catch (error) {
          console.error("Ошибка при загрузке черновика:", error);
        }
      }
    }

    setIsDataLoaded(true);
  }, [setBlogData]);

  // Сохранение данных при изменениях
  const handleUpdateBlogData = (newData) => {
    updateBlogData(newData);

    // Автоматическое сохранение в localStorage для режима редактирования
    if (currentEditId) {
      setTimeout(() => saveToLocalStorage(), 100);
    }
  };

  // Очистка при выходе из процесса создания статьи
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentPath = window.location.pathname;
      const isArticleRelatedPage =
        currentPath === "/create-article" ||
        currentPath === "/article-information";

      if (!isArticleRelatedPage && !currentEditId) {
        localStorage.removeItem("editingBlog");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Не очищаем данные при размонтировании провайдера
    };
  }, [currentEditId]);

  const contextValue = {
    blogData,
    updateBlogData: handleUpdateBlogData,
    setBlogData,
    resetBlog,
    isDataLoaded,
    currentEditId,
    isEditMode: !!currentEditId,
  };

  return (
    <CreateArticleContext.Provider value={contextValue}>
      {children}
    </CreateArticleContext.Provider>
  );
};
