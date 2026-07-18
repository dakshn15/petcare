import React from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-3xl ${maxWidth} w-full shadow-2xl border border-gray-100 flex flex-col overflow-hidden max-h-[90vh] animate-fadeIn`}>
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b shrink-0 flex justify-between items-center bg-white">
          <h4 className="text-xl font-bold font-quicksand text-dark">{title}</h4>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Modal Content */}
        {children}
      </div>
    </div>,
    document.body
  );
}
