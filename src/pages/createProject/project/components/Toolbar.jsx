import React, { useEffect, useRef, useState } from "react";

// eslint-disable-next-line
import { motion } from "framer-motion";
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
    const { selection } = editor;
    if (selection) {
      Editor.addMark(editor, "fontSize", size);
    }
    setSizeDropdownOpen(false);
  };

  const setFontFamily = (font) => {
    const { selection } = editor;

    if (selection) {
      Editor.addMark(editor, "fontFamily", font);
    }
    setFontDropdownOpen(false);
  };

  const setTextColor = (color) => {
    const { selection } = editor;
    if (selection) {
      Editor.addMark(editor, "color", color);
    }
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
    <motion.div
      className={styles.toolbar}
      ref={toolbarRef}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    >
      {/* Группа: Начертание и размер шрифта */}
      <div className={styles.toolbarGroup}>
        {/* Font Family Dropdown */}
        <div className={styles.dropdown}>
          <motion.button
            className={styles.dropdownButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFontDropdownOpen(!fontDropdownOpen);
              setSizeDropdownOpen(false);
              setColorDropdownOpen(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getCurrentFontFamily()}
            <ChevronDown size={16} />
          </motion.button>
          {fontDropdownOpen && (
            <motion.div
              className={styles.dropdownMenu}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
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
            </motion.div>
          )}
        </div>

        {/* Font Size Dropdown */}
        <div className={styles.dropdown}>
          <motion.button
            className={styles.dropdownButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSizeDropdownOpen(!sizeDropdownOpen);
              setFontDropdownOpen(false);
              setColorDropdownOpen(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getCurrentFontSize()}
            <ChevronDown size={16} />
          </motion.button>
          {sizeDropdownOpen && (
            <motion.div
              className={styles.dropdownMenu}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
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
            </motion.div>
          )}
        </div>
      </div>

      {/* Группа: Выбор цвета */}
      <div className={styles.toolbarGroup}>
        {/* Color Picker */}
        <div className={styles.dropdown}>
          <motion.button
            className={styles.toolbarButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setColorDropdownOpen(!colorDropdownOpen);
              setFontDropdownOpen(false);
              setSizeDropdownOpen(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <DrawIcon size={16} />
          </motion.button>
          {colorDropdownOpen && (
            <motion.div
              className={styles.colorPicker}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
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
            </motion.div>
          )}
        </div>
      </div>

      {/* Группа: Жирный, курсив и подчеркивание */}
      <div className={styles.toolbarGroup}>
        {/* Bold (Ж) */}
        <motion.button
          className={`${styles.toolbarButton} ${isMarkActive("bold") ? styles.active : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark("bold");
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <strong>Ж</strong>
        </motion.button>

        {/* Italic (К) */}
        <motion.button
          className={`${styles.toolbarButton} ${isMarkActive("italic") ? styles.active : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark("italic");
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <em>К</em>
        </motion.button>

        {/* Underline (Ж с подчеркиванием) */}
        <motion.button
          className={`${styles.toolbarButton} ${isMarkActive("underline") ? styles.active : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark("underline");
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <u>Ж</u>
        </motion.button>
      </div>

      {/* Группа: Добавить/удалить ссылку */}
      <div className={styles.toolbarGroup}>
        {/* Link */}
        <motion.button
          className={styles.toolbarButton}
          onMouseDown={(e) => {
            e.preventDefault();
            insertLink();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link size={16} />
        </motion.button>

        {/* Unlink */}
        <motion.button
          className={styles.toolbarButton}
          onMouseDown={(e) => {
            e.preventDefault();
            removeLink();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Unlink size={16} />
        </motion.button>
      </div>

      {/* Группа: Выравнивание текста */}
      <div className={styles.toolbarGroup}>
        <motion.button
          className={styles.toolbarButton}
          onMouseDown={(e) => {
            e.preventDefault();
            setTextAlignment("left");
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AlignLeft size={16} />
        </motion.button>

        <motion.button
          className={styles.toolbarButton}
          onMouseDown={(e) => {
            e.preventDefault();
            setTextAlignment("center");
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AlignCenter size={16} />
        </motion.button>

        <motion.button
          className={styles.toolbarButton}
          onMouseDown={(e) => {
            e.preventDefault();
            setTextAlignment("right");
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AlignRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Toolbar;
