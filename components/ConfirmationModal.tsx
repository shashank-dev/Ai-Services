import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onConfirm, onCancel, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onCancel} // Close on backdrop click
    >
      <div
        className="bg-slate-800 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md text-center border border-slate-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 id="modal-title" className="text-2xl font-bold text-slate-200 mb-4">{title}</h2>
        <p className="text-slate-400 mb-8">{message}</p>
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-3 bg-red-800 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-red-800/50"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-slate-600/50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;