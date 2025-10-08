import { create } from "zustand";
import { persist } from "zustand/middleware";

// Отдельный стор для файлов блога (не персистентный)
export const useBlogFileStore = create((set, get) => ({
  coverImageFile: null,
  setCoverImageFile: (file) => {
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
        coverImage: null, // Теперь строка (url/base64)
      },

      // Действия для обновления данных блога
      updateBlogData: (newData) =>
        set((state) => ({
          blogData: { ...state.blogData, ...newData },
        })),

      // Полная замена данных блога (для режима редактирования)
      setBlogData: (blogData) => {
        // Если есть photoName, используем его как coverImage
        // (coverImage будет содержать filename, а не URL)
        let coverImage = blogData.photoName || blogData.coverImage || null;

        set(() => ({
          blogData: {
            id: blogData.id || null,
            name: blogData.name || "",
            description: blogData.description || "",
            specializationId: blogData.specializationId || null,
            content: blogData.content || null,
            coverImage: coverImage,
          },
        }));
      },
      setCoverImage: async (coverImageString) => {
        // coverImageString — это строка (url или base64)
        set((state) => ({
          blogData: {
            ...state.blogData,
            coverImage: coverImageString,
          },
        }));
      },

      // Получение файла обложки
      // getCoverImageFile больше не нужен, coverImage теперь строка

      // Сброс всех данных блога
      resetBlog: () => {
        set({
          blogData: {
            id: null,
            name: "",
            description: "",
            specializationId: null,
            content: null,
            coverImage: null,
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
      // Сохраняем все как есть, coverImage теперь строка
      partialize: (state) => ({
        blogData: {
          ...state.blogData,
        },
      }),
      // Больше не нужно восстанавливать превью из base64
      onRehydrateStorage: () => (state) => state,
    },
  ),
);
