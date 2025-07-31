import React, { useCallback, useMemo, useState } from "react";

import { Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";

import Header from "../../../shared/ui/components/header/Header";
import CreateProjectNav from "../CreateProjectNav";
import styles from "./CreateProject.module.css";
import ArticleEditor from "./components/ArticleEditor";
import Toolbar from "./components/Toolbar";

export default function CreateProject() {
  const [showToolbar, setShowToolbar] = useState(false);

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

  const initialValue = [
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
  return (
    <div className={styles.container}>
      <Header darkBackground={true} />
      <Slate editor={editor} initialValue={initialValue}>
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
