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
    left: window.innerWidth <= 480 ? -10 : window.innerWidth <= 768 ? -15 : -60,
    bottom: null,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Новые состояния для модального окна управления элементами
  const [elementModalOpen, setElementModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);

      if (newIsMobile !== isMobile) {
        if (window.innerWidth <= 480) {
          setMenuPosition({ top: null, left: -10, bottom: null });
        } else if (window.innerWidth <= 768) {
          setMenuPosition({ top: null, left: -15, bottom: null });
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

  // Функции для управления элементами
  const moveElementUp = useCallback(
    (element) => {
      try {
        const path = ReactEditor.findPath(editor, element);
        const elementIndex = path[0];

        if (elementIndex > 0) {
          const [node] = Editor.node(editor, path);
          Editor.withoutNormalizing(editor, () => {
            Transforms.removeNodes(editor, { at: path });
            Transforms.insertNodes(editor, node, { at: [elementIndex - 1] });
          });
        }
      } catch (error) {
        console.error("Ошибка при перемещении элемента вверх:", error);
      }
      setElementModalOpen(false);
    },
    [editor],
  );

  const moveElementDown = useCallback(
    (element) => {
      try {
        const path = ReactEditor.findPath(editor, element);
        const elementIndex = path[0];
        const totalElements = editor.children.length;

        if (elementIndex < totalElements - 1) {
          const [node] = Editor.node(editor, path);
          Editor.withoutNormalizing(editor, () => {
            Transforms.removeNodes(editor, { at: path });
            Transforms.insertNodes(editor, node, { at: [elementIndex + 1] });
          });
        }
      } catch (error) {
        console.error("Ошибка при перемещении элемента вниз:", error);
      }
      setElementModalOpen(false);
    },
    [editor],
  );

  const removeElement = useCallback(
    (element) => {
      try {
        const path = ReactEditor.findPath(editor, element);
        Transforms.removeNodes(editor, { at: path });
      } catch (error) {
        console.error("Ошибка при удалении элемента:", error);
      }
      setElementModalOpen(false);
    },
    [editor],
  );

  const handleDragHandleClick = useCallback((e, element) => {
    console.log("handleDragHandleClick вызван", element); // отладка
    e.preventDefault();
    e.stopPropagation();

    // Находим элемент drag-handle или используем сам target как fallback
    const dragHandle = e.target.closest(".drag-handle") || e.currentTarget;
    const rect = dragHandle.getBoundingClientRect();

    console.log("Позиция модального окна:", {
      top: rect.top + rect.height + 5,
      left: rect.left,
    }); // отладка

    setModalPosition({
      top: rect.top + rect.height + 5, // добавляем небольшой отступ
      left: rect.left,
    });
    setSelectedElement(element);
    setElementModalOpen(true);
  }, []);

  const updateMenuPosition = useCallback(() => {
    if (isMobile) {
      const leftOffset = window.innerWidth <= 480 ? -10 : -15;
      try {
        const { selection } = editor;
        if (!selection) {
          setMenuPosition({ top: 5, left: leftOffset, bottom: null }); // Опускаем на 5px
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
              const top = nodeRect.top - editorRect.top + 5; // Опускаем на 5px
              setMenuPosition({
                top: Math.max(5, top), // Минимум 5px сверху
                left: leftOffset,
                bottom: null,
              });
              return;
            }
          } catch {
            // Fallback если не удается получить элемент
          }
        }

        const top = rect.top - editorRect.top + 5; // Опускаем на 5px
        setMenuPosition({
          top: Math.max(5, top), // Минимум 5px сверху
          left: leftOffset,
          bottom: null,
        });
      } catch {
        setMenuPosition({ top: 5, left: leftOffset, bottom: null }); // Опускаем на 5px
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
                <div className={`${styles.textDragHandle} drag-handle`}>
                  <div
                    className={styles.dragIcon}
                    onClick={(e) => handleDragHandleClick(e, props.element)}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Управление элементом"
                    style={{ userSelect: "none", cursor: "pointer" }}
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
                <div className={`${styles.textDragHandle} drag-handle`}>
                  <div
                    className={styles.dragIcon}
                    onClick={(e) => handleDragHandleClick(e, props.element)}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Управление элементом"
                    style={{ userSelect: "none", cursor: "pointer" }}
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
                <div className={`${styles.textDragHandle} drag-handle`}>
                  <div
                    className={styles.dragIcon}
                    onClick={(e) => handleDragHandleClick(e, props.element)}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Управление элементом"
                    style={{ userSelect: "none", cursor: "pointer" }}
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
                <div className={`${styles.textDragHandle} drag-handle`}>
                  <div
                    className={styles.dragIcon}
                    onClick={(e) => handleDragHandleClick(e, props.element)}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Управление элементом"
                    style={{ userSelect: "none", cursor: "pointer" }}
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
                <div className={`${styles.imageDragHandle} drag-handle`}>
                  <div
                    className={styles.dragIcon}
                    onClick={(e) => handleDragHandleClick(e, props.element)}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Управление элементом"
                    style={{ userSelect: "none", cursor: "pointer" }}
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
                <div className={`${styles.videoDragHandle} drag-handle`}>
                  <div
                    className={styles.dragIcon}
                    onClick={(e) => handleDragHandleClick(e, props.element)}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Управление элементом"
                    style={{ userSelect: "none", cursor: "pointer" }}
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
    [handleDragHandleClick, isMobile],
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
    <div className="container-xs">
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

        {/* Модальное окно управления элементами */}
        {elementModalOpen && (
          <div
            style={{
              position: "fixed",
              top: modalPosition.top,
              left: modalPosition.left,
              width: "200px",
              height: "100px",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 2000,
              display: "flex",
              flexDirection: "column",
              padding: "8px",
            }}
          >
            <button
              onClick={() => moveElementUp(selectedElement)}
              style={{
                padding: "8px 12px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.0691 10.3199C17.8791 10.3199 17.6891 10.2499 17.5391 10.0999L11.9991 4.55994L6.45914 10.0999C6.16914 10.3899 5.68914 10.3899 5.39914 10.0999C5.10914 9.80994 5.10914 9.32994 5.39914 9.03994L11.4691 2.96994C11.7591 2.67994 12.2391 2.67994 12.5291 2.96994L18.5991 9.03994C18.8891 9.32994 18.8891 9.80994 18.5991 10.0999C18.4591 10.2499 18.2591 10.3199 18.0691 10.3199Z"
                  fill="#2C2C2C"
                />
                <path
                  d="M12 21.25C11.59 21.25 11.25 20.91 11.25 20.5V3.67004C11.25 3.26004 11.59 2.92004 12 2.92004C12.41 2.92004 12.75 3.26004 12.75 3.67004V20.5C12.75 20.91 12.41 21.25 12 21.25Z"
                  fill="#2C2C2C"
                />
              </svg>
              Переместить выше
            </button>
            <button
              onClick={() => moveElementDown(selectedElement)}
              style={{
                padding: "8px 12px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.9991 21.25C11.8091 21.25 11.6191 21.18 11.4691 21.03L5.39914 14.96C5.10914 14.67 5.10914 14.19 5.39914 13.9C5.68914 13.61 6.16914 13.61 6.45914 13.9L11.9991 19.44L17.5391 13.9C17.8291 13.61 18.3091 13.61 18.5991 13.9C18.8891 14.19 18.8891 14.67 18.5991 14.96L12.5291 21.03C12.3791 21.18 12.1891 21.25 11.9991 21.25Z"
                  fill="#2C2C2C"
                />
                <path
                  d="M12 21.08C11.59 21.08 11.25 20.74 11.25 20.33V3.5C11.25 3.09 11.59 2.75 12 2.75C12.41 2.75 12.75 3.09 12.75 3.5V20.33C12.75 20.74 12.41 21.08 12 21.08Z"
                  fill="#2C2C2C"
                />
              </svg>
              Переместить ниже
            </button>
            <button
              onClick={() => removeElement(selectedElement)}
              style={{
                padding: "8px 12px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                color: "#E21824",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.9997 6.72998C20.9797 6.72998 20.9497 6.72998 20.9197 6.72998C15.6297 6.19998 10.3497 5.99998 5.11967 6.52998L3.07967 6.72998C2.65967 6.76998 2.28967 6.46998 2.24967 6.04998C2.20967 5.62998 2.50967 5.26998 2.91967 5.22998L4.95967 5.02998C10.2797 4.48998 15.6697 4.69998 21.0697 5.22998C21.4797 5.26998 21.7797 5.63998 21.7397 6.04998C21.7097 6.43998 21.3797 6.72998 20.9997 6.72998Z"
                  fill="#E21824"
                />
                <path
                  d="M8.50074 5.72C8.46074 5.72 8.42074 5.72 8.37074 5.71C7.97074 5.64 7.69074 5.25 7.76074 4.85L7.98074 3.54C8.14074 2.58 8.36074 1.25 10.6907 1.25H13.3107C15.6507 1.25 15.8707 2.63 16.0207 3.55L16.2407 4.85C16.3107 5.26 16.0307 5.65 15.6307 5.71C15.2207 5.78 14.8307 5.5 14.7707 5.1L14.5507 3.8C14.4107 2.93 14.3807 2.76 13.3207 2.76H10.7007C9.64074 2.76 9.62074 2.9 9.47074 3.79L9.24074 5.09C9.18074 5.46 8.86074 5.72 8.50074 5.72Z"
                  fill="#E21824"
                />
                <path
                  d="M15.2104 22.75H8.79039C5.30039 22.75 5.16039 20.82 5.05039 19.26L4.40039 9.18995C4.37039 8.77995 4.69039 8.41995 5.10039 8.38995C5.52039 8.36995 5.87039 8.67995 5.90039 9.08995L6.55039 19.16C6.66039 20.68 6.70039 21.25 8.79039 21.25H15.2104C17.3104 21.25 17.3504 20.68 17.4504 19.16L18.1004 9.08995C18.1304 8.67995 18.4904 8.36995 18.9004 8.38995C19.3104 8.41995 19.6304 8.76995 19.6004 9.18995L18.9504 19.26C18.8404 20.82 18.7004 22.75 15.2104 22.75Z"
                  fill="#E21824"
                />
                <path
                  d="M13.6601 17.25H10.3301C9.92008 17.25 9.58008 16.91 9.58008 16.5C9.58008 16.09 9.92008 15.75 10.3301 15.75H13.6601C14.0701 15.75 14.4101 16.09 14.4101 16.5C14.4101 16.91 14.0701 17.25 13.6601 17.25Z"
                  fill="#E21824"
                />
                <path
                  d="M14.5 13.25H9.5C9.09 13.25 8.75 12.91 8.75 12.5C8.75 12.09 9.09 11.75 9.5 11.75H14.5C14.91 11.75 15.25 12.09 15.25 12.5C15.25 12.91 14.91 13.25 14.5 13.25Z"
                  fill="#E21824"
                />
              </svg>
              Удалить
            </button>
          </div>
        )}

        {/* Overlay для закрытия модального окна при клике вне его */}
        {elementModalOpen && (
          <div
            onClick={() => setElementModalOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1999,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ArticleEditor;
