import React, { useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import type { Task } from '../types/task';

interface DeleteConfirmationModalProps {
  task: Task | null;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  task,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-[420px] rounded-3xl p-6 sm:p-7 shadow-2xl relative flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[#171717] mb-2">
          Delete this task?
        </h3>

        <p className="text-xs sm:text-sm text-[#77777F] leading-relaxed mb-6">
          Are you sure you want to permanently delete{' '}
          <strong className="text-[#171717]">"{task.title}"</strong>? This action cannot be undone.
        </p>

        <div className="w-full flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#4B5563] bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
