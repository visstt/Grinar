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

  const handleEditorChange = useCallback(() => {
    // Показываем тулбар при любом изменении в редакторе
    onShowToolbar && onShowToolbar(true);

    // Также проверяем изменение выделения
    const { selection } = editor;
    if (selection && !Editor.isCollapsed(editor, selection)) {
      onShowToolbar && onShowToolbar(true);
    }
  }, [onShowToolbar, editor]);

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

  // Функции для drag & drop видео
  const handleVideoDragStart = useCallback(
    (e, element) => {
      console.log("🎬 Video drag start:", element);
      e.stopPropagation();
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";

      try {
        // Находим путь к элементу в редакторе
        const path = ReactEditor.findPath(editor, element);
        console.log("📍 Source path:", path);
        e.dataTransfer.setData("application/slate-path", JSON.stringify(path));

        // Также сохраняем данные элемента как fallback
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            type: element.type,
            url: element.url,
          }),
        );

        // Добавляем визуальную обратную связь
        const videoWrapper = e.target.closest('[class*="videoWrapper"]');
        if (videoWrapper) {
          videoWrapper.style.opacity = "0.7";
          videoWrapper.style.transform = "scale(0.98)";

          // Убираем эффект через небольшое время
          const resetStyles = () => {
            if (videoWrapper) {
              videoWrapper.style.opacity = "1";
              videoWrapper.style.transform = "scale(1)";
            }
          };

          // Сбрасываем стили через 3 секунды или при завершении drag
          setTimeout(resetStyles, 3000);

          // Также слушаем события завершения drag
          const handleDragEnd = () => {
            resetStyles();
            document.removeEventListener("dragend", handleDragEnd);
            document.removeEventListener("drop", handleDragEnd);
          };

          document.addEventListener("dragend", handleDragEnd);
          document.addEventListener("drop", handleDragEnd);
        }
      } catch (error) {
        console.error("❌ Error in handleVideoDragStart:", error);
      }
    },
    [editor],
  );

  const handleVideoDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    console.log("🎯 Video drag over");
  }, []);

  const handleVideoDrop = useCallback(
    (e, targetElement) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("🎯 Video drop on:", targetElement);

      try {
        const pathData = e.dataTransfer.getData("application/slate-path");
        if (!pathData) {
          console.log("❌ No path data");
          return;
        }

        const sourcePath = JSON.parse(pathData);
        const targetPath = ReactEditor.findPath(editor, targetElement);

        console.log("📍 Source path:", sourcePath);
        console.log("🎯 Target path:", targetPath);

        // Не перемещаем элемент сам на себя
        if (JSON.stringify(sourcePath) === JSON.stringify(targetPath)) {
          console.log("⚠️ Same element, skipping");
          return;
        }

        // Получаем элемент для перемещения
        const [sourceNode] = Editor.node(editor, sourcePath);
        console.log("📦 Source node:", sourceNode);

        // Удаляем исходный элемент
        Transforms.removeNodes(editor, { at: sourcePath });
        console.log("🗑️ Removed source node");

        // Корректируем путь если нужно
        const adjustedTargetPath =
          sourcePath[0] < targetPath[0] ? [targetPath[0] - 1] : targetPath;

        console.log("📍 Adjusted target path:", adjustedTargetPath);

        // Вставляем элемент после целевого элемента
        Transforms.insertNodes(editor, sourceNode, {
          at: [adjustedTargetPath[0] + 1],
        });

        console.log("✅ Video moved successfully");
      } catch (error) {
        console.error("❌ Video drag & drop error:", error);

        // Fallback: попробуем еще раз с простой логикой
        try {
          const pathData = e.dataTransfer.getData("application/slate-path");
          const sourcePath = JSON.parse(pathData);
          const targetPath = ReactEditor.findPath(editor, targetElement);

          if (sourcePath[0] !== targetPath[0]) {
            const [sourceNode] = Editor.node(editor, sourcePath);

            Transforms.removeNodes(editor, { at: sourcePath });

            const newTargetIndex =
              sourcePath[0] < targetPath[0] ? targetPath[0] : targetPath[0] + 1;

            Transforms.insertNodes(editor, sourceNode, {
              at: [newTargetIndex],
            });
            console.log("✅ Video moved via fallback");
          }
        } catch (fallbackError) {
          console.error("❌ Video drag & drop fallback error:", fallbackError);
        }
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
            <div
              className={styles.paragraphWrapper}
              {...props.attributes}
              onDragOver={handleVideoDragOver}
              onDrop={(e) => handleVideoDrop(e, props.element)}
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
              onDragOver={handleVideoDragOver}
              onDrop={(e) => handleVideoDrop(e, props.element)}
            >
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
              onDragOver={handleVideoDragOver}
              onDrop={(e) => handleVideoDrop(e, props.element)}
            >
              <div className={styles.videoDragHandle}>
                <div
                  className={styles.dragIcon}
                  draggable
                  onDragStart={(e) => handleVideoDragStart(e, props.element)}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onSelectStart={(e) => e.preventDefault()}
                  title="Перетащите для изменения порядка"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="3" cy="3" r="1.5" fill="#6B7280" />
                    <circle cx="8" cy="3" r="1.5" fill="#6B7280" />
                    <circle cx="13" cy="3" r="1.5" fill="#6B7280" />
                    <circle cx="3" cy="8" r="1.5" fill="#6B7280" />
                    <circle cx="8" cy="8" r="1.5" fill="#6B7280" />
                    <circle cx="13" cy="8" r="1.5" fill="#6B7280" />
                    <circle cx="3" cy="13" r="1.5" fill="#6B7280" />
                    <circle cx="8" cy="13" r="1.5" fill="#6B7280" />
                    <circle cx="13" cy="13" r="1.5" fill="#6B7280" />
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
    [handleVideoDragOver, handleVideoDragStart, handleVideoDrop],
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
        <div className={styles.editorWrapper}>
          <Editable
            className={styles.editor}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder=""
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
