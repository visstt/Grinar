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
  const [dragOverElement, setDragOverElement] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Загружаем Google Fonts
  useEffect(() => {
    const loadGoogleFonts = () => {
      // Проверяем, не загружены ли уже шрифты
      if (document.querySelector('link[href*="fonts.googleapis.com"]')) {
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?" +
        // Основные шрифты из toolbar
        "family=Manrope:wght@400;500;600;700&" +
        "family=Courier+Prime:wght@400;700&" + // Аналог Courier New
        // Дополнительные популярные шрифты
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
        // Дополнительные serif и sans-serif
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

  const insertImage = useCallback((editor, url) => {
    const image = {
      type: "image",
      url,
      children: [{ text: "" }],
    };

    Transforms.insertNodes(editor, image);
  }, []);

  const insertVideo = useCallback((editor, url) => {
    const video = {
      type: "video",
      url,
      children: [{ text: "" }],
    };

    Transforms.insertNodes(editor, video);
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

  const updateMenuPosition = useCallback(() => {
    try {
      const { selection } = editor;
      if (!selection) return;

      // Получаем DOM элемент для текущей позиции курсора
      const domRange = ReactEditor.toDOMRange(editor, selection);
      const rect = domRange.getBoundingClientRect();

      // Получаем позицию относительно редактора
      const editorElement = ReactEditor.toDOMNode(editor, editor);
      const editorRect = editorElement.getBoundingClientRect();

      // Позиционируем меню слева от редактора на уровне курсора
      const top = rect.top - editorRect.top; // На уровне курсора
      const left = -60; // Слева от редактора (отрицательное значение)

      setMenuPosition({ top, left });
    } catch {
      // Если не удается определить позицию, используем позицию по умолчанию
      setMenuPosition({ top: 0, left: -60 });
    }
  }, [editor]);

  const handleEditorChange = useCallback(() => {
    // Показываем тулбар при любом изменении в редакторе
    onShowToolbar && onShowToolbar(true);

    // Также проверяем изменение выделения
    const { selection } = editor;
    if (selection && !Editor.isCollapsed(editor, selection)) {
      onShowToolbar && onShowToolbar(true);
    }

    // Обновляем позицию меню при изменении курсора
    updateMenuPosition();
  }, [onShowToolbar, editor, updateMenuPosition]);

  const handleEditorFocus = useCallback(() => {
    setActiveLineId("editor");
    onShowToolbar && onShowToolbar(true);
    updateMenuPosition();
  }, [onShowToolbar, updateMenuPosition]);

  const handleEditorClick = useCallback(() => {
    // Обновляем позицию меню при клике
    setTimeout(() => {
      updateMenuPosition();
    }, 10); // Небольшая задержка чтобы позиция курсора успела обновиться
  }, [updateMenuPosition]);

  const handleKeyDown = useCallback(
    (e) => {
      // Обновляем позицию меню при навигации с клавиатуры
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
        setTimeout(() => {
          updateMenuPosition();
        }, 10);
      }
    },
    [updateMenuPosition],
  );

  const handleEditorBlur = useCallback((e) => {
    // Проверяем, не кликнули ли на элемент меню
    if (e.relatedTarget && e.relatedTarget.closest('[class*="ContentMenu"]')) {
      return; // Не скрываем меню если кликнули на него
    }
    // Небольшая задержка чтобы не скрывать меню слишком быстро
    setTimeout(() => setActiveLineId(null), 100);
  }, []);

  // Функции для drag & drop изображений
  const handleImageDragStart = useCallback(
    (e, element) => {
      setIsDragging(true);

      try {
        // Находим путь к элементу в редакторе
        const path = ReactEditor.findPath(editor, element);

        // Устанавливаем данные для передачи
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.dropEffect = "move";

        // Используем только стандартные типы данных
        const elementData = JSON.stringify({
          type: element.type,
          url: element.url,
          path: path,
          dragType: "slate-media", // Маркер для идентификации наших данных
        });

        // Используем только text/plain - он всегда работает
        e.dataTransfer.setData("text/plain", elementData);

        // Дополнительно пробуем другие форматы
        e.dataTransfer.setData("application/json", elementData);

        // Создаем пустой div для drag image чтобы не тянулся SVG
        const dragImage = document.createElement("div");
        dragImage.style.opacity = "0";
        dragImage.style.position = "absolute";
        dragImage.style.top = "-1000px";
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);

        // Удаляем элемент после завершения drag
        setTimeout(() => {
          if (document.body.contains(dragImage)) {
            document.body.removeChild(dragImage);
          }
        }, 0);
      } catch {
        setIsDragging(false);
      }
    },
    [editor],
  );

  const handleMediaDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    // Находим ближайший wrapper элемент для подсветки
    const targetWrapper = e.currentTarget;
    setDragOverElement(targetWrapper);
  }, []);

  const handleMediaDragLeave = useCallback((e) => {
    // Убираем подсветку только если покидаем элемент полностью
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverElement(null);
    }
  }, []);

  const handleMediaDrop = useCallback(
    (e, targetElement) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverElement(null);

      try {
        // Получаем данные из text/plain
        let textData = e.dataTransfer.getData("text/plain");

        // Если text/plain пустой, пробуем application/json
        if (!textData) {
          textData = e.dataTransfer.getData("application/json");
        }

        if (!textData) {
          return;
        }

        let parsedData;
        try {
          parsedData = JSON.parse(textData);
        } catch {
          return;
        }

        // Проверяем что это наши данные
        if (!parsedData.dragType || parsedData.dragType !== "slate-media") {
          return;
        }

        if (!parsedData.path) {
          return;
        }

        const sourcePath = parsedData.path;
        const targetPath = ReactEditor.findPath(editor, targetElement);

        // Проверяем валидность путей
        if (!sourcePath || !targetPath) {
          return;
        }

        // Проверяем что целевой элемент допустим для drop
        const allowedDropTargets = [
          "paragraph",
          "image",
          "video",
          "description",
          "title",
          "heading",
        ];
        if (!allowedDropTargets.includes(targetElement.type)) {
          return;
        }

        // Не перемещаем элемент сам на себя или на соседние позиции
        if (JSON.stringify(sourcePath) === JSON.stringify(targetPath)) {
          return;
        }

        // Проверяем что не пытаемся переместить в соседнюю позицию
        const sourceIndex = sourcePath[0];
        const targetIndex = targetPath[0];
        if (Math.abs(sourceIndex - targetIndex) <= 1) {
          return;
        }

        // Получаем элемент для перемещения
        const [sourceNode] = Editor.node(editor, sourcePath);

        // Определяем куда вставлять: до или после целевого элемента
        const insertAtIndex = targetPath[0] + 1; // Всегда вставляем после целевого элемента

        // Проверяем валидность индекса
        if (insertAtIndex < 0 || insertAtIndex > editor.children.length) {
          return;
        }

        // Удаляем исходный элемент
        Transforms.removeNodes(editor, { at: sourcePath });

        // Корректируем индекс вставки если источник был выше цели
        const adjustedInsertIndex =
          sourcePath[0] < insertAtIndex ? insertAtIndex - 1 : insertAtIndex;

        // Вставляем элемент с обработкой ошибок
        try {
          // Используем withoutNormalizing для предотвращения конфликтов
          Editor.withoutNormalizing(editor, () => {
            Transforms.insertNodes(editor, sourceNode, {
              at: [adjustedInsertIndex],
            });
          });
        } catch {
          // Альтернативный метод: вставляем в конец документа
          try {
            Editor.withoutNormalizing(editor, () => {
              Transforms.insertNodes(editor, sourceNode);
            });
          } catch {
            // Возвращаем удаленный элемент обратно
            try {
              Editor.withoutNormalizing(editor, () => {
                Transforms.insertNodes(editor, sourceNode, {
                  at: sourcePath,
                });
              });
            } catch {
              // Если восстановление не удалось, ничего не делаем
            }
          }
        }
      } catch {
        // Обработка ошибок без логирования
      }
    },
    [editor],
  );

  // Функции для drag & drop видео (обновленные)
  const handleVideoDragStart = useCallback(
    (e, element) => {
      setIsDragging(true);

      try {
        // Находим путь к элементу в редакторе
        const path = ReactEditor.findPath(editor, element);

        // Устанавливаем данные для передачи
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.dropEffect = "move";

        // Используем только стандартные типы данных
        const elementData = JSON.stringify({
          type: element.type,
          url: element.url,
          path: path,
          dragType: "slate-media", // Маркер для идентификации наших данных
        });

        // Используем только text/plain - он всегда работает
        e.dataTransfer.setData("text/plain", elementData);

        // Дополнительно пробуем другие форматы
        e.dataTransfer.setData("application/json", elementData);

        // Создаем пустой div для drag image чтобы не тянулся SVG
        const dragImage = document.createElement("div");
        dragImage.style.opacity = "0";
        dragImage.style.position = "absolute";
        dragImage.style.top = "-1000px";
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);

        // Удаляем элемент после завершения drag
        setTimeout(() => {
          if (document.body.contains(dragImage)) {
            document.body.removeChild(dragImage);
          }
        }, 0);
      } catch {
        setIsDragging(false);
      }
    },
    [editor],
  );

  const renderElement = useCallback(
    (props) => {
      switch (props.element.type) {
        case "title":
          return (
            <h1
              className={styles.title}
              {...props.attributes}
              style={{ textAlign: props.element.align || "left" }}
              onDragOver={handleMediaDragOver}
              onDragLeave={handleMediaDragLeave}
              onDrop={(e) => handleMediaDrop(e, props.element)}
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
              onDragOver={handleMediaDragOver}
              onDragLeave={handleMediaDragLeave}
              onDrop={(e) => handleMediaDrop(e, props.element)}
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
              onDragOver={handleMediaDragOver}
              onDragLeave={handleMediaDragLeave}
              onDrop={(e) => handleMediaDrop(e, props.element)}
            >
              {props.children}
            </h2>
          );
        case "paragraph": {
          const isEmpty = props.element.children?.[0]?.text === "";
          const isDropTarget = dragOverElement === props.element;
          return (
            <div
              className={`${styles.paragraphWrapper} ${isDropTarget ? styles.dropTarget : ""}`}
              {...props.attributes}
              onDragOver={handleMediaDragOver}
              onDragLeave={handleMediaDragLeave}
              onDrop={(e) => handleMediaDrop(e, props.element)}
            >
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
            <div
              className={styles.imageWrapper}
              {...props.attributes}
              onDragOver={handleMediaDragOver}
              onDrop={(e) => handleMediaDrop(e, props.element)}
            >
              <div className={styles.imageDragHandle}>
                <div
                  className={styles.dragIcon}
                  draggable={true}
                  onDragStart={(e) => {
                    e.stopPropagation();
                    handleImageDragStart(e, props.element);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onDragEnd={(e) => {
                    e.stopPropagation();
                    setIsDragging(false);
                  }}
                  title="Перетащите для изменения порядка"
                  style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    cursor: "grab",
                  }}
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
            <div
              className={styles.videoWrapper}
              {...props.attributes}
              onDragOver={handleMediaDragOver}
              onDrop={(e) => handleMediaDrop(e, props.element)}
            >
              <div className={styles.videoDragHandle}>
                <div
                  className={styles.dragIcon}
                  draggable={true}
                  onDragStart={(e) => {
                    e.stopPropagation();
                    handleVideoDragStart(e, props.element);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onDragEnd={(e) => {
                    e.stopPropagation();
                    setIsDragging(false);
                  }}
                  title="Перетащите для изменения порядка"
                  style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    cursor: "grab",
                  }}
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
                  window.open(
                    props.element.url,
                    "_blank",
                    "noopener,noreferrer",
                  );
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
    },
    [
      handleMediaDragOver,
      handleImageDragStart,
      handleVideoDragStart,
      handleMediaDrop,
      handleMediaDragLeave,
      dragOverElement,
    ],
  );

  const renderLeaf = useCallback((props) => {
    let element = props.children;

    // Применяем форматирование
    if (props.leaf.bold) {
      element = <strong>{element}</strong>;
    }

    if (props.leaf.italic) {
      element = <em>{element}</em>;
    }

    if (props.leaf.underline) {
      element = <u>{element}</u>;
    }

    // Создаем финальный span с принудительными стилями
    const finalStyles = {};

    if (props.leaf.color) {
      finalStyles.color = props.leaf.color;
    }

    if (props.leaf.fontSize) {
      finalStyles.fontSize = `${props.leaf.fontSize}px`;
    }

    if (props.leaf.fontFamily) {
      // Создаем правильный font-family с fallback
      let fontFamily = props.leaf.fontFamily;

      // Добавляем fallback шрифты для лучшей совместимости
      const fontWithFallback = (() => {
        switch (fontFamily) {
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
            return fontFamily.includes(" ") ? `"${fontFamily}"` : fontFamily;
        }
      })();

      finalStyles.fontFamily = fontWithFallback;

      // Сохраняем fontWithFallback для использования в JSX
      finalStyles._fontWithFallback = fontWithFallback;
    }

    const fontWithFallback = finalStyles._fontWithFallback;

    return (
      <span
        {...props.attributes}
        style={{
          ...finalStyles,
          // Принудительно переопределяем все возможные CSS свойства
          fontFamily: props.leaf.fontFamily ? fontWithFallback : undefined,
          WebkitFontFamily: props.leaf.fontFamily
            ? fontWithFallback
            : undefined,
          MozFontFamily: props.leaf.fontFamily ? fontWithFallback : undefined,
        }}
        ref={(el) => {
          if (el && props.leaf.fontFamily && fontWithFallback) {
            // Сохраняем существующие стили
            const existingStyles = {
              color: props.leaf.color || el.style.color,
              fontSize: props.leaf.fontSize
                ? `${props.leaf.fontSize}px`
                : el.style.fontSize,
            };

            // Принудительно устанавливаем через DOM API с максимальным приоритетом
            el.style.setProperty("font-family", fontWithFallback, "important");

            // Восстанавливаем другие стили
            if (existingStyles.color) {
              el.style.setProperty("color", existingStyles.color, "important");
            }
            if (existingStyles.fontSize) {
              el.style.setProperty(
                "font-size",
                existingStyles.fontSize,
                "important",
              );
            }

            el.style.setProperty(
              "-webkit-font-family",
              fontWithFallback,
              "important",
            );
            el.style.setProperty(
              "-moz-font-family",
              fontWithFallback,
              "important",
            );

            // Добавляем CSS правило прямо в head для максимального приоритета
            const styleId = `font-override-${Math.random().toString(36).substr(2, 9)}`;
            const style = document.createElement("style");
            style.id = styleId;
            style.textContent = `
              [data-font="${props.leaf.fontFamily}"] {
                font-family: ${fontWithFallback} !important;
              }
            `;
            document.head.appendChild(style);

            // Формируем cssText с сохранением всех стилей
            let cssText = `font-family: ${fontWithFallback} !important;`;
            if (existingStyles.color) {
              cssText += ` color: ${existingStyles.color} !important;`;
            }
            if (existingStyles.fontSize) {
              cssText += ` font-size: ${existingStyles.fontSize} !important;`;
            }

            // Полностью перезаписываем cssText с сохранением стилей
            el.style.cssText = cssText;

            // Дополнительно через setAttribute
            el.setAttribute("style", cssText);

            // Проверяем результат
            setTimeout(() => {
              window.getComputedStyle(el);
            }, 100);
          }
        }}
        data-font={props.leaf.fontFamily || "default"}
        // Дополнительные атрибуты для принудительного стиля
        data-style={
          props.leaf.fontFamily ? `font-family: ${fontWithFallback}` : undefined
        }
      >
        {element}
      </span>
    );
  }, []);

  return (
    <div className="containerXS">
      <div className={styles.editorContainer}>
        <div className={styles.editorWrapper} style={{ position: "relative" }}>
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
          />

          {activeLineId === "editor" && (
            <div
              className={styles.editorContentMenu}
              style={{
                position: "absolute",
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
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
