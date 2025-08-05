import { create } from "zustand";
import { persist } from "zustand/middleware";

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
        coverImage: null,
        coverImagePreview: null,
        coverImageBase64: null,
      },

      // Действия для обновления данных проекта
      updateProjectData: (newData) =>
        set((state) => ({
          projectData: { ...state.projectData, ...newData },
        })),

      // Установка обложки проекта
      setCoverImage: async (file) => {
        if (file) {
          // Очищаем старый blob URL если он был
          const currentState = get();
          if (
            currentState.projectData.coverImagePreview &&
            currentState.projectData.coverImagePreview.startsWith("blob:")
          ) {
            URL.revokeObjectURL(currentState.projectData.coverImagePreview);
          }

          // Создаем blob URL для немедленного отображения
          const previewUrl = URL.createObjectURL(file);

          // Конвертируем файл в base64 для сохранения в localStorage
          const base64Preview = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });

          set((state) => ({
            projectData: {
              ...state.projectData,
              coverImage: file,
              coverImagePreview: previewUrl,
              coverImageBase64: base64Preview, // Для сохранения в localStorage
            },
          }));
        } else {
          // Очистка старого URL если он был
          const currentPreview = get().projectData.coverImagePreview;
          if (currentPreview && currentPreview.startsWith("blob:")) {
            URL.revokeObjectURL(currentPreview);
          }
          set((state) => ({
            projectData: {
              ...state.projectData,
              coverImage: null,
              coverImagePreview: null,
              coverImageBase64: null,
            },
          }));
        }
      },

      // Сброс всех данных проекта
      resetProject: () => {
        const currentPreview = get().projectData.coverImagePreview;
        if (currentPreview && currentPreview.startsWith("blob:")) {
          URL.revokeObjectURL(currentPreview);
        }
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
            coverImagePreview: null,
            coverImageBase64: null,
          },
        });
      },

      // Получение всех данных проекта
      getProjectData: () => get().projectData,
    }),
    {
      name: "project-draft-storage",
      // Сохраняем все кроме файла и blob URL
      partialize: (state) => ({
        projectData: {
          ...state.projectData,
          coverImage: null, // Файл не сохраняем (невозможно)
          coverImagePreview: null, // Blob URL не сохраняем (невалиден после перезагрузки)
          // coverImageBase64 сохраняется для восстановления превью
        },
      }),
      // Восстанавливаем превью после загрузки из localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.projectData?.coverImageBase64) {
          // Используем base64 как источник превью вместо blob URL
          state.projectData.coverImagePreview =
            state.projectData.coverImageBase64;
        }
      },
    },
  ),
);
