import React, { useEffect, useMemo } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useBlogStore } from "../../../shared/store/blogStore";
import Button from "../../../shared/ui/components/button/Button";
import Header from "../../../shared/ui/components/header/Header";
import Input from "../../../shared/ui/components/input/Input";
import Select from "../../../shared/ui/components/input/Select";
import Textarea from "../../../shared/ui/components/input/Textarea";
import CreateArticleNav from "../CreateArticleNav";
import { useCreateBlog } from "../article/hooks/useCreateBlog";
import styles from "./Information.module.css";
import { useFetchOptions } from "./hooks/useFetchOptions";

export default function Information() {
  const navigate = useNavigate();
  const {
    blogData,
    updateBlogData,
    setCoverImage,
    resetBlog,
    getCoverImageFile,
  } = useBlogStore();
  const {
    createBlog,
    loading: createLoading,
    error: createError,
  } = useCreateBlog();
  const {
    specializations,
    loading: fetchLoading,
    error: fetchError,
  } = useFetchOptions();

  // Восстанавливаем файл из base64 если он есть, но файл отсутствует
  useEffect(() => {
    if (blogData.coverImageBase64 && !blogData.coverImage) {
      // Конвертируем base64 обратно в файл
      const base64ToFile = (base64, fileName = "cover-image") => {
        const arr = base64.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, { type: mime });
      };

      try {
        const file = base64ToFile(blogData.coverImageBase64);
        setCoverImage(file);
        console.log("Restored file from base64:", file);
      } catch (error) {
        console.error("Error restoring file from base64:", error);
      }
    }
  }, [blogData.coverImageBase64, blogData.coverImage, setCoverImage]);

  // Очистка blob URL при размонтировании компонента
  useEffect(() => {
    const currentPreview = blogData.coverImagePreview;
    return () => {
      if (currentPreview && currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [blogData.coverImagePreview]);

  // Отслеживаем изменения coverImage
  useEffect(() => {
    console.log("coverImage changed:", blogData.coverImage);
    console.log("coverImage type:", typeof blogData.coverImage);
    console.log(
      "coverImage instanceof File:",
      blogData.coverImage instanceof File,
    );
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

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    console.log("File name:", file?.name);
    console.log("File size:", file?.size);
    await setCoverImage(file);

    // Даем время store обновиться
    setTimeout(() => {
      console.log(
        "After setCoverImage (delayed), blogData.coverImage:",
        blogData.coverImage,
      );
    }, 100);
  };

  const handleImageDelete = async () => {
    await setCoverImage(null);
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

    // Получаем файл обложки из файлового стора
    const coverImageFile = getCoverImageFile();

    // Логирование для отладки
    console.log("Blog data before send:", blogData);
    console.log("Cover image file:", coverImageFile);
    console.log("Cover image file type:", typeof coverImageFile);
    console.log("Is File instance:", coverImageFile instanceof File);

    try {
      const blogSubmitData = {
        name: blogData.name,
        specializationId: blogData.specializationId,
        content: blogData.content,
        coverImage: coverImageFile,
      };

      await createBlog(blogSubmitData);
      toast.success("Статья успешно опубликована!");
      resetBlog();
      navigate("/blog");
    } catch (err) {
      toast.error(`Ошибка при публикации: ${err.message}`);
    }
  };

  return (
    <div>
      <Header darkBackground={true} />
      <CreateArticleNav
        onPublish={handlePublish}
        isLoading={createLoading || fetchLoading}
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
                {blogData.coverImagePreview || blogData.coverImageBase64 ? (
                  <img
                    src={
                      blogData.coverImagePreview || blogData.coverImageBase64
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
