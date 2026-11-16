import React from "react";
import type { Task, TaskStatus } from "../types/task";

interface TaskListItemProps {
  task: Task;
  onClick: (task: Task) => void;
  isSelecting: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onClick,
  isSelecting,
  isSelected,
  onSelect,
}) => {
  const getStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case "Todo":
        return {
          card: "bg-[#E0F2FE]/70 hover:bg-[#E0F2FE] border-[#BAE6FD]",
          badge: "bg-[#12B5E5] text-white",
        };

      case "In Progress":
        return {
          card: "bg-[#FEF3C7]/70 hover:bg-[#FEF3C7] border-[#FDE68A]",
          badge: "bg-[#F5B91B] text-white",
        };

      case "Done":
        return {
          card: "bg-[#DCFCE7]/70 hover:bg-[#DCFCE7] border-[#BBF7D0]",
          badge: "bg-[#16A34A] text-white",
        };
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const styles = getStatusStyle(task.status);

  const handleClick = () => {
    if (isSelecting) {
      onSelect();
    } else {
      onClick(task);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelecting ? isSelected : undefined}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`group border rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-5 flex items-center justify-between gap-2 sm:gap-3 md:gap-4 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99] ${
        styles.card
      } ${isSelected ? "ring-2 ring-[#171717] ring-offset-1" : ""}`}
    >
      {/* Selection Checkbox */}
      {isSelecting && (
        <div className="flex-shrink-0 flex items-center justify-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${task.title}`}
            className="w-4 h-4 sm:w-[18px] sm:h-[18px] accent-[#171717] cursor-pointer"
          />
        </div>
      )}

      {/* Title & Description */}
      <div className="flex-1 min-w-0 pr-1 sm:pr-2">
        <h4 className="font-bold text-xs sm:text-sm md:text-[15px] lg:text-lg text-[#171717] group-hover:text-black line-clamp-1 leading-snug">
          {task.title}
        </h4>

        {task.description ? (
          <p className="text-[10px] sm:text-xs md:text-[13px] lg:text-sm text-[#52525B] mt-1 line-clamp-1 leading-normal">
            {task.description}
          </p>
        ) : (
          <p className="text-[10px] sm:text-xs md:text-[13px] text-[#9CA3AF] italic mt-1">
            No description provided
          </p>
        )}

        <div className="flex items-center gap-2 sm:gap-3 mt-1.5 md:mt-2 text-[9px] sm:text-[10px] md:text-[12px] text-[#71717A]">
          <span>Created: {formatDate(task.created_at)}</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0 self-end">
        <span
          className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] sm:text-[11px] md:text-xs font-semibold border ${styles.badge}`}
        >
          {task.status}
        </span>
      </div>
    </div>
  );
};
