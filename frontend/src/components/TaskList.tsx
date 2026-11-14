import React from "react";
import { Plus, Inbox } from "lucide-react";
import type { Task } from "../types/task";
import { TaskFilter, type FilterType } from "./TaskFilter";
import { TaskListItem } from "./TaskListItem";

interface TaskListProps {
  tasks: Task[];
  filteredTasks: Task[];
  currentFilter: FilterType;
  isLoading: boolean;
  onFilterChange: (filter: FilterType) => void;
  onTaskClick: (task: Task) => void;
  onAddTaskClick: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filteredTasks,
  currentFilter,
  isLoading,
  onFilterChange,
  onTaskClick,
  onAddTaskClick,
}) => {
  // Compute counts for the filter pills
  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "Todo").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    done: tasks.filter((t) => t.status === "Done").length,
  };

  return (
    <section className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-sm border border-[#DCDCE0]">
      {/* Header Row: Title and + Add Task button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 md:mb-5 lg:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-[26px] lg:text-3xl font-extrabold text-[#171717] tracking-tight">
            All Tasks
          </h2>
          <p className="text-[11px] sm:text-xs md:text-[13px] lg:text-sm text-[#77777F] mt-0.5">
            Manage and track all your project tasks
          </p>
        </div>

        {/* Primary "+ Add Task" button */}
        <button
          type="button"
          onClick={onAddTaskClick}
          className="self-start sm:self-auto px-3 sm:px-4 md:px-[18px] lg:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs md:text-[13px] lg:text-sm font-semibold text-white bg-[#111111] hover:bg-black active:scale-95 transition-all flex items-center gap-1 sm:gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter Segmented Control */}
      <div className="mb-4 md:mb-5 lg:mb-6">
        <TaskFilter
          currentFilter={currentFilter}
          onFilterChange={onFilterChange}
          counts={counts}
        />
      </div>

      {/* Task List Items Stack */}
      {isLoading ? (
        <div className="space-y-2 sm:space-y-3 py-3 sm:py-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 sm:h-18 md:h-20 bg-[#F4F4F6] rounded-xl md:rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="py-8 sm:py-10 md:py-11 lg:py-12 px-3 sm:px-4 text-center bg-[#FBFBFC] rounded-xl md:rounded-2xl border border-dashed border-[#E5E5E8]">
          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 mx-auto rounded-xl md:rounded-2xl bg-white border border-[#E5E5E8] text-[#9CA3AF] flex items-center justify-center mb-2 sm:mb-3">
            <Inbox className="w-5 h-5 sm:w-[22px] sm:h-[22px] md:w-6 md:h-6" />
          </div>

          <h4 className="text-xs sm:text-sm md:text-[15px] lg:text-base font-semibold text-[#171717]">
            {tasks.length === 0
              ? "No tasks created yet"
              : "No tasks in this category"}
          </h4>

          <p className="text-[11px] sm:text-xs md:text-[13px] lg:text-sm text-[#77777F] mt-1 max-w-sm mx-auto">
            {tasks.length === 0
              ? 'Get started by creating your first task using the "+ Add Task" button above.'
              : `There are currently no tasks with "${currentFilter}" status.`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3">
          {filteredTasks.map((task) => (
            <TaskListItem key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </div>
      )}
    </section>
  );
};
