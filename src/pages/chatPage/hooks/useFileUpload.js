import { useRef, useState } from "react";

import api from "../../../shared/api/api";

export function useFileUpload(onFileMessage) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const validateFile = (file) => {
    // Проверяем размер файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Файл слишком большой. Максимальный размер: 5MB");
      return false;
    }

    // Проверяем тип файла
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Недопустимый тип файла. Разрешены: JPEG, PNG, PDF");
      return false;
    }

    return true;
  };

  const uploadFile = async (file) => {
    if (!validateFile(file)) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/chat/upload-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Отправляем сообщение с файлом
      const fileMessage = `[Файл: ${file.name}](${response.data.filePath})`;
      onFileMessage(fileMessage);
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
      alert("Ошибка при загрузке файла");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    await uploadFile(file);

    // Очищаем input
    e.target.value = "";
  };

  return {
    uploading,
    fileInputRef,
    openFileDialog,
    handleFileChange,
    uploadFile,
  };
}
