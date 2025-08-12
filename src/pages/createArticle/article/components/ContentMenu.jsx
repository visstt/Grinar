import React, { useEffect, useState } from "react";

import { Image, Plus, Type, Video } from "lucide-react";

import styles from "./ContentMenu.module.css";

const ContentMenu = ({
  onAddText,
  onAddImage,
  onAddVideo,
  isOpen,
  onToggle,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallMobile(window.innerWidth <= 480);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Определяем размер иконки в зависимости от размера экрана
  const iconSize = isSmallMobile ? 14 : isMobile ? 16 : 20;

  return (
    <div className={styles.container}>
      <button
        className={`${styles.addButton} ${isOpen ? styles.active : ""}`}
        onClick={onToggle}
      >
        <Plus size={iconSize} />
      </button>

      <div className={`${styles.menu} ${isOpen ? styles.open : ""}`}>
        <button
          className={styles.menuItem}
          onClick={() => {
            onAddText();
          }}
        >
          <img src="/icons/Text.svg" alt="" />
        </button>

        <button
          className={styles.menuItem}
          onClick={() => {
            onAddImage();
          }}
        >
          <img src="/icons/gallery.svg" alt="" />
        </button>

        <button
          className={styles.menuItem}
          onClick={() => {
            onAddVideo();
          }}
        >
          <img src="/icons/video-square.svg" alt="" />
        </button>
      </div>
    </div>
  );
};

export default ContentMenu;
