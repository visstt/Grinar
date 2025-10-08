import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useBlogStore } from "../../../shared/store/blogStore";
import Button from "../../../shared/ui/components/button/Button";
import Header from "../../../shared/ui/components/header/Header";
import Input from "../../../shared/ui/components/input/Input";
import Select from "../../../shared/ui/components/input/Select";
import Textarea from "../../../shared/ui/components/input/Textarea";
import { getBlogPhotoUrl } from "../../../shared/utils/getProjectImageUrl";
import CreateArticleNav from "../CreateArticleNav";
import { useCreateBlog } from "../article/hooks/useCreateBlog";
import { useCreateArticleContext } from "../context/CreateArticleContext";
import styles from "./Information.module.css";
import { useFetchOptions } from "./hooks/useFetchOptions";

export default function Information() {
  const navigate = useNavigate();
  const { blogData, updateBlogData, isEditMode, resetBlog } =
    useCreateArticleContext();
  const { setCoverImage } = useBlogStore();
  const {
    createBlog,
    updateBlog,
    loading: createLoading,
    error: createError,
  } = useCreateBlog();
  const {
    specializations,
    loading: fetchLoading,
    error: fetchError,
  } = useFetchOptions();

  // Больше не нужно восстанавливать файл из base64, coverImage теперь строка (url/base64)

  // Очистка blob URL при размонтировании компонента
  useEffect(() => {
    const currentPreview = blogData.coverImagePreview;
    return () => {
      if (currentPreview && currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [blogData.coverImagePreview]);

  // coverImage теперь строка (url/base64), можно логировать для отладки
  useEffect(() => {
    if (blogData.coverImage) {
      console.log("Cover image:", blogData.coverImage);
      if (!blogData.coverImage.startsWith("data:")) {
        const photoUrl = getBlogPhotoUrl(blogData.coverImage);
        console.log("Generated photo URL:", photoUrl);
      }
    }
  }, [blogData.coverImage]);

  // Очистка blob URL при размонтировании компонента
  useEffect(() => {
    const currentPreview = blogData.coverImagePreview;
    return () => {
      if (currentPreview && currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [blogData.coverImagePreview]);

  // Очищаем данные при размонтировании компонента только если покидаем весь процесс создания/редактирования статьи
  useEffect(() => {
    return () => {
      // Проверяем, переходим ли мы на страницы, не связанные с созданием статьи
      const currentPath = window.location.pathname;
      const isArticleRelatedPage =
        currentPath === "/create-article" ||
        currentPath === "/article-information";

      // Очищаем только если покидаем страницы создания статьи и не в режиме редактирования
      if (!isArticleRelatedPage && !isEditMode) {
        localStorage.removeItem("editingBlog");
      }
    };
  }, [isEditMode]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    // Конвертируем файл в base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setCoverImage(base64); // Сохраняем строку base64
    };
    reader.readAsDataURL(file);
  };

  const handleImageDelete = async () => {
    updateBlogData({ coverImage: null });
  };

  const handleInputChange = (id, value) => {
    updateBlogData({ [id]: value });
  };

  const handleSelectChange = (id, option) => {
    updateBlogData({ [id]: option.value });
  };

  const handlePublish = async () => {
    // Валидация обязательных полей
    if (!blogData.name) {
      alert("Пожалуйста, введите название статьи");
      return;
    }

    if (!blogData.specializationId) {
      alert("Пожалуйста, выберите направление");
      return;
    }

    // Получаем строку обложки (url/base64/filename)
    let coverImageToSend = blogData.coverImage;

    // Если это base64, преобразуем в File
    if (coverImageToSend && coverImageToSend.startsWith("data:image")) {
      const arr = coverImageToSend.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      coverImageToSend = new File([u8arr], "cover-image.png", { type: mime });
    } else if (
      coverImageToSend &&
      !coverImageToSend.startsWith("http") &&
      !coverImageToSend.includes("/")
    ) {
      // Если это просто имя файла (как при редактировании), не отправляем его
      // т.к. оно уже существует на сервере
      coverImageToSend = null;
    }

    // ...existing code...

    try {
      if (isEditMode) {
        const blogUpdateData = {
          name: blogData.name,
          specializationId: blogData.specializationId,
          content: blogData.content,
          coverImage: coverImageToSend,
        };

        // ...existing code...

        await updateBlog(blogData.id, blogUpdateData);
        toast.success("Статья успешно обновлена!");
        // Очищаем store и localStorage после успешного обновления
        resetBlog();
        localStorage.removeItem("editingBlog");
        navigate("/profile");
      } else {
        const blogSubmitData = {
          name: blogData.name,
          specializationId: blogData.specializationId,
          content: blogData.content,
          coverImage: coverImageToSend,
        };

        await createBlog(blogSubmitData);
        toast.success("Статья успешно опубликована!");
        resetBlog();
        navigate("/blog");
      }
    } catch (err) {
      toast.error(
        `Ошибка при ${isEditMode ? "обновлении" : "публикации"}: ${err.message}`,
      );
    }
  };

  return (
    <div>
      <Header darkBackground={true} />
      <CreateArticleNav
        onPublish={handlePublish}
        isLoading={createLoading || fetchLoading}
        isEditMode={isEditMode}
      />
      <div className="containerXS">
        <div className={styles.content}>
          {(createError || fetchError) && (
            <div style={{ color: "red", marginBottom: "20px" }}>
              Ошибка: {createError || fetchError}
            </div>
          )}
          <div className={styles.wrapper}>
            <h2>Название статьи</h2>
            <div className="stripe2"></div>
            <div className={styles.form}>
              <Input
                label="Название"
                id="name"
                theme="white"
                style={{ width: "100%" }}
                className={styles.fullWidthInput}
                value={blogData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
          </div>
          <div className={styles.wrapper}>
            <h2>Обложка проекта</h2>
            <div className="stripe2"></div>
            <div className={styles.form}>
              <div className={styles.img_form}>
                {blogData.coverImage ? (
                  <img
                    src={
                      blogData.coverImage.startsWith("data:")
                        ? blogData.coverImage
                        : getBlogPhotoUrl(blogData.coverImage)
                    }
                    alt="Blog Cover"
                    className={styles.coverImage}
                  />
                ) : (
                  <div className={styles.coverImagePlaceholder}></div>
                )}
                <label style={{ color: "#141414", opacity: 0.5 }}>
                  Рекомендуемый размер <br />
                  600x400 px
                </label>
              </div>
              <div className={styles.btn_container}>
                <label
                  className={`${styles.button} ${styles.fileInput} ${styles.btn}`}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  Изменить
                </label>
                <Button
                  variant="default"
                  className={styles.btn}
                  onClick={handleImageDelete}
                >
                  Удалить
                </Button>
              </div>
            </div>
          </div>

          <div className={styles.wrapper}>
            <h2>Направления проекта</h2>
            <div className="stripe2"></div>
            <div className={styles.formSelect}>
              <Select
                label="Направление"
                id="specializationId"
                theme="white"
                options={specializations}
                value={blogData.specializationId}
                onChange={(option) =>
                  handleSelectChange("specializationId", option)
                }
                isLoading={fetchLoading}
                placeholder="Выберите направление"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
