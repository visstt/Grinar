import React, { useCallback, useEffect, useState } from "react";

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
  const [isDragging, setIsDragging] = useState(false);
  const [_dragOverElement, _setDragOverElement] = useState(null);
  const [_dragSourceElement, setDragSourceElement] = useState(null);
  const [_draggedElementPath, setDraggedElementPath] = useState(null);
  const [_dropIndicatorPosition, setDropIndicatorPosition] = useState(null);
  const [menuPosition, setMenuPosition] = useState({
    top: null,
    left: window.innerWidth <= 768 ? -45 : -60,
    bottom: null,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);

      if (newIsMobile !== isMobile) {
        if (newIsMobile) {
          setMenuPosition({ top: null, left: -45, bottom: null });
        } else {
          setMenuPosition({ top: null, left: -60, bottom: null });
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  useEffect(() => {
    const loadGoogleFonts = () => {
      if (document.querySelector('link[href*="fonts.googleapis.com"]')) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?" +
        "family=Manrope:wght@400;500;600;700&" +
        "family=Courier+Prime:wght@400;700&" +
        "family=Inter:wght@400;500;600;700&" +
        "family=Roboto:wght@400;500;700&" +
        "family=Open+Sans:wght@400;600;700&" +
        "family=Lato:wght@400;700&" +
        "family=Montserrat:wght@400;600;700&" +
        "family=Poppins:wght@400;500;600;700&" +
        "family=Source+Sans+Pro:wght@400;600;700&" +
        "family=Nunito:wght@400;600;700&" +
        "family=Playfair+Display:wght@400;700&" +
        "family=Merriweather:wght@400;700&" +
        "family=Crimson+Text:wght@400;600;700&" +
        "family=Libre+Baskerville:wght@400;700&" +
        "family=Noto+Serif:wght@400;700&" +
        "family=Noto+Sans:wght@400;500;600;700&" +
        "family=Source+Serif+Pro:wght@400;600;700&" +
        "family=IBM+Plex+Sans:wght@400;500;600;700&" +
        "family=IBM+Plex+Serif:wght@400;500;600;700&" +
        "family=Fira+Sans:wght@400;500;600;700&" +
        "family=Work+Sans:wght@400;500;600;700&" +
        "display=swap";
      document.head.appendChild(link);
    };
    loadGoogleFonts();
  }, []);

  useEffect(() => {
    setActiveLineId("editor");
  }, []);

  const insertImage = useCallback((editor, url) => {
    const image = { type: "image", url, children: [{ text: "" }] };
    Transforms.insertNodes(editor, image);
  }, []);

  const insertVideo = useCallback((editor, url) => {
    const video = { type: "video", url, children: [{ text: "" }] };
    Transforms.insertNodes(editor, video);
  }, []);

  const addTextBlock = useCallback(() => {
    const textBlock = { type: "paragraph", children: [{ text: "" }] };
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

  const updateMenuPosition = useCallback(() => {
    if (isMobile) {
      try {
        const { selection } = editor;
        if (!selection) {
          setMenuPosition({ top: 0, left: -45, bottom: null });
          return;
        }

        const domRange = ReactEditor.toDOMRange(editor, selection);
        const rect = domRange.getBoundingClientRect();
        const editorElement = ReactEditor.toDOMNode(editor, editor);
        const editorRect = editorElement.getBoundingClientRect();

        if (rect.height === 0 || rect.width === 0) {
          try {
            const [, path] = Editor.node(editor, selection);
            const [parent] = Editor.parent(editor, path);

            const nodeElement = ReactEditor.toDOMNode(editor, parent);
            const nodeRect = nodeElement.getBoundingClientRect();

            if (nodeRect.height > 0) {
              const top = nodeRect.top - editorRect.top;
              const left = -45;
              setMenuPosition({ top: Math.max(0, top), left, bottom: null });
              return;
            }
          } catch {
            // Fallback если не удается получить элемент
          }
        }

        const top = rect.top - editorRect.top;
        const left = -45;
        setMenuPosition({ top: Math.max(0, top), left, bottom: null });
      } catch {
        setMenuPosition({ top: 0, left: -45, bottom: null });
      }
      return;
    }

    try {
      const { selection } = editor;
      if (!selection) {
        setMenuPosition({ top: 0, left: -60, bottom: null });
        return;
      }

      const domRange = ReactEditor.toDOMRange(editor, selection);
      const rect = domRange.getBoundingClientRect();
      const editorElement = ReactEditor.toDOMNode(editor, editor);
      const editorRect = editorElement.getBoundingClientRect();

      // Проверяем, корректны ли размеры rect
      if (rect.height === 0 || rect.width === 0) {
        // Для пустых элементов используем позицию курсора
        try {
          const [, path] = Editor.node(editor, selection);
          const [parent] = Editor.parent(editor, path);

          // Получаем DOM элемент параграфа
          const nodeElement = ReactEditor.toDOMNode(editor, parent);
          const nodeRect = nodeElement.getBoundingClientRect();

          if (nodeRect.height > 0) {
            const top = nodeRect.top - editorRect.top;
            const left = -60;
            setMenuPosition({ top: Math.max(0, top), left, bottom: null });
            return;
          }
        } catch {
          // Fallback если не удается получить элемент
        }
      }

      const top = rect.top - editorRect.top;
      const left = -60;
      setMenuPosition({ top: Math.max(0, top), left, bottom: null });
    } catch {
      setMenuPosition({ top: 0, left: -60, bottom: null });
    }
  }, [editor, isMobile]);

  const handleEditorChange = useCallback(() => {
    setActiveLineId("editor"); // Устанавливаем activeLineId при изменении контента
    onShowToolbar && onShowToolbar(true);
    const { selection } = editor;
    if (selection && !Editor.isCollapsed(editor, selection)) {
      onShowToolbar && onShowToolbar(true);
    }
    // Задержка для стабильного обновления позиции
    setTimeout(() => {
      updateMenuPosition();
    }, 100);
  }, [onShowToolbar, editor, updateMenuPosition]);

  const handleEditorFocus = useCallback(() => {
    setActiveLineId("editor");
    onShowToolbar && onShowToolbar(true);

    // Задержка для корректного обновления позиции
    setTimeout(() => {
      updateMenuPosition();
    }, 50);
  }, [onShowToolbar, updateMenuPosition]);

  const handleEditorClick = useCallback(() => {
    setActiveLineId("editor"); // Устанавливаем activeLineId при клике
    const { selection } = editor;
    if (!selection) return;
    try {
      const [node, path] = Editor.node(editor, selection);
      const [parent] = Editor.parent(editor, path);
      const isTitlePlaceholder =
        parent?.type === "title" && node?.text === "Здесь может быть заголовок";
      const isDescriptionPlaceholder =
        parent?.type === "description" &&
        node?.text === "Здесь можно добавить описание";
      if (isTitlePlaceholder || isDescriptionPlaceholder) {
        const startPoint = Editor.start(editor, path);
        Transforms.select(editor, startPoint);
      }
    } catch {
      // Silent catch
    }
    // Увеличиваем задержку для пустых параграфов
    setTimeout(() => {
      updateMenuPosition();
    }, 100);
  }, [editor, updateMenuPosition]);

  const handleKeyDown = useCallback(
    (e) => {
      const navigationKeys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        "PageUp",
        "PageDown",
      ];
      if (navigationKeys.includes(e.key)) {
        setTimeout(() => updateMenuPosition(), 100);
      }
      const { selection } = editor;
      if (!selection) return;
      const [node, path] = Editor.node(editor, selection);
      const [parent] = Editor.parent(editor, path);
      if (
        !navigationKeys.includes(e.key) &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        e.key.length === 1
      ) {
        if (
          parent.type === "title" &&
          node.text === "Здесь может быть заголовок"
        ) {
          e.preventDefault();
          Transforms.delete(editor, {
            at: {
              anchor: Editor.start(editor, path),
              focus: Editor.end(editor, path),
            },
          });
          Transforms.insertText(editor, e.key);
        } else if (
          parent.type === "description" &&
          node.text === "Здесь можно добавить описание"
        ) {
          e.preventDefault();
          Transforms.delete(editor, {
            at: {
              anchor: Editor.start(editor, path),
              focus: Editor.end(editor, path),
            },
          });
          Transforms.insertText(editor, e.key);
        }
      }
    },
    [editor, updateMenuPosition],
  );

  const handleEditorBlur = useCallback((e) => {
    if (e.relatedTarget && e.relatedTarget.closest('[class*="ContentMenu"]')) {
      return;
    }
    setTimeout(() => setActiveLineId(null), 100);
  }, []);

  // Универсальная функция для начала перетаскивания любого элемента
  const handleElementDragStart = useCallback(
    (e, element) => {
      if (isMobile) return;
      setIsDragging(true);
      setDragSourceElement(element);

      try {
        const path = ReactEditor.findPath(editor, element);
        setDraggedElementPath(path);

        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.dropEffect = "move";

        const elementData = JSON.stringify({
          type: element.type,
          url: element.url || null,
          path: path,
          dragType: "slate-element",
        });

        e.dataTransfer.setData("text/plain", elementData);
        e.dataTransfer.setData("application/json", elementData);

        // Создаём невидимое изображение для drag
        const dragImage = document.createElement("div");
        dragImage.style.opacity = "0";
        dragImage.style.position = "absolute";
        dragImage.style.top = "-1000px";
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);

        setTimeout(() => {
          if (document.body.contains(dragImage)) {
            document.body.removeChild(dragImage);
          }
        }, 0);
      } catch {
        setIsDragging(false);
        setDragSourceElement(null);
        setDraggedElementPath(null);
      }
    },
    [editor, isMobile],
  );

  // Обработка перетаскивания над областью редактора
  const handleEditorDragOver = useCallback(
    (e) => {
      if (isMobile || !isDragging) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      // Получаем координаты редактора
      const editorRect = e.currentTarget.getBoundingClientRect();
      const relativeY = e.clientY - editorRect.top;

      // Находим элемент в той позиции где находится курсор
      const elements = Array.from(
        e.currentTarget.querySelectorAll('[data-slate-node="element"]'),
      );
      let targetIndex = 0;

      for (let i = 0; i < elements.length; i++) {
        const elementRect = elements[i].getBoundingClientRect();
        const elementY =
          elementRect.top - editorRect.top + elementRect.height / 2;

        if (relativeY > elementY) {
          targetIndex = i + 1;
        } else {
          break;
        }
      }

      setDropIndicatorPosition(targetIndex);
    },
    [isMobile, isDragging],
  );

  // Обработка отпускания элемента
  const handleEditorDrop = useCallback(
    (e) => {
      if (isMobile) return;
      e.preventDefault();
      e.stopPropagation();

      _setDragOverElement(null);
      setDropIndicatorPosition(null);

      try {
        let textData =
          e.dataTransfer.getData("text/plain") ||
          e.dataTransfer.getData("application/json");
        if (!textData) return;

        let parsedData;
        try {
          parsedData = JSON.parse(textData);
        } catch {
          return;
        }

        if (!parsedData.dragType || parsedData.dragType !== "slate-element")
          return;
        if (!parsedData.path) return;

        const sourcePath = parsedData.path;

        // Получаем координаты редактора
        const editorRect = e.currentTarget.getBoundingClientRect();
        const relativeY = e.clientY - editorRect.top;

        // Находим позицию для вставки по Y-координате
        const elements = Array.from(
          e.currentTarget.querySelectorAll('[data-slate-node="element"]'),
        );
        let targetIndex = editor.children.length; // По умолчанию в конец

        for (let i = 0; i < elements.length; i++) {
          const elementRect = elements[i].getBoundingClientRect();
          const elementY =
            elementRect.top - editorRect.top + elementRect.height / 2;

          if (relativeY < elementY) {
            targetIndex = i;
            break;
          }
        }

        const sourceIndex = sourcePath[0];

        // Если источник и цель одинаковые или рядом - не делаем ничего
        if (
          sourceIndex === targetIndex ||
          Math.abs(sourceIndex - targetIndex) <= 1
        )
          return;

        const [sourceNode] = Editor.node(editor, sourcePath);

        // Удаляем исходный элемент
        Transforms.removeNodes(editor, { at: sourcePath });

        // Вычисляем скорректированный индекс для вставки
        const adjustedTargetIndex =
          sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;

        try {
          Editor.withoutNormalizing(editor, () => {
            Transforms.insertNodes(editor, sourceNode, {
              at: [adjustedTargetIndex],
            });
          });
        } catch {
          // Fallback: вставляем в конец
          try {
            Editor.withoutNormalizing(editor, () => {
              Transforms.insertNodes(editor, sourceNode);
            });
          } catch {
            // Silent catch если и это не сработало
          }
        }
      } catch {
        // Silent catch
      } finally {
        setIsDragging(false);
        setDragSourceElement(null);
        setDraggedElementPath(null);
      }
    },
    [editor, isMobile],
  );

  const renderElement = useCallback(
    (props) => {
      switch (props.element.type) {
        case "title": {
          const isTitleDefault =
            props.element.children?.[0]?.text === "Здесь может быть заголовок";
          return (
            <div className={styles.titleWrapper} {...props.attributes}>
              {!isMobile && (
                <div className={styles.textDragHandle}>
                  <div
                    className={styles.dragIcon}
                    draggable={true}
                    onDragStart={(e) => {
                      e.stopPropagation();
                      handleElementDragStart(e, props.element);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onDragEnd={(e) => {
                      e.stopPropagation();
                      setIsDragging(false);
                      setDragSourceElement(null);
                      setDraggedElementPath(null);
                    }}
                    title="Перетащите для изменения порядка"
                    style={{ userSelect: "none", cursor: "grab" }}
                  >
                    <svg
                      width="29"
                      height="28"
                      viewBox="0 0 29 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="8.5"
                        y="5"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="5"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="8.5"
                        y="12"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="12"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="8.5"
                        y="19"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="19"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <h1
                className={`${styles.title} ${isTitleDefault ? styles.placeholderText : ""}`}
                style={{ textAlign: props.element.align || "left" }}
              >
                {props.children}
              </h1>
            </div>
          );
        }
        case "description": {
          const isDescriptionDefault =
            props.element.children?.[0]?.text ===
            "Здесь можно добавить описание";
          return (
            <div className={styles.descriptionWrapper} {...props.attributes}>
              {!isMobile && (
                <div className={styles.textDragHandle}>
                  <div
                    className={styles.dragIcon}
                    draggable={true}
                    onDragStart={(e) => {
                      e.stopPropagation();
                      handleElementDragStart(e, props.element);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onDragEnd={(e) => {
                      e.stopPropagation();
                      setIsDragging(false);
                      setDragSourceElement(null);
                      setDraggedElementPath(null);
                    }}
                    title="Перетащите для изменения порядка"
                    style={{ userSelect: "none", cursor: "grab" }}
                  >
                    <svg
                      width="29"
                      height="28"
                      viewBox="0 0 29 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="8.5"
                        y="5"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="5"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="8.5"
                        y="12"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="12"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="8.5"
                        y="19"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="19"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <p
                className={`${styles.editableDescription} ${isDescriptionDefault ? styles.placeholderText : ""}`}
                style={{ textAlign: props.element.align || "left" }}
              >
                {props.children}
              </p>
            </div>
          );
        }
        case "heading":
          return (
            <div className={styles.headingWrapper} {...props.attributes}>
              {!isMobile && (
                <div className={styles.textDragHandle}>
                  <div
                    className={styles.dragIcon}
                    draggable={true}
                    onDragStart={(e) => {
                      e.stopPropagation();
                      handleElementDragStart(e, props.element);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onDragEnd={(e) => {
                      e.stopPropagation();
                      setIsDragging(false);
                      setDragSourceElement(null);
                      setDraggedElementPath(null);
                    }}
                    title="Перетащите для изменения порядка"
                    style={{ userSelect: "none", cursor: "grab" }}
                  >
                    <svg
                      width="29"
                      height="28"
                      viewBox="0 0 29 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="8.5"
                        y="5"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="5"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="8.5"
                        y="12"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="12"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="8.5"
                        y="19"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="19"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <h2
                className={styles.heading}
                style={{ textAlign: props.element.align || "left" }}
              >
                {props.children}
              </h2>
            </div>
          );
        case "paragraph": {
          const isEmpty = props.element.children?.[0]?.text === "";
          return (
            <div className={styles.paragraphWrapper} {...props.attributes}>
              {!isMobile && (
                <div className={styles.textDragHandle}>
                  <div
                    className={styles.dragIcon}
                    draggable={true}
                    onDragStart={(e) => {
                      e.stopPropagation();
                      handleElementDragStart(e, props.element);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onDragEnd={(e) => {
                      e.stopPropagation();
                      setIsDragging(false);
                      setDragSourceElement(null);
                      setDraggedElementPath(null);
                    }}
                    title="Перетащите для изменения порядка"
                    style={{ userSelect: "none", cursor: "grab" }}
                  >
                    <svg
                      width="29"
                      height="28"
                      viewBox="0 0 29 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="8.5"
                        y="5"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="5"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="8.5"
                        y="12"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="12"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="8.5"
                        y="19"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="19"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                    </svg>
                  </div>
                </div>
              )}
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
            <div className={styles.imageWrapper} {...props.attributes}>
              {!isMobile && (
                <div className={styles.imageDragHandle}>
                  <div
                    className={styles.dragIcon}
                    draggable={true}
                    onDragStart={(e) => {
                      e.stopPropagation();
                      handleElementDragStart(e, props.element);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onDragEnd={(e) => {
                      e.stopPropagation();
                      setIsDragging(false);
                      setDragSourceElement(null);
                      setDraggedElementPath(null);
                    }}
                    title="Перетащите для изменения порядка"
                    style={{ userSelect: "none", cursor: "grab" }}
                  >
                    <svg
                      width="29"
                      height="28"
                      viewBox="0 0 29 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="8.5"
                        y="5"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="5"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="8.5"
                        y="12"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="12"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="8.5"
                        y="19"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="19"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <div className={styles.imageContainer}>
                <img
                  src={props.element.url}
                  alt=""
                  className={styles.image}
                  contentEditable={false}
                />
              </div>
              {props.children}
            </div>
          );
        case "video":
          return (
            <div className={styles.videoWrapper} {...props.attributes}>
              {!isMobile && (
                <div className={styles.videoDragHandle}>
                  <div
                    className={styles.dragIcon}
                    draggable={true}
                    onDragStart={(e) => {
                      e.stopPropagation();
                      handleElementDragStart(e, props.element);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onDragEnd={(e) => {
                      e.stopPropagation();
                      setIsDragging(false);
                      setDragSourceElement(null);
                      setDraggedElementPath(null);
                    }}
                    title="Перетащите для изменения порядка"
                    style={{ userSelect: "none", cursor: "grab" }}
                  >
                    <svg
                      width="29"
                      height="28"
                      viewBox="0 0 29 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="8.5"
                        y="5"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="5"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="8.5"
                        y="12"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="12"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="8.5"
                        y="19"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                      <rect
                        x="16.5"
                        y="19"
                        width="4"
                        height="4"
                        rx="2"
                        fill="#195EE6"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <div className={styles.videoContainer}>
                <video
                  src={props.element.url}
                  controls
                  className={styles.video}
                  contentEditable={false}
                />
              </div>
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
              title={
                isMobile
                  ? "Нажмите для открытия ссылки"
                  : "Ctrl + Click чтобы открыть ссылку"
              }
              style={{
                color: "#195ee6",
                textDecoration: "underline",
                cursor: isMobile ? "pointer" : "text",
              }}
              onClick={(e) => {
                if (isMobile || e.ctrlKey || e.metaKey) {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(
                    props.element.url,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }
              }}
              onTouchStart={(e) => {
                if (isMobile) {
                  e.preventDefault();
                  window.open(
                    props.element.url,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }
              }}
            >
              {props.children}
            </a>
          );
        default:
          return <p {...props.attributes}>{props.children}</p>;
      }
    },
    [handleElementDragStart, isMobile],
  );

  const renderLeaf = useCallback((props) => {
    let element = props.children;
    if (props.leaf.bold) element = <strong>{element}</strong>;
    if (props.leaf.italic) element = <em>{element}</em>;
    if (props.leaf.underline) element = <u>{element}</u>;
    const finalStyles = {};
    if (props.leaf.color) finalStyles.color = props.leaf.color;
    if (props.leaf.fontSize) finalStyles.fontSize = `${props.leaf.fontSize}px`;
    if (props.leaf.fontFamily) {
      const fontWithFallback = (() => {
        switch (props.leaf.fontFamily) {
          case "Manrope":
            return '"Manrope", "Inter", "Roboto", Arial, sans-serif';
          case "Arial":
          case "Arial, sans-serif":
            return 'Arial, "Helvetica Neue", Helvetica, sans-serif';
          case "Helvetica":
          case "Helvetica, sans-serif":
            return 'Helvetica, "Helvetica Neue", Arial, sans-serif';
          case "Georgia":
          case "Georgia, serif":
            return 'Georgia, "Times New Roman", "Noto Serif", serif';
          case "Times New Roman":
          case "Times New Roman, serif":
            return '"Times New Roman", Georgia, "Noto Serif", serif';
          case "Verdana":
          case "Verdana, sans-serif":
            return "Verdana, Geneva, Tahoma, sans-serif";
          case "Trebuchet MS":
          case "Trebuchet MS, sans-serif":
            return '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", sans-serif';
          case "Courier New":
          case "Courier New, monospace":
            return '"Courier New", "Courier Prime", "IBM Plex Mono", monospace';
          case "Inter":
            return '"Inter", Arial, sans-serif';
          case "Roboto":
            return '"Roboto", Arial, sans-serif';
          case "Open Sans":
            return '"Open Sans", Arial, sans-serif';
          case "Lato":
            return '"Lato", Arial, sans-serif';
          case "Montserrat":
            return '"Montserrat", Arial, sans-serif';
          case "Poppins":
            return '"Poppins", Arial, sans-serif';
          case "Source Sans Pro":
            return '"Source Sans Pro", Arial, sans-serif';
          case "Nunito":
            return '"Nunito", Arial, sans-serif';
          case "Playfair Display":
            return '"Playfair Display", "Noto Serif", serif';
          case "Merriweather":
            return '"Merriweather", "Noto Serif", serif';
          case "Crimson Text":
            return '"Crimson Text", "Noto Serif", serif';
          case "Libre Baskerville":
            return '"Libre Baskerville", "Noto Serif", serif';
          case "Source Serif Pro":
            return '"Source Serif Pro", "Noto Serif", serif';
          case "IBM Plex Sans":
            return '"IBM Plex Sans", Arial, sans-serif';
          case "IBM Plex Serif":
            return '"IBM Plex Serif", "Noto Serif", serif';
          case "Fira Sans":
            return '"Fira Sans", Arial, sans-serif';
          case "Work Sans":
            return '"Work Sans", Arial, sans-serif';
          case "Noto Sans":
            return '"Noto Sans", Arial, sans-serif';
          case "Noto Serif":
            return '"Noto Serif", serif';
          default:
            return props.leaf.fontFamily.includes(" ")
              ? `"${props.leaf.fontFamily}"`
              : props.leaf.fontFamily;
        }
      })();
      finalStyles.fontFamily = fontWithFallback;
      finalStyles._fontWithFallback = fontWithFallback;
    }
    const fontWithFallback = finalStyles._fontWithFallback;
    return (
      <span
        {...props.attributes}
        style={{
          ...finalStyles,
          fontFamily: props.leaf.fontFamily ? fontWithFallback : undefined,
        }}
        ref={(el) => {
          if (el && props.leaf.fontFamily && fontWithFallback) {
            const existingStyles = {
              color: props.leaf.color || el.style.color,
              fontSize: props.leaf.fontSize
                ? `${props.leaf.fontSize}px`
                : el.style.fontSize,
            };
            el.style.setProperty("font-family", fontWithFallback, "important");
            if (existingStyles.color)
              el.style.setProperty("color", existingStyles.color, "important");
            if (existingStyles.fontSize)
              el.style.setProperty(
                "font-size",
                existingStyles.fontSize,
                "important",
              );
            const styleId = `font-override-${Math.random().toString(36).substr(2, 9)}`;
            const style = document.createElement("style");
            style.id = styleId;
            style.textContent = `
              [data-font="${props.leaf.fontFamily}"] {
                font-family: ${fontWithFallback} !important;
              }
            `;
            document.head.appendChild(style);
            let cssText = `font-family: ${fontWithFallback} !important;`;
            if (existingStyles.color)
              cssText += ` color: ${existingStyles.color} !important;`;
            if (existingStyles.fontSize)
              cssText += ` font-size: ${existingStyles.fontSize} !important;`;
            el.style.cssText = cssText;
            el.setAttribute("style", cssText);
            setTimeout(() => window.getComputedStyle(el), 100);
          }
        }}
        data-font={props.leaf.fontFamily || "default"}
      >
        {element}
      </span>
    );
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
            onChange={handleEditorChange}
            onFocus={handleEditorFocus}
            onBlur={handleEditorBlur}
            onClick={handleEditorClick}
            onKeyDown={handleKeyDown}
            onDragOver={isMobile ? undefined : handleEditorDragOver}
            onDrop={isMobile ? undefined : handleEditorDrop}
          />
          {activeLineId === "editor" && (
            <div
              className={styles.editorContentMenu}
              style={{
                position: "absolute",
                top:
                  menuPosition.top !== null
                    ? `${menuPosition.top}px`
                    : undefined,
                left: `${menuPosition.left}px`,
                bottom:
                  menuPosition.bottom !== null
                    ? `${menuPosition.bottom}px`
                    : undefined,
                zIndex: 1000,
              }}
            >
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
