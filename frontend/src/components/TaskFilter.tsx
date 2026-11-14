import React, { useEffect, useRef, useState } from "react";
import type { TaskStatus } from "../types/task";

export type FilterType = "All" | TaskStatus;

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts?: {
    all: number;
    todo: number;
    inProgress: number;
    done: number;
  };
}

const filterOptions: FilterType[] = ["All", "Todo", "In Progress", "Done"];

export const TaskFilter: React.FC<TaskFilterProps> = ({
  currentFilter,
  onFilterChange,
  counts,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
  });

  const getCount = (filter: FilterType) => {
    if (!counts) return null;

    switch (filter) {
      case "All":
        return counts.all;
      case "Todo":
        return counts.todo;
      case "In Progress":
        return counts.inProgress;
      case "Done":
        return counts.done;
    }
  };

  // Measure the active button's position and width.
  const updateIndicator = () => {
    const container = containerRef.current;
    const activeIndex = filterOptions.indexOf(currentFilter);
    const activeButton = buttonRefs.current[activeIndex];

    if (!container || !activeButton) return;

    setIndicator({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
    });
  };

  useEffect(() => {
    updateIndicator();

    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [currentFilter, counts]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center bg-[#EFEFF1] p-1 rounded-full max-w-full overflow-x-auto hide-scrollbar"
    >
      {/* Sliding active background */}
      <div
        className="absolute top-1 bottom-1 left-0 bg-[#111111] rounded-full shadow-xs transition-all duration-300 ease-in-out pointer-events-none"
        style={{
          width: `${indicator.width}px`,
          transform: `translateX(${indicator.left}px)`,
        }}
      />

      {filterOptions.map((filter, index) => {
        const isActive = currentFilter === filter;
        const count = getCount(filter);

        return (
          <button
            key={filter}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`relative z-10 px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors duration-200 ${
              isActive ? "text-white" : "text-[#77777F] hover:text-[#171717]"
            }`}
          >
            {filter}

            {count !== null && (
              <span
                className={`ml-1 text-[11px] font-normal ${
                  isActive ? "text-white/80" : "text-[#77777F]"
                }`}
              >
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
