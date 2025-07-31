import React, { useRef, useState } from "react";

import { Image, Link, Upload, Video, X } from "lucide-react";

import styles from "./MediaModal.module.css";

const MediaModal = ({ isOpen, onClose, onUpload, type = "image" }) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [urlInput, setUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onUpload(e.target.result);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUpload(urlInput.trim());
      onClose();
      setUrlInput("");
    }
  };

  const isImage = type === "image";
  const title = isImage ? "Добавить фото" : "Добавить видео";
  const Icon = isImage ? Image : Video;
  const acceptedTypes = isImage ? "image/*" : "video/*";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Icon size={24} className={styles.icon} />
            <h2>{title}</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "upload" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            <Upload size={16} />
            Загрузить с устройства
          </button>
          <button
            className={`${styles.tab} ${activeTab === "url" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("url")}
          >
            <Link size={16} />
            Добавить по ссылке
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === "upload" && (
            <div
              className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.uploadContent}>
                <div className={styles.uploadIcon}>
                  <Icon size={48} />
                </div>
                <h3>Перетащите изображение</h3>
                <p>Рекомендуется ширина не менее 1600 пикселей.</p>
                <p>Максимальный размер — 10 МБ</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes}
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </div>
          )}

          {activeTab === "url" && (
            <div className={styles.urlSection}>
              <label>Добавить по ссылке</label>
              <input
                type="url"
                placeholder="Укажите ссылку"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className={styles.urlInput}
              />
            </div>
          )}
        </div>

        {activeTab === "upload" && (
          <div className={styles.footer}>
            <button
              className={styles.uploadButton}
              onClick={() => fileInputRef.current?.click()}
            >
              Загрузить с устройства
            </button>
          </div>
        )}

        {activeTab === "url" && (
          <div className={styles.footer}>
            <button
              className={styles.submitButton}
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              Добавить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaModal;
