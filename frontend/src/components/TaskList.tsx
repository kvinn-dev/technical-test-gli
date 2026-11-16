import React, { useState } from "react";
import { Plus, Inbox, CheckSquare, Trash2, X } from "lucide-react";
import type { Task } from "../types/task";
import { TaskFilter, type FilterType } from "./TaskFilter";
import { TaskListItem } from "./TaskListItem";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface TaskListProps {
  tasks: Task[];
  filteredTasks: Task[];
  currentFilter: FilterType;
  isLoading: boolean;
  onFilterChange: (filter: FilterType) => void;
  onTaskClick: (task: Task) => void;
  onAddTaskClick: () => void;
  onDeleteSelected: (taskIds: Task["id"][]) => Promise<void>;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filteredTasks,
  currentFilter,
  isLoading,
  onFilterChange,
  onTaskClick,
  onAddTaskClick,
  onDeleteSelected,
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Task["id"][]>([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "Todo").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    done: tasks.filter((t) => t.status === "Done").length,
  };

  const toggleTaskSelection = (taskId: Task["id"]) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const handleCancelSelection = () => {
    setIsSelecting(false);
    setSelectedTaskIds([]);
  };

  const handleDeleteSelected = () => {
    if (selectedTaskIds.length === 0) return;

    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteSelected = async () => {
    if (selectedTaskIds.length === 0) return;

    setIsDeletingSelected(true);

    try {
      await onDeleteSelected(selectedTaskIds);

      setIsDeleteConfirmOpen(false);
      handleCancelSelection();
    } catch (error) {
      console.error("Failed to delete selected tasks:", error);
    } finally {
      setIsDeletingSelected(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 shadow-sm border border-[#DCDCE0]">
      <div className="flex flex-row items-center justify-between gap-2 mb-4 md:mb-5 lg:mb-6">
        <div className="min-w-0">
          <h2 className="text-lg md:text-[26px] lg:text-3xl font-extrabold text-[#171717] tracking-tight">
            All Tasks
          </h2>
          <p className="text-[11px] sm:text-xs md:text-[13px] lg:text-sm text-[#77777F] mt-0.5">
            Manage and track all your project tasks
          </p>
        </div>

        <button
          type="button"
          onClick={onAddTaskClick}
          className="shrink-0 px-3 sm:px-4 md:px-[18px] lg:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs md:text-[13px] lg:text-sm font-semibold text-white bg-[#111111] hover:bg-black active:scale-95 transition-all flex items-center gap-1 sm:gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter and Selection Controls */}
      <div className="flex items-center justify-between gap-2 mb-4 md:mb-5 lg:mb-6">
        <div className="min-w-0 flex-1 overflow-x-auto">
          <TaskFilter
            currentFilter={currentFilter}
            onFilterChange={onFilterChange}
            counts={counts}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isSelecting && selectedTaskIds.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={isDeletingSelected}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span className="hidden sm:inline">
                Delete ({selectedTaskIds.length})
              </span>
            </button>
          )}

          <button
            type="button"
            disabled={isDeletingSelected}
            onClick={
              isSelecting ? handleCancelSelection : () => setIsSelecting(true)
            }
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              isSelecting
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-[#F4F4F6] text-[#171717] hover:bg-[#E8E8EB]"
            }`}
          >
            {isSelecting ? (
              <>
                <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="hidden sm:inline">Cancel</span>
              </>
            ) : (
              <>
                <CheckSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Choose</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Task List */}
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
            <TaskListItem
              key={task.id}
              task={task}
              onClick={onTaskClick}
              isSelecting={isSelecting}
              isSelected={selectedTaskIds.includes(task.id)}
              onSelect={() => toggleTaskSelection(task.id)}
            />
          ))}
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      <DeleteConfirmationModal
        selectedCount={selectedTaskIds.length}
        isOpen={isDeleteConfirmOpen}
        isDeleting={isDeletingSelected}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDeleteSelected}
      />
    </section>
  );
};
