import React, { useEffect, useRef, useState } from "react";
import type { Task } from "../types/task";
import { FolderCard } from "./FolderCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TaskDashboardProps {
  inProgressTasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const TaskDashboard: React.FC<TaskDashboardProps> = ({
  inProgressTasks,
  onTaskClick,
}) => {
  const count = inProgressTasks.length;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  // Calculate horizontal scroll positions for each page
  const getPagePositions = (container: HTMLDivElement) => {
    const maxScroll = container.scrollWidth - container.clientWidth;
    const step = Math.max(container.clientWidth * 0.8, 1);

    if (maxScroll <= 1) return [0];

    const positions: number[] = [];

    for (let position = 0; position < maxScroll - 1; position += step) {
      positions.push(position);
    }

    positions.push(maxScroll);

    return positions;
  };

  // Update navigation buttons and active pagination dot
  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    const positions = getPagePositions(container);

    setCanScrollLeft(container.scrollLeft > 1);
    setCanScrollRight(container.scrollLeft < maxScroll - 1);
    setPageCount(positions.length);

    // Find the closest page to the current scroll position
    const currentPage = positions.reduce((closest, position, index) => {
      const currentDistance = Math.abs(container.scrollLeft - position);
      const closestDistance = Math.abs(
        container.scrollLeft - positions[closest],
      );

      return currentDistance < closestDistance ? index : closest;
    }, 0);

    setActivePage(currentPage);
  };

  // Scroll folder cards horizontally
  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;

    if (!container) return;

    container.scrollBy({
      left:
        direction === "right"
          ? container.clientWidth * 0.8
          : -(container.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  // Navigate directly to a selected page
  const handlePageClick = (pageIndex: number) => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const positions = getPagePositions(container);

    container.scrollTo({
      left: positions[pageIndex],
      behavior: "smooth",
    });
  };

  // Initialize and listen for scroll and resize events
  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    updateScrollButtons();

    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [count]);

  return (
    <section className="w-full mb-6 sm:mb-8 md:mb-10">
      {/* Dynamic Heading */}
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight mb-4 sm:mb-5 md:mb-6 whitespace-nowrap">
        Task Dashboard{" "}
        <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[#77777F]">
          ({count})
        </span>
      </h1>

      {/* Folder Cards Container */}
      {count === 0 ? (
        <div className="bg-white/80 border border-dashed border-[#DCDCE0] rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 text-center">
          <p className="text-xs sm:text-sm md:text-base text-[#77777F] font-medium">
            No tasks in progress yet.
          </p>
          <p className="text-[10px] sm:text-xs text-[#9CA3AF] mt-1">
            Tasks with "In Progress" status will appear here as folder cards.
          </p>
        </div>
      ) : (
        <div className="w-full">
          {/* Carousel Navigation */}
          <div className="relative">
            {/* Left Navigation */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => handleScroll("left")}
                className="absolute left-1 sm:left-1.5 md:left-2 top-1/2 -translate-y-1/2 z-20
                           w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10
                           rounded-full bg-white/95
                           shadow-md border border-[#DCDCE0]
                           flex items-center justify-center
                           text-[#171717] hover:bg-white
                           transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Scroll folders left"
              >
                <ChevronLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 lg:w-[22px] lg:h-[22px]" />
              </button>
            )}

            {/* Horizontal Scroll Area */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto hide-scrollbar gap-3 sm:gap-3.5 md:gap-4 pb-2 sm:pb-3"
            >
              {inProgressTasks.map((task, index) => (
                <FolderCard
                  key={task.id}
                  task={task}
                  index={index}
                  onClick={onTaskClick}
                />
              ))}
            </div>

            {/* Right Navigation */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => handleScroll("right")}
                className="absolute right-1 sm:right-1.5 md:right-2 top-1/2 -translate-y-1/2 z-20
                           w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10
                           rounded-full bg-white/95
                           shadow-md border border-[#DCDCE0]
                           flex items-center justify-center
                           text-[#171717] hover:bg-white
                           transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Scroll folders right"
              >
                <ChevronRight className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 lg:w-[22px] lg:h-[22px]" />
              </button>
            )}
          </div>

          {/* Carousel Pagination Dots */}
          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-2.5 md:mt-3">
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePageClick(index)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activePage === index
                      ? "w-4 sm:w-5 md:w-6 bg-[#171717]"
                      : "w-1.5 sm:w-2 bg-[#C4C4C8] hover:bg-[#77777F]"
                  }`}
                  aria-label={`Go to folder page ${index + 1}`}
                  aria-current={activePage === index ? "true" : undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
