import React from 'react';
import type { Task, TaskStatus } from '../types/task';

interface TaskListItemProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const TaskListItem: React.FC<TaskListItemProps> = ({ task, onClick }) => {
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Todo':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
            Todo
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E0F7FE] text-[#0284C7] border border-[#BAE6FD]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] animate-pulse" />
            In Progress
          </span>
        );
      case 'Done':
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
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div
      onClick={() => onClick(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(task);
        }
      }}
      className="group bg-[#FBFBFC] hover:bg-white border border-[#EBEBEF] hover:border-[#D5D5D9] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
    >
      {/* Title & Description */}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="font-semibold text-sm sm:text-base text-[#171717] group-hover:text-black line-clamp-1 leading-snug">
          {task.title}
        </h4>
        {task.description ? (
          <p className="text-xs sm:text-sm text-[#77777F] mt-1 line-clamp-1 leading-normal">
            {task.description}
          </p>
        ) : (
          <p className="text-xs text-[#9CA3AF] italic mt-1">
            No description provided
          </p>
        )}
        <div className="flex items-center gap-3 mt-2 text-[11px] text-[#9CA3AF]">
          <span>Created: {formatDate(task.created_at)}</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0">
        {getStatusBadge(task.status)}
      </div>
    </div>
  );
};
