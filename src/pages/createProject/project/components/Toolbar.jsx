import React, { useEffect, useRef, useState } from "react";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Italic,
  Link,
  Underline,
  Unlink,
  X,
} from "lucide-react";
import { Editor, Element as SlateElement, Transforms } from "slate";
import { useSlate } from "slate-react";

import DrawIcon from "./DrawIcon";
import styles from "./Toolbar.module.css";

const Toolbar = () => {
  const editor = useSlate();
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);

  const toolbarRef = useRef(null);

  // Закрытие выпадающих меню при клике вне их
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setFontDropdownOpen(false);
        setSizeDropdownOpen(false);
        setColorDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isMarkActive = (format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const getCurrentFontSize = () => {
    const marks = Editor.marks(editor);
    const fontSize = marks?.fontSize;
    return fontSize || 16;
  };

  const getCurrentFontFamily = () => {
    const marks = Editor.marks(editor);
    const fontFamily = marks?.fontFamily || "Manrope";
    return getFontDisplayName(fontFamily);
  };

  const toggleMark = (format) => {
    const isActive = isMarkActive(format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const setTextAlignment = (alignment) => {
    const newProperties = { align: alignment };
    Transforms.setNodes(editor, newProperties, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n),
    });
  };

  const setFontSize = (size) => {
    Editor.addMark(editor, "fontSize", size);
    setSizeDropdownOpen(false);
  };

  const setFontFamily = (font) => {
    Editor.addMark(editor, "fontFamily", font);
    setFontDropdownOpen(false);
  };

  const setTextColor = (color) => {
    Editor.addMark(editor, "color", color);
    setColorDropdownOpen(false);
  };

  const insertLink = () => {
    const url = window.prompt("Введите URL:");
    if (!url) return;

    const { selection } = editor;
    const isCollapsed =
      selection && selection.anchor.offset === selection.focus.offset;

    if (isCollapsed) {
      Transforms.insertNodes(editor, {
        type: "link",
        url,
        children: [{ text: url }],
      });
    } else {
      Transforms.wrapNodes(
        editor,
        { type: "link", url, children: [] },
        { split: true },
      );
    }
  };

  const removeLink = () => {
    // Простое удаление всех ссылок в текущем выделении или позиции курсора
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
    });
  };

  const getFontDisplayName = (fontFamily) => {
    return fontFamily.split(",")[0].trim().replace(/"/g, "");
  };

  const fonts = [
    "Manrope",
    "Arial, sans-serif",
    "Helvetica, sans-serif",
    "Georgia, serif",
    "Times New Roman, serif",
    "Verdana, sans-serif",
    "Trebuchet MS, sans-serif",
    "Courier New, monospace",
  ];

  const sizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

  const colors = [
    "#ffffff",
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ffa500",
    "#800080",
    "#ffc0cb",
    "#a52a2a",
    "#808080",
    "#008000",
    "#000080",
  ];

  return (
    <div className={styles.toolbar} ref={toolbarRef}>
      {/* Font Family Dropdown */}
      <div className={styles.dropdown}>
        <button
          className={styles.dropdownButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFontDropdownOpen(!fontDropdownOpen);
            setSizeDropdownOpen(false);
            setColorDropdownOpen(false);
          }}
        >
          {getCurrentFontFamily()}
          <ChevronDown size={16} />
        </button>
        {fontDropdownOpen && (
          <div className={styles.dropdownMenu}>
            {fonts.map((font) => (
              <button
                key={font}
                className={styles.dropdownItem}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFontFamily(font);
                }}
                style={{ fontFamily: font }}
              >
                {getFontDisplayName(font)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Font Size Dropdown */}
      <div className={styles.dropdown}>
        <button
          className={styles.dropdownButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSizeDropdownOpen(!sizeDropdownOpen);
            setFontDropdownOpen(false);
            setColorDropdownOpen(false);
          }}
        >
          {getCurrentFontSize()}
          <ChevronDown size={16} />
        </button>
        {sizeDropdownOpen && (
          <div className={styles.dropdownMenu}>
            {sizes.map((size) => (
              <button
                key={size}
                className={styles.dropdownItem}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFontSize(size);
                }}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color Picker */}
      <div className={styles.dropdown}>
        <button
          className={styles.toolbarButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setColorDropdownOpen(!colorDropdownOpen);
            setFontDropdownOpen(false);
            setSizeDropdownOpen(false);
          }}
        >
          <DrawIcon size={16} />
        </button>
        {colorDropdownOpen && (
          <div className={styles.colorPicker}>
            {colors.map((color) => (
              <button
                key={color}
                className={styles.colorItem}
                style={{ backgroundColor: color }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTextColor(color);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bold (Ж) */}
      <button
        className={`${styles.toolbarButton} ${isMarkActive("bold") ? styles.active : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark("bold");
        }}
      >
        <strong>Ж</strong>
      </button>

      {/* Italic (К) */}
      <button
        className={`${styles.toolbarButton} ${isMarkActive("italic") ? styles.active : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark("italic");
        }}
      >
        <em>К</em>
      </button>

      {/* Underline (Ж с подчеркиванием) */}
      <button
        className={`${styles.toolbarButton} ${isMarkActive("underline") ? styles.active : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark("underline");
        }}
      >
        <u>
          <strong>Ж</strong>
        </u>
      </button>

      {/* Link */}
      <button
        className={styles.toolbarButton}
        onMouseDown={(e) => {
          e.preventDefault();
          insertLink();
        }}
      >
        <Link size={16} />
      </button>

      {/* Unlink */}
      <button
        className={styles.toolbarButton}
        onMouseDown={(e) => {
          e.preventDefault();
          removeLink();
        }}
      >
        <Unlink size={16} />
      </button>

      {/* Alignment Buttons */}
      <button
        className={styles.toolbarButton}
        onMouseDown={(e) => {
          e.preventDefault();
          setTextAlignment("left");
        }}
      >
        <AlignLeft size={16} />
      </button>

      <button
        className={styles.toolbarButton}
        onMouseDown={(e) => {
          e.preventDefault();
          setTextAlignment("center");
        }}
      >
        <AlignCenter size={16} />
      </button>

      <button
        className={styles.toolbarButton}
        onMouseDown={(e) => {
          e.preventDefault();
          setTextAlignment("right");
        }}
      >
        <AlignRight size={16} />
      </button>
    </div>
  );
};

export default Toolbar;
