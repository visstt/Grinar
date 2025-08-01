import React, { useCallback, useState } from "react";

import { Editor, Element as SlateElement, Transforms } from "slate";
import { Editable, ReactEditor, useSlate } from "slate-react";

import styles from "./ArticleEditor.module.css";
import ContentMenu from "./ContentMenu";
import MediaModal from "./MediaModal";

const ArticleEditor = ({ onShowToolbar }) => {
  const editor = useSlate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("image");
  const [activeLineId, setActiveLineId] = useState(null);

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

  const insertVideo = useCallback((editor, url) => {
    const video = {
      type: "video",
      url,
      children: [{ text: "" }],
    };

    Transforms.insertNodes(editor, video);

    const emptyParagraph = {
      type: "paragraph",
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, emptyParagraph);
  }, []);

  const addTextBlock = useCallback(() => {
    const textBlock = {
      type: "paragraph",
      children: [{ text: "" }],
    };

    Transforms.insertNodes(editor, textBlock);
    ReactEditor.focus(editor);
    setMenuOpen(false);
  }, [editor]);

  const handleAddImage = useCallback(() => {
    setModalType("image");
    setModalOpen(true);
    setMenuOpen(false);
  }, []);

  const handleAddVideo = useCallback(() => {
    setModalType("video");
    setModalOpen(true);
    setMenuOpen(false);
  }, []);

  const handleMediaUpload = useCallback(
    (url) => {
      if (modalType === "image") {
        insertImage(editor, url);
      } else {
        insertVideo(editor, url);
      }
    },
    [modalType, insertImage, insertVideo, editor],
  );

  const handleSelectionChange = useCallback(() => {
    const { selection } = editor;

    if (selection && !Editor.isCollapsed(editor, selection)) {
      onShowToolbar && onShowToolbar(true);
    }
  }, [editor, onShowToolbar]);

  const handleEditorChange = useCallback(() => {
    // Показываем тулбар при любом изменении в редакторе
    onShowToolbar && onShowToolbar(true);
  }, [onShowToolbar]);

  const handleEditorFocus = useCallback(() => {
    setActiveLineId("editor");
    onShowToolbar && onShowToolbar(true);
  }, [onShowToolbar]);

  const handleEditorBlur = useCallback((e) => {
    // Проверяем, не кликнули ли на элемент меню
    if (e.relatedTarget && e.relatedTarget.closest('[class*="ContentMenu"]')) {
      return; // Не скрываем меню если кликнули на него
    }
    // Небольшая задержка чтобы не скрывать меню слишком быстро
    setTimeout(() => setActiveLineId(null), 100);
  }, []);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "title":
        return (
          <h1
            className={styles.title}
            {...props.attributes}
            style={{ textAlign: props.element.align || "left" }}
          >
            {props.children}
          </h1>
        );
      case "description":
        return (
          <p
            className={styles.editableDescription}
            {...props.attributes}
            style={{ textAlign: props.element.align || "left" }}
          >
            {props.children}
          </p>
        );
      case "heading":
        return (
          <h2
            className={styles.heading}
            {...props.attributes}
            style={{ textAlign: props.element.align || "left" }}
          >
            {props.children}
          </h2>
        );
      case "paragraph": {
        const isEmpty = props.element.children?.[0]?.text === "";
        return (
          <div className={styles.paragraphWrapper} {...props.attributes}>
            <p
              className={styles.paragraph}
              style={{ textAlign: props.element.align || "left" }}
              data-placeholder={isEmpty ? "Продолжить писать..." : ""}
            >
              {props.children}
            </p>
          </div>
        );
      }
      case "image":
        return (
          <div className={styles.imageContainer} {...props.attributes}>
            <img
              src={props.element.url}
              alt=""
              className={styles.image}
              contentEditable={false}
            />
            {props.children}
          </div>
        );
      case "video":
        return (
          <div className={styles.videoContainer} {...props.attributes}>
            <video
              src={props.element.url}
              controls
              className={styles.video}
              contentEditable={false}
            />
            {props.children}
          </div>
        );
      case "link":
        return (
          <a
            {...props.attributes}
            href={props.element.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Ctrl + Click чтобы открыть ссылку"
            style={{
              color: "#195ee6",
              textDecoration: "underline",
              cursor: "text",
            }}
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey) {
                // Открываем ссылку только при Ctrl+Click (или Cmd+Click на Mac)
                e.preventDefault();
                e.stopPropagation();
                window.open(props.element.url, "_blank", "noopener,noreferrer");
              }
              // Без Ctrl - обычное поведение текста (не блокируем событие)
            }}
            onMouseEnter={(e) => {
              // Показываем pointer при зажатом Ctrl
              const updateCursor = () => {
                if (e.target) {
                  e.target.style.cursor =
                    window.event?.ctrlKey || window.event?.metaKey
                      ? "pointer"
                      : "text";
                }
              };
              updateCursor();

              // Добавляем слушатели для отслеживания Ctrl в реальном времени
              const handleKeyDown = (keyEvent) => {
                if (keyEvent.ctrlKey || keyEvent.metaKey) {
                  e.target.style.cursor = "pointer";
                }
              };
              const handleKeyUp = (keyEvent) => {
                if (!keyEvent.ctrlKey && !keyEvent.metaKey) {
                  e.target.style.cursor = "text";
                }
              };

              document.addEventListener("keydown", handleKeyDown);
              document.addEventListener("keyup", handleKeyUp);

              // Убираем слушатели при уходе мыши
              e.target.addEventListener(
                "mouseleave",
                () => {
                  document.removeEventListener("keydown", handleKeyDown);
                  document.removeEventListener("keyup", handleKeyUp);
                },
                { once: true },
              );
            }}
          >
            {props.children}
          </a>
        );
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    let element = <span {...props.attributes}>{props.children}</span>;

    if (props.leaf.bold) {
      element = <strong>{element}</strong>;
    }

    if (props.leaf.italic) {
      element = <em>{element}</em>;
    }

    if (props.leaf.underline) {
      element = <u>{element}</u>;
    }

    if (props.leaf.color) {
      element = <span style={{ color: props.leaf.color }}>{element}</span>;
    }

    if (props.leaf.fontSize) {
      element = (
        <span style={{ fontSize: props.leaf.fontSize }}>{element}</span>
      );
    }

    if (props.leaf.fontFamily) {
      element = (
        <span style={{ fontFamily: props.leaf.fontFamily }}>{element}</span>
      );
    }

    return element;
  }, []);

  return (
    <div className="containerXS">
      <div className={styles.editorContainer}>
        <div className={styles.editorWrapper}>
          <Editable
            className={styles.editor}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder=""
            onSelectionChange={handleSelectionChange}
            onChange={handleEditorChange}
            onFocus={handleEditorFocus}
            onBlur={handleEditorBlur}
          />

          {activeLineId === "editor" && (
            <div className={styles.editorContentMenu}>
              <ContentMenu
                isOpen={menuOpen}
                onToggle={() => setMenuOpen(!menuOpen)}
                onAddText={addTextBlock}
                onAddImage={handleAddImage}
                onAddVideo={handleAddVideo}
              />
            </div>
          )}
        </div>

        <MediaModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onUpload={handleMediaUpload}
          type={modalType}
        />
      </div>
    </div>
  );
};

export default ArticleEditor;
