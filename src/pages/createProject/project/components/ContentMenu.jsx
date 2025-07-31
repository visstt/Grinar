import React from "react";

import { Image, Plus, Type, Video } from "lucide-react";

import styles from "./ContentMenu.module.css";

const ContentMenu = ({
  onAddText,
  onAddImage,
  onAddVideo,
  isOpen,
  onToggle,
}) => {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.addButton} ${isOpen ? styles.active : ""}`}
        onClick={onToggle}
      >
        <Plus size={20} />
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
