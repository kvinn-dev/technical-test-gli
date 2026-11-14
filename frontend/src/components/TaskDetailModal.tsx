import React, { useEffect } from "react";
import { X, Pencil, Trash2, Calendar, Clock } from "lucide-react";
import type { Task, TaskStatus } from "../types/task";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "Todo":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
            Todo
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E0F7FE] text-[#0284C7] border border-[#BAE6FD]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] animate-pulse" />
            In Progress
          </span>
        );
      case "Done":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            Done
          </span>
        );
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-white w-full max-w-[520px] rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0F0F2]">
          <div className="flex items-center gap-2">
            {getStatusBadge(task.status)}
            <span className="text-xs text-[#9CA3AF]">Task #{task.id}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#77777F] hover:text-[#171717] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 hide-scrollbar">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#171717] leading-snug">
              {task.title}
            </h2>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
              Description
            </h4>
            {task.description ? (
              <p className="text-sm sm:text-base text-[#4B5563] whitespace-pre-line leading-relaxed bg-[#FBFBFC] p-4 rounded-2xl border border-[#F0F0F2]">
                {task.description}
              </p>
            ) : (
              <p className="text-sm text-[#9CA3AF] italic bg-[#FBFBFC] p-4 rounded-2xl border border-[#F0F0F2]">
                No description provided for this task.
              </p>
            )}
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#77777F]">
            <div className="flex items-center gap-2 bg-[#F9F9FA] p-3 rounded-xl border border-[#F0F0F2]">
              <Calendar className="w-4 h-4 text-[#9CA3AF]" />
              <div>
                <span className="block text-[10px] text-[#9CA3AF] uppercase">
                  Created
                </span>
                <span className="font-medium text-[#171717]">
                  {formatDate(task.created_at)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#F9F9FA] p-3 rounded-xl border border-[#F0F0F2]">
              <Clock className="w-4 h-4 text-[#9CA3AF]" />
              <div>
                <span className="block text-[10px] text-[#9CA3AF] uppercase">
                  Last Updated
                </span>
                <span className="font-medium text-[#171717]">
                  {formatDate(task.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#F0F0F2] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#111111] hover:bg-black flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};
