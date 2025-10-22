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
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md text-center border border-gray-200 dark:border-zinc-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-3 bg-[#e60080] text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[#e60080]/50"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50 dark:focus:ring-zinc-600/50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
