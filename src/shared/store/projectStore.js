import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getProjectPhotoUrl } from "../utils/getProjectImageUrl";

// Отдельный стор для файлов (не персистентный)
export const useProjectFileStore = create((set, get) => ({
  coverImageFile: null,
  setCoverImageFile: (file) => {
    set({ coverImageFile: file });
  },
  getCoverImageFile: () => get().coverImageFile,
  clearCoverImageFile: () => set({ coverImageFile: null }),
}));

export const useProjectStore = create(
  persist(
    (set, get) => ({
      // Данные проекта
      projectData: {
        name: "",
        description: "",
        categoryId: null,
        specializationId: null,
        firstLink: "",
        secondLink: "",
        content: null,
        coverImage: null, // Оставляем для совместимости, но файл будет в отдельном сторе
        coverImagePreview: null,
        coverImageBase64: null,
      },

      // Действия для обновления данных проекта
      updateProjectData: (newData) =>
        set((state) => ({
          projectData: { ...state.projectData, ...newData },
        })),

      // Установка полных данных проекта (для режима редактирования)
      setProjectData: (projectData) => {
        // Если есть photoName, используем его как coverImage
        // (coverImage будет содержать filename, а не URL)
        let coverImage =
          projectData.photoName || projectData.coverImage || null;

        set(() => ({
          projectData: {
            name: projectData.name || "",
            description: projectData.description || "",
            categoryId: projectData.categoryId || null,
            specializationId: projectData.specializationId || null,
            firstLink: projectData.firstLink || "",
            secondLink: projectData.secondLink || "",
            content: projectData.content || null,
            coverImage: coverImage,
          },
        }));
      },

      // Установка обложки проекта
      setCoverImage: async (coverImageString) => {
        // coverImageString — это строка (url или base64)
        set((state) => ({
          projectData: {
            ...state.projectData,
            coverImage: coverImageString,
          },
        }));
      },

      // Получение файла обложки
      // getCoverImageFile больше не нужен, coverImage теперь строка

      // Сброс всех данных проекта
      resetProject: () => {
        set({
          projectData: {
            name: "",
            description: "",
            categoryId: null,
            specializationId: null,
            firstLink: "",
            secondLink: "",
            content: null,
            coverImage: null,
          },
        });
      },

      // Получение всех данных проекта
      getProjectData: () => get().projectData,
    }),
    {
      name: "project-draft-storage",
      // Сохраняем все как есть, coverImage теперь строка
      partialize: (state) => ({
        projectData: {
          ...state.projectData,
        },
      }),
      // Больше не нужно восстанавливать превью из base64
      onRehydrateStorage: () => (state) => state,
    },
  ),
);
