import React, { useEffect, useRef, useState } from "react";

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
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Editor, Element as SlateElement, Transforms } from "slate";
import { useSlate } from "slate-react";

import DrawIcon from "./DrawIcon";
import styles from "./Toolbar.module.css";

const Toolbar = () => {
  const editor = useSlate();
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [customColorValue, setCustomColorValue] = useState("#000000");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480);

  const toolbarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallMobile(window.innerWidth <= 480);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setFontDropdownOpen(false);
        setSizeDropdownOpen(false);
        setColorDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const isMarkActive = (format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const getCurrentFontSize = () => {
    const marks = Editor.marks(editor);
    return marks?.fontSize || 16;
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

  const handleCustomColorChange = (color) => {
    setCustomColorValue(color);
    if (editor.selection) {
      Editor.addMark(editor, "color", color);
    }
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
    // Основные цвета
    "#000000",
    "#1a1a1a",
    "#333333",
    "#4d4d4d",
    "#666666",
    "#808080",
    "#999999",
    "#cccccc",
    "#ffffff",
    "#f5f5f5",
    "#e6e6e6",
    "#d9d9d9",
    "#cccccc",
    "#bfbfbf",
    "#b3b3b3",
    "#a6a6a6",

    // Красные оттенки
    "#ff0000",
    "#ff3333",
    "#ff6666",
    "#ff9999",
    "#ffcccc",
    "#cc0000",
    "#990000",
    "#660000",

    // Синие оттенки
    "#0000ff",
    "#3333ff",
    "#6666ff",
    "#9999ff",
    "#ccccff",
    "#0000cc",
    "#000099",
    "#000066",

    // Зеленые оттенки
    "#00ff00",
    "#33ff33",
    "#66ff66",
    "#99ff99",
    "#ccffcc",
    "#00cc00",
    "#009900",
    "#006600",

    // Желтые оттенки
    "#ffff00",
    "#ffff33",
    "#ffff66",
    "#ffff99",
    "#ffffcc",
    "#cccc00",
    "#999900",
    "#666600",

    // Фиолетовые оттенки
    "#ff00ff",
    "#ff33ff",
    "#ff66ff",
    "#ff99ff",
    "#ffccff",
    "#cc00cc",
    "#990099",
    "#660066",

    // Циановые оттенки
    "#00ffff",
    "#33ffff",
    "#66ffff",
    "#99ffff",
    "#ccffff",
    "#00cccc",
    "#009999",
    "#006666",

    // Оранжевые оттенки
    "#ffa500",
    "#ffb833",
    "#ffcc66",
    "#ffdd99",
    "#ffeecc",
    "#cc8400",
    "#996300",
    "#664200",
  ];

  return (
    <motion.div
      className={styles.toolbar}
      ref={toolbarRef}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className={styles.toolbarGroup}>
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
            whileHover={{ scale: isMobile ? 1 : 1.05 }}
            whileTap={{ scale: isMobile ? 1 : 0.95 }}
          >
            {getCurrentFontFamily()}
            <ChevronDown size={isSmallMobile ? 12 : isMobile ? 14 : 16} />
          </motion.button>
          {fontDropdownOpen && (
            <motion.div
              className={styles.dropdownMenu}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
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
                  style={{
                    fontFamily: font,
                    fontSize: isSmallMobile ? 12 : isMobile ? 13 : 14,
                  }}
                >
                  {getFontDisplayName(font)}
                </button>
              ))}
            </motion.div>
          )}
        </div>
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
            whileHover={{ scale: isMobile ? 1 : 1.05 }}
            whileTap={{ scale: isMobile ? 1 : 0.95 }}
          >
            {getCurrentFontSize()}
            <ChevronDown size={isSmallMobile ? 12 : isMobile ? 14 : 16} />
          </motion.button>
          {sizeDropdownOpen && (
            <motion.div
              className={styles.dropdownMenu}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
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
                  style={{ fontSize: isSmallMobile ? 12 : isMobile ? 13 : 14 }}
                >
                  {size}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <div className={styles.toolbarGroup}>
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
            whileHover={{ scale: isMobile ? 1 : 1.05 }}
            whileTap={{ scale: isMobile ? 1 : 0.95 }}
          >
            <DrawIcon size={isSmallMobile ? 12 : isMobile ? 14 : 16} />
          </motion.button>
          {colorDropdownOpen && (
            <motion.div
              className={styles.colorPicker}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className={styles.colorPickerHeader}>
                <span className={styles.colorPickerTitle}>Цвет текста</span>
              </div>

              {/* Цветовой круг */}
              <div className={styles.colorWheelSection}>
                <HexColorPicker
                  color={customColorValue}
                  onChange={handleCustomColorChange}
                  className={styles.colorWheel}
                />
              </div>

              {/* Разделитель */}
              <div className={styles.colorPickerDivider}></div>

              {/* Hex input */}
              <div className={styles.customColorSection}>
                <label className={styles.customColorLabel}>HEX код:</label>
                <div className={styles.customColorInputWrapper}>
                  <div
                    className={styles.colorPreview}
                    style={{ backgroundColor: customColorValue }}
                  ></div>
                  <input
                    type="text"
                    value={customColorValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                        setCustomColorValue(value);
                        if (value.length === 7) {
                          handleCustomColorChange(value);
                        }
                      }
                    }}
                    placeholder="#000000"
                    className={styles.customColorTextInput}
                    maxLength={7}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <div className={styles.toolbarGroup}>
        <motion.button
          className={`${styles.toolbarButton} ${isMarkActive("bold") ? styles.active : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark("bold");
          }}
          whileHover={{ scale: isMobile ? 1 : 1.05 }}
          whileTap={{ scale: isMobile ? 1 : 0.95 }}
        >
          <strong>Ж</strong>
        </motion.button>
        <motion.button
          className={`${styles.toolbarButton} ${isMarkActive("italic") ? styles.active : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark("italic");
          }}
          whileHover={{ scale: isMobile ? 1 : 1.05 }}
          whileTap={{ scale: isMobile ? 1 : 0.95 }}
        >
          <em>К</em>
        </motion.button>
        <motion.button
          className={`${styles.toolbarButton} ${isMarkActive("underline") ? styles.active : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark("underline");
          }}
          whileHover={{ scale: isMobile ? 1 : 1.05 }}
          whileTap={{ scale: isMobile ? 1 : 0.95 }}
        >
          <u>Ж</u>
        </motion.button>
      </div>
      <div className={styles.toolbarGroup}>
        <motion.button
          className={styles.toolbarButton}
          onMouseDown={(e) => {
            e.preventDefault();
            insertLink();
          }}
          whileHover={{ scale: isMobile ? 1 : 1.05 }}
          whileTap={{ scale: isMobile ? 1 : 0.95 }}
        >
          <Link size={isSmallMobile ? 12 : isMobile ? 14 : 16} />
        </motion.button>
        <motion.button
          className={styles.toolbarButton}
          onMouseDown={(e) => {
            e.preventDefault();
            removeLink();
          }}
          whileHover={{ scale: isMobile ? 1 : 1.05 }}
          whileTap={{ scale: isMobile ? 1 : 0.95 }}
        >
          <Unlink size={isSmallMobile ? 12 : isMobile ? 14 : 16} />
        </motion.button>
      </div>
      <div className={styles.toolbarGroup}>
        <motion.button
          className={styles.toolbarButton}
          onMouseDown={(e) => {
            e.preventDefault();
            setTextAlignment("left");
          }}
          whileHover={{ scale: isMobile ? 1 : 1.05 }}
          whileTap={{ scale: isMobile ? 1 : 0.95 }}
        >
          <AlignLeft size={isSmallMobile ? 12 : isMobile ? 14 : 16} />
        </motion.button>
        <motion.button
          className={styles.toolbarButton}
          onMouseDown={(e) => {
            e.preventDefault();
            setTextAlignment("center");
          }}
          whileHover={{ scale: isMobile ? 1 : 1.05 }}
          whileTap={{ scale: isMobile ? 1 : 0.95 }}
        >
          <AlignCenter size={isSmallMobile ? 12 : isMobile ? 14 : 16} />
        </motion.button>
        <motion.button
          className={styles.toolbarButton}
          onMouseDown={(e) => {
            e.preventDefault();
            setTextAlignment("right");
          }}
          whileHover={{ scale: isMobile ? 1 : 1.05 }}
          whileTap={{ scale: isMobile ? 1 : 0.95 }}
        >
          <AlignRight size={isSmallMobile ? 12 : isMobile ? 14 : 16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Toolbar;
