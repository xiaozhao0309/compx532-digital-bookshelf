import { useEffect } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
}

export function Modal({ open, onClose, children, labelledBy }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="关闭"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
