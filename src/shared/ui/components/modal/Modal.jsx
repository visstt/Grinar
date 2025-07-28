import React, { useRef } from "react";

import { X } from "lucide-react";

import useClickOutside from "../modal/useClickOutside";
import styles from "./Modal.module.css";

export default function Modal({ open, onClose, children }) {
  const modalRef = useRef(null);
  useClickOutside(modalRef, onClose);
  if (!open) return null;
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal} ref={modalRef}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
