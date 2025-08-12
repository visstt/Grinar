import React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

import styles from "./SortableMediaItem.module.css";

const SortableMediaItem = ({ id, item, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.mediaItem}>
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>

      <div className={styles.mediaPreview}>
        {item.type === "image" ? (
          <img src={item.url} alt={item.name} className={styles.thumbnail} />
        ) : (
          <video src={item.url} className={styles.thumbnail} controls={false} />
        )}
      </div>

      <div className={styles.mediaInfo}>
        <span className={styles.fileName}>{item.name}</span>
        <span className={styles.fileType}>{item.type}</span>
      </div>

      <button
        className={styles.removeButton}
        onClick={() => onRemove(id)}
        aria-label="Удалить"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default SortableMediaItem;
