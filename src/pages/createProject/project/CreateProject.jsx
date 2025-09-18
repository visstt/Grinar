import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Editor, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";

import { useProjectStore } from "../../../shared/store/projectStore";
import Header from "../../../shared/ui/components/header/Header";
import CreateProjectNav from "../CreateProjectNav";
import styles from "./CreateProject.module.css";
import ArticleEditor from "./components/ArticleEditor";
import Toolbar from "./components/Toolbar";

export default function CreateProject() {
  const [showToolbar, setShowToolbar] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const { projectData, updateProjectData, setProjectData, resetProject } =
    useProjectStore();

  // Проверяем, находимся ли в режиме редактирования
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editProjectId = urlParams.get("edit");

    // Только если editProjectId действительно изменился
    if (currentEditId !== editProjectId) {
      setCurrentEditId(editProjectId);

      if (editProjectId) {
        // Затем загружаем данные конкретного проекта из localStorage
        const editingProject = localStorage.getItem("editingProject");
        if (editingProject) {
          try {
            const projectData = JSON.parse(editingProject);
            // Проверяем, что данные относятся к нужному проекту
            if (projectData.id && projectData.id.toString() === editProjectId) {
              setProjectData(projectData);
              console.log(`Загружены данные проекта ${editProjectId}`);
            } else {
              // Если данные от другого проекта - очищаем и не загружаем
              localStorage.removeItem("editingProject");
              console.log(
                `Данные в localStorage относятся к проекту ${projectData.id}, а нужен ${editProjectId}, очищаем`,
              );
            }
          } catch (error) {
            console.error("Ошибка при парсинге данных проекта:", error);
            localStorage.removeItem("editingProject");
          }
        }
      } else if (currentEditId !== null) {
        // Если переходим из режима редактирования в обычный режим - очищаем только тогда
        resetProject();
        localStorage.removeItem("editingProject");
      }
    }
  }, [currentEditId, setProjectData, resetProject]); // Возвращаем зависимости

  // Очищаем данные при размонтировании компонента (если пользователь покидает страницу)
  useEffect(() => {
    return () => {
      // Очищаем только если не в режиме редактирования
      const urlParams = new URLSearchParams(window.location.search);
      const editProjectId = urlParams.get("edit");
      if (!editProjectId) {
        localStorage.removeItem("editingProject");
      }
    };
  }, []);

  const insertImage = useCallback((editor, url) => {
    const image = {
      type: "image",
      url,
      children: [{ text: "" }],
    };

    // Вставляем изображение
    Transforms.insertNodes(editor, image);

    // Добавляем пустой параграф после изображения для удобства редактирования
    const emptyParagraph = {
      type: "paragraph",
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, emptyParagraph);
  }, []);

  const withImages = useCallback(
    (editor) => {
      const { insertData, isVoid } = editor;

      editor.isVoid = (element) => {
        return element.type === "image" ? true : isVoid(element);
      };

      editor.insertData = (data) => {
        const { files } = data;

        if (files && files.length > 0) {
          for (const file of files) {
            const reader = new FileReader();
            const [mime] = file.type.split("/");

            if (mime === "image") {
              reader.addEventListener("load", () => {
                const url = reader.result;
                insertImage(editor, url);
              });

              reader.readAsDataURL(file);
            }
          }
          return; // Предотвращаем дублирование
        } else {
          insertData(data);
        }
      };

      return editor;
    },
    [insertImage],
  );

  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    [withImages],
  );

  const initialValue = projectData.content || [
    {
      type: "title",
      children: [{ text: "Здесь может быть заголовок" }],
    },
    {
      type: "description",
      children: [{ text: "Здесь можно добавить описание" }],
    },
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];

  const handleEditorChange = (value) => {
    updateProjectData({ content: value });
  };

  return (
    <div className={styles.container}>
      <Header darkBackground={true} />
      <Slate
        key="project-editor" // Используем стабильный ключ, чтобы редактор не пересоздавался
        editor={editor}
        initialValue={initialValue}
        onChange={handleEditorChange}
      >
        {showToolbar && (
          <div className={styles.toolbarSection}>
            <Toolbar />
          </div>
        )}
        <CreateProjectNav />
        <div className={styles["container-xs"]}>
          <ArticleEditor onShowToolbar={setShowToolbar} />
        </div>
      </Slate>
    </div>
  );
}
