import React, { useRef, useState } from "react";

import { Image as ImageIcon, Upload, X } from "lucide-react";

import Button from "../../../../shared/ui/components/button/Button";
import styles from "./MediaModal.module.css";

const MediaModal = ({ isOpen, onClose, onUpload, type = "image" }) => {
  const fileInputRef = useRef(null);
  const [urlInput, setUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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
    if (!file.type.startsWith("image/")) {
      alert("Пожалуйста, выберите файл изображения");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleAreaClick = () => {
    if (!preview) {
      fileInputRef.current?.click();
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      // Если нет URL, но есть превью - добавляем превью
      if (preview) {
        handleFileUpload();
        return;
      }
      alert("Пожалуйста, введите URL изображения");
      return;
    }

    // Простая проверка URL на изображение
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const isImageUrl =
      imageExtensions.some((ext) => urlInput.toLowerCase().includes(ext)) ||
      urlInput.includes("unsplash.com") ||
      urlInput.includes("images");

    if (!isImageUrl) {
      alert("Пожалуйста, введите корректную ссылку на изображение");
      return;
    }

    onUpload && onUpload(urlInput.trim());
    handleClose();
  };

  const handleFileUpload = () => {
    if (preview) {
      onUpload && onUpload(preview);
      handleClose();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleClose = () => {
    setPreview(null);
    setSelectedFile(null);
    setUrlInput("");
    setDragActive(false);
    onClose();
  };

  const removePreview = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h1>Добавить фото</h1>
          <button
            type="button"
            onClick={handleClose}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "12px",
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 1100,
            }}
            aria-label="Закрыть"
          >
            <X color="#fff" size={20} strokeWidth={2} />
          </button>
        </div>
        <div className={styles.content}>
          <div
            className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ""}`}
            onClick={handleAreaClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className={styles.previewContainer}>
                <img
                  src={preview}
                  alt="Preview"
                  className={styles.previewImage}
                />
                <button
                  className={styles.removeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    removePreview();
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className={styles.uploadContent}>
                <h3>Перетащите изображение</h3>
                <p>Рекомендуется ширина не менее 1600 пикселей.</p>
                <p>Максимальный размер — 10 МБ</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className={styles.fileInput}
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="imageUrl">Добавить по ссылке</label>
            <input
              type="url"
              id="imageUrl"
              autoComplete="off"
              placeholder="Укажите ссылку"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleUrlSubmit();
                }
              }}
            />
          </div>
          <Button
            variant="primary"
            className={styles.addButton}
            onClick={
              preview
                ? handleFileUpload
                : urlInput.trim()
                  ? handleUrlSubmit
                  : () => fileInputRef.current?.click()
            }
          >
            {preview
              ? "Добавить изображение"
              : urlInput.trim()
                ? "Добавить по ссылке"
                : "Загрузить с устройства"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;
