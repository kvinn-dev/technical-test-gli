import React from "react";
import type { Task } from "../types/task";

interface FolderCardProps {
  task: Task;
  index: number;
  onClick: (task: Task) => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  task,
  index,
  onClick,
}) => {
  // Odd positions (1, 3, 5...) use Blue, Even positions (2, 4, 6...) use Yellow
  const isBlue = index % 2 === 0;
  const themeColor = isBlue ? "#12B5E5" : "#F5B91B";

  return (
    <div
      onClick={() => onClick(task)}
      className="group relative cursor-pointer select-none transition-transform duration-200 hover:-translate-y-1 active:scale-[0.99] flex-none w-[300px] sm:w-[360px] lg:w-[400px]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(task);
        }
      }}
    >
      {/* Paper coming out of the folder */}
      <div
        className="absolute z-0 top-10 left-4 right-4 h-[120px]
             rounded-xl bg-white shadow-md
             transition-transform duration-300 ease-out
             group-hover:-translate-y-7"
        aria-hidden="true"
      />

      {/* Folder Tab at top */}
      <div className="relative z-10 flex items-end">
        <div
          style={{ backgroundColor: themeColor }}
          className="relative px-4 py-2 rounded-t-2xl -bottom-1 flex items-center gap-1.5 shadow-xs"
        >
          {/* Status pill badge inside tab */}
          <div className="bg-white/95 text-[#171717] px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: isBlue ? "#0284C7" : "#D97706" }}
            />
            <span>In Progress</span>
          </div>

          {/* Smooth transition curve from tab to shoulder */}
          <svg
            className="absolute -right-3 bottom-0 w-3 h-3 overflow-visible pointer-events-none"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M0 12 C 0 4, 4 0, 12 0 L 0 0 Z"
              fill={themeColor}
              transform="scale(1, -1) translate(0, -12)"
            />
          </svg>
        </div>
      </div>

      {/* Main Folder Body */}
      <div
        style={{ backgroundColor: themeColor }}
        className="relative z-10 rounded-b-2xl rounded-tr-2xl p-6 min-h-[210px] flex flex-col justify-between overflow-hidden shadow-sm"
      >
        {/* Content */}
        <div className="relative z-10">
          <h3 className="font-bold text-[#171717] text-lg sm:text-xl leading-snug line-clamp-2">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-[#171717]/75 text-xs sm:text-sm mt-2 line-clamp-2 leading-snug">
              {task.description}
            </p>
          )}
        </div>

        {/* Decorative Dotted Matrix in bottom right (reference visual) */}
        <div
          className="absolute left-6 right-6 md:bottom-16 h-6 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1.2px, transparent 1.2px)",
            backgroundSize: "7px 8px",
          }}
          aria-hidden="true"
        />

        {/* Footer info */}
        <div className="relative z-10 mt-4 flex items-center justify-between text-xs font-medium text-[#171717]/70">
          <span>Task #{task.id}</span>
          <span className="text-[11px] bg-black/10 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};
