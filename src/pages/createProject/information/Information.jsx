import React, { useEffect, useMemo } from "react";

import { useProjectStore } from "../../../shared/store/projectStore";
import Button from "../../../shared/ui/components/button/Button";
import Header from "../../../shared/ui/components/header/Header";
import Input from "../../../shared/ui/components/input/Input";
import Select from "../../../shared/ui/components/input/Select";
import Textarea from "../../../shared/ui/components/input/Textarea";
import CreateProjectNav from "../CreateProjectNav";
import { useCreateProject } from "../project/hooks/useCreateProject";
import styles from "./Information.module.css";
import { useFetchOptions } from "./hooks/useFetchOptions";

export default function Information() {
  const { projectData, updateProjectData, setCoverImage, resetProject } =
    useProjectStore();
  const {
    createProject,
    updateProject,
    loading: createLoading,
    error: createError,
    success,
  } = useCreateProject();
  const {
    specializations,
    categories,
    loading: fetchLoading,
    error: fetchError,
  } = useFetchOptions();

  // Проверяем, находимся ли в режиме редактирования
  const editProjectId = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("edit");
  }, []);

  const isEditMode = !!editProjectId;

  // Очистка blob URL при размонтировании компонента
  useEffect(() => {
    const currentPreview = projectData.coverImagePreview;
    return () => {
      if (currentPreview && currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [projectData.coverImagePreview]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    await setCoverImage(file);
  };

  const handleImageDelete = async () => {
    await setCoverImage(null);
  };

  const handleInputChange = (id, value) => {
    updateProjectData({ [id]: value });
  };

  const handleSelectChange = (id, option) => {
    updateProjectData({ [id]: option.value });
  };

  const handlePublish = async () => {
    // Валидация обязательных полей
    if (!projectData.name) {
      alert("Пожалуйста, введите название проекта");
      return;
    }

    if (!projectData.description) {
      alert("Пожалуйста, введите описание проекта");
      return;
    }

    if (!projectData.categoryId) {
      alert("Пожалуйста, выберите нишу");
      return;
    }

    if (!projectData.specializationId) {
      alert("Пожалуйста, выберите направление");
      return;
    }

    try {
      if (isEditMode) {
        await updateProject(editProjectId, projectData);
        alert("Проект успешно обновлен!");
        // Очищаем store и localStorage после успешного обновления
        resetProject();
        localStorage.removeItem("editingProject");
        window.location.href = "/profile";
      } else {
        await createProject(projectData);
        alert("Проект успешно опубликован!");
        resetProject();
      }
    } catch (err) {
      alert(
        `Ошибка при ${isEditMode ? "обновлении" : "публикации"}: ${err.message}`,
      );
    }
  };

  return (
    <div>
      <Header darkBackground={true} />
      <CreateProjectNav
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
          {success && (
            <div style={{ color: "green", marginBottom: "20px" }}>
              Проект успешно опубликован!
            </div>
          )}
          <div className={styles.wrapper}>
            <h2>Обложка проекта</h2>
            <div className="stripe2"></div>
            <div className={styles.form}>
              <div className={styles.img_form}>
                {projectData.coverImagePreview ||
                projectData.coverImageBase64 ? (
                  <img
                    src={
                      projectData.coverImagePreview ||
                      projectData.coverImageBase64
                    }
                    alt="Project Cover"
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
                value={projectData.specializationId}
                onChange={(option) =>
                  handleSelectChange("specializationId", option)
                }
                isLoading={fetchLoading}
                placeholder="Выберите направление"
              />
              <Select
                label="Ниша"
                id="categoryId"
                theme="white"
                options={categories}
                value={projectData.categoryId}
                onChange={(option) => handleSelectChange("categoryId", option)}
                isLoading={fetchLoading}
                placeholder="Выберите нишу"
              />
            </div>
          </div>

          <div className={styles.wrapper}>
            <h2>О проекте</h2>
            <div className="stripe2"></div>
            <div className={styles.form}>
              <Input
                label="Название проекта"
                id="name"
                theme="white"
                style={{ width: "100%" }}
                className={styles.fullWidthInput}
                value={projectData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className={styles.form}>
              <Textarea
                label="Описание проекта"
                id="description"
                theme="white"
                className={styles.fullWidthInput}
                value={projectData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>
          </div>

          <div className={styles.wrapper}>
            <h2>Ссылки на проект</h2>
            <div className="stripe2"></div>
            <div className={styles.formSelect}>
              <Input
                label="Ссылка 1"
                id="firstLink"
                theme="white"
                value={projectData.firstLink}
                onChange={(e) => handleInputChange("firstLink", e.target.value)}
              />
              <Input
                label="Ссылка 2"
                id="secondLink"
                theme="white"
                value={projectData.secondLink}
                onChange={(e) =>
                  handleInputChange("secondLink", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
