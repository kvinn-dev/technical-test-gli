import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import type { Task, TaskCreate, TaskStatus, TaskUpdate } from "../types/task";

interface TaskFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  taskToEdit?: Task | null;
  onClose: () => void;
  onSubmitCreate: (payload: TaskCreate) => Promise<void>;
  onSubmitEdit: (id: number, payload: TaskUpdate) => Promise<void>;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  mode,
  taskToEdit,
  onClose,
  onSubmitCreate,
  onSubmitEdit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Todo");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or reset form data when opened
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || "");
        setStatus(taskToEdit.status);
      } else {
        setTitle("");
        setDescription("");
        setStatus("Todo");
      }
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, mode, taskToEdit]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError("Task title is required and cannot be whitespace only.");
      return;
    }

    if (cleanTitle.length > 255) {
      setError("Title cannot exceed 255 characters.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        await onSubmitCreate({
          title: cleanTitle,
          description: description.trim() ? description.trim() : null,
          status,
        });
      } else if (mode === "edit" && taskToEdit) {
        await onSubmitEdit(taskToEdit.id, {
          title: cleanTitle,
          description: description.trim() ? description.trim() : null,
          status,
        });
      }

      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while saving the task.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 bg-black/45 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-2xl relative flex flex-col hide-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-[#F0F0F2] gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#171717]">
            {mode === "create" ? "Create New Task" : "Edit Task"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#77777F] hover:text-[#171717] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="pt-4 md:pt-5 space-y-3 sm:space-y-3.5 md:space-y-4"
        >
          {error && (
            <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Title Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="task-title"
                className="text-[11px] sm:text-xs font-bold text-[#171717]"
              >
                Title <span className="text-red-500">*</span>
              </label>

              <span className="text-[10px] sm:text-[11px] text-[#9CA3AF]">
                {title.length}/255
              </span>
            </div>

            <input
              id="task-title"
              type="text"
              value={title}
              maxLength={255}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Landing Page Mockup"
              className="w-full px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-[#DCDCE0] focus:border-[#111111] focus:ring-1 focus:ring-[#111111] text-xs sm:text-[13px] md:text-sm text-[#171717] placeholder:text-[#9CA3AF] outline-none transition-all"
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-[11px] sm:text-xs font-bold text-[#171717] mb-1.5"
            >
              Description{" "}
              <span className="text-[10px] sm:text-[11px] font-normal text-[#9CA3AF]">
                (Optional)
              </span>
            </label>

            <textarea
              id="task-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, notes, or subtasks..."
              className="w-full px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-[#DCDCE0] focus:border-[#111111] focus:ring-1 focus:ring-[#111111] text-xs sm:text-[13px] md:text-sm text-[#171717] placeholder:text-[#9CA3AF] outline-none transition-all resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Status Select */}
          <div>
            <label
              htmlFor="task-status"
              className="block text-[11px] sm:text-xs font-bold text-[#171717] mb-1.5"
            >
              Status
            </label>

            <div className="relative">
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                disabled={isSubmitting}
                className="w-full px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-[#DCDCE0] bg-white focus:border-[#111111] focus:ring-1 focus:ring-[#111111] text-xs sm:text-[13px] md:text-sm text-[#171717] outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 sm:px-4 text-[#77777F]">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 md:pt-4 border-t border-[#F0F0F2] flex items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs md:text-sm font-semibold text-[#4B5563] bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs md:text-sm font-semibold text-white bg-[#111111] hover:bg-black transition-colors shadow-sm flex items-center gap-1.5 sm:gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting && (
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              )}
              <span>{mode === "create" ? "Create Task" : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
