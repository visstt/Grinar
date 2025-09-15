import { create } from "zustand";
import { persist } from "zustand/middleware";

// Отдельный стор для файлов (не персистентный)
export const useProjectFileStore = create((set, get) => ({
  coverImageFile: null,
  setCoverImageFile: (file) => {
    console.log("Setting coverImageFile:", file);
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
      setProjectData: (projectData) =>
        set(() => ({
          projectData: {
            name: projectData.name || "",
            description: projectData.description || "",
            categoryId: projectData.categoryId || null,
            specializationId: projectData.specializationId || null,
            firstLink: projectData.firstLink || "",
            secondLink: projectData.secondLink || "",
            content: projectData.content || null,
            coverImage: null,
            coverImagePreview: null,
            coverImageBase64: null,
          },
        })),

      // Установка обложки проекта
      setCoverImage: async (file) => {
        console.log("setCoverImage called with:", file);

        // Сохраняем файл в отдельном файловом сторе
        useProjectFileStore.getState().setCoverImageFile(file);

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

          console.log("About to set state with file:", file);

          set((state) => ({
            projectData: {
              ...state.projectData,
              coverImage: file, // Для совместимости, но может быть затерт
              coverImagePreview: previewUrl,
              coverImageBase64: base64Preview, // Для сохранения в localStorage
            },
          }));

          console.log(
            "State updated, new coverImage:",
            get().projectData.coverImage,
          );
        } else {
          // Очистка
          useProjectFileStore.getState().clearCoverImageFile();
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

      // Получение файла обложки
      getCoverImageFile: () => {
        const fileFromStore = useProjectFileStore
          .getState()
          .getCoverImageFile();
        console.log("getCoverImageFile returning:", fileFromStore);
        return fileFromStore;
      },

      // Сброс всех данных проекта
      resetProject: () => {
        const currentPreview = get().projectData.coverImagePreview;
        if (currentPreview && currentPreview.startsWith("blob:")) {
          URL.revokeObjectURL(currentPreview);
        }
        // Очищаем файловый стор
        useProjectFileStore.getState().clearCoverImageFile();
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
          coverImage: undefined, // Полностью исключаем из сохранения
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
