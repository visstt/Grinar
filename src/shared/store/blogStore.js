import { create } from "zustand";
import { persist } from "zustand/middleware";

// Отдельный стор для файлов блога (не персистентный)
export const useBlogFileStore = create((set, get) => ({
  coverImageFile: null,
  setCoverImageFile: (file) => {
    console.log("Blog: Setting coverImageFile:", file);
    set({ coverImageFile: file });
  },
  getCoverImageFile: () => get().coverImageFile,
  clearCoverImageFile: () => set({ coverImageFile: null }),
}));

export const useBlogStore = create(
  persist(
    (set, get) => ({
      // Данные блога/статьи
      blogData: {
        id: null, // ID блога для отслеживания режима редактирования
        name: "",
        description: "",
        specializationId: null,
        content: null,
        coverImage: null, // Для совместимости, но файл будет в отдельном сторе
        coverImagePreview: null,
        coverImageBase64: null,
      },

      // Действия для обновления данных блога
      updateBlogData: (newData) =>
        set((state) => ({
          blogData: { ...state.blogData, ...newData },
        })),

      // Полная замена данных блога (для режима редактирования)
      setBlogData: (blogData) => {
        // Если есть photoName, создаем превью для обложки
        let coverImagePreview = null;
        let coverImageBase64 = null;

        if (blogData.photoName) {
          // Используем фото из API для превью
          const apiUrl =
            import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
          coverImagePreview = `${apiUrl}/static/project-photos/${blogData.photoName}`;
          // Также сохраняем как base64 для совместимости
          coverImageBase64 = coverImagePreview;
        }

        set(() => ({
          blogData: {
            id: blogData.id || null, // Сохраняем ID для отслеживания режима редактирования
            name: blogData.name || "",
            description: blogData.description || "",
            specializationId: blogData.specializationId || null,
            content: blogData.content || null,
            coverImage: null, // Файл устанавливается отдельно
            coverImagePreview: coverImagePreview,
            coverImageBase64: coverImageBase64,
          },
        }));
      }, // Установка обложки блога
      setCoverImage: async (file) => {
        console.log("Blog: setCoverImage called with:", file);

        // Сохраняем файл в отдельном файловом сторе
        useBlogFileStore.getState().setCoverImageFile(file);

        if (file) {
          // Очищаем старый blob URL если он был
          const currentState = get();
          if (
            currentState.blogData.coverImagePreview &&
            currentState.blogData.coverImagePreview.startsWith("blob:")
          ) {
            URL.revokeObjectURL(currentState.blogData.coverImagePreview);
          }

          // Создаем blob URL для немедленного отображения
          const previewUrl = URL.createObjectURL(file);

          // Конвертируем файл в base64 для сохранения в localStorage
          const base64Preview = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });

          console.log("Blog: About to set state with file:", file);

          set((state) => ({
            blogData: {
              ...state.blogData,
              coverImage: file, // Для совместимости, но может быть затерт
              coverImagePreview: previewUrl,
              coverImageBase64: base64Preview, // Для сохранения в localStorage
            },
          }));

          console.log(
            "Blog: State updated, new coverImage:",
            get().blogData.coverImage,
          );
        } else {
          // Очистка
          useBlogFileStore.getState().clearCoverImageFile();
          // Очистка старого URL если он был
          const currentPreview = get().blogData.coverImagePreview;
          if (currentPreview && currentPreview.startsWith("blob:")) {
            URL.revokeObjectURL(currentPreview);
          }
          set((state) => ({
            blogData: {
              ...state.blogData,
              coverImage: null,
              coverImagePreview: null,
              coverImageBase64: null,
            },
          }));
        }
      },

      // Получение файла обложки
      getCoverImageFile: () => {
        const fileFromStore = useBlogFileStore.getState().getCoverImageFile();
        console.log("Blog: getCoverImageFile returning:", fileFromStore);
        return fileFromStore;
      },

      // Сброс всех данных блога
      resetBlog: () => {
        const currentPreview = get().blogData.coverImagePreview;
        if (currentPreview && currentPreview.startsWith("blob:")) {
          URL.revokeObjectURL(currentPreview);
        }
        // Очищаем файловый стор
        useBlogFileStore.getState().clearCoverImageFile();
        set({
          blogData: {
            id: null,
            name: "",
            description: "",
            specializationId: null,
            content: null,
            coverImage: null,
            coverImagePreview: null,
            coverImageBase64: null,
          },
        });
      },

      // Получение всех данных блога
      getBlogData: () => get().blogData,

      // Сохранение данных в localStorage для режима редактирования
      saveToLocalStorage: () => {
        const data = get().blogData;
        if (data.id) {
          localStorage.setItem("editingBlog", JSON.stringify(data));
        }
      },
    }),
    {
      name: "blog-draft-storage",
      // Сохраняем все кроме файла и blob URL
      partialize: (state) => ({
        blogData: {
          ...state.blogData,
          coverImage: undefined, // Полностью исключаем из сохранения
          coverImagePreview: null, // Blob URL не сохраняем (невалиден после перезагрузки)
          // coverImageBase64 сохраняется для восстановления превью
        },
      }),
      // Восстанавливаем превью после загрузки из localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.blogData?.coverImageBase64) {
          console.log("Blog: Restoring preview from base64");
          // Восстанавливаем превью из base64 при загрузке страницы
          state.blogData.coverImagePreview = state.blogData.coverImageBase64;
        }
      },
    },
  ),
);
