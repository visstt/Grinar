import React, { useCallback, useMemo, useState } from "react";

import { Editor, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";

import Header from "../../../shared/ui/components/header/Header";
import CreateArticleNav from "../CreateArticleNav";
import { useCreateArticleContext } from "../context/CreateArticleContext";
import styles from "./CreateArticle.module.css";
import ArticleEditor from "./components/ArticleEditor";
import Toolbar from "./components/Toolbar";

export default function CreateArticle() {
  const [showToolbar, setShowToolbar] = useState(false);
  const { blogData, updateBlogData, isDataLoaded, currentEditId } =
    useCreateArticleContext();

  const insertImage = useCallback((editor, url) => {
    const image = {
      type: "image",
      url,
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, image);
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
          return;
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

  const initialValue = blogData.content || [
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

  console.log("Initial value для редактора:", initialValue);
  console.log("Blog data content:", blogData.content);

  const handleEditorChange = (value) => {
    updateBlogData({ content: value });
  };

  // Показываем загрузку пока данные не готовы
  if (!isDataLoaded) {
    return (
      <div className={styles.container}>
        <Header darkBackground={true} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            fontSize: "18px",
          }}
        >
          Загрузка...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header darkBackground={true} />
      <Slate
        key={currentEditId || "new"} // Добавляем ключ для принудительного обновления редактора
        editor={editor}
        initialValue={initialValue}
        onChange={handleEditorChange}
      >
        {showToolbar && (
          <div className={styles.toolbarSection}>
            <Toolbar />
          </div>
        )}
        <CreateArticleNav isEditMode={!!blogData.id} />
        <div className={styles["container-xs"]}>
          <ArticleEditor onShowToolbar={setShowToolbar} />
        </div>
      </Slate>
    </div>
  );
}
