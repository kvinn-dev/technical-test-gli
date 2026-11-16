import { useState, useEffect, useMemo, useCallback } from "react";
import type { Task, TaskCreate, TaskUpdate } from "./types/task";
import { getTasks, createTask, updateTask, deleteTask } from "./api/taskApi";
import { TaskDashboard } from "./components/TaskDashboard";
import { TaskList } from "./components/TaskList";
import { type FilterType } from "./components/TaskFilter";
import { TaskDetailModal } from "./components/TaskDetailModal";
import { TaskFormModal } from "./components/TaskFormModal";
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";
import { AlertCircle, RefreshCw } from "lucide-react";

export function App() {
  // Task data state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Active filter state for All Tasks section
  const [currentFilter, setCurrentFilter] = useState<FilterType>("All");

  // Modals state
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch tasks from backend API
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to connect to backend API. Please make sure the backend is running.";
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Prevent background scrolling when any modal is open
  useEffect(() => {
    const isAnyModalOpen =
      detailTask !== null || isFormOpen || taskToDelete !== null;

    document.body.style.overflow = isAnyModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [detailTask, isFormOpen, taskToDelete]);

  // Derived tasks for Task Dashboard (strictly In Progress tasks)
  const inProgressTasks = useMemo(() => {
    return tasks.filter((t) => t.status === "In Progress");
  }, [tasks]);

  // Derived filtered tasks for All Tasks section
  const filteredTasks = useMemo(() => {
    if (currentFilter === "All") return tasks;
    return tasks.filter((t) => t.status === currentFilter);
  }, [tasks, currentFilter]);

  // Handlers for modal navigation
  const handleOpenCreateModal = () => {
    setFormMode("create");
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setDetailTask(null); // Close detail modal if open
    setFormMode("edit");
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleOpenDeleteConfirm = (task: Task) => {
    setDetailTask(null); // Close detail modal if open
    setTaskToDelete(task);
  };

  const handleTaskClick = (task: Task) => {
    setDetailTask(task);
  };

  // CRUD Actions
  const handleCreateTask = async (payload: TaskCreate) => {
    const newTask = await createTask(payload);
    // Optimistically prepend / add to task list
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTask = async (id: number, payload: TaskUpdate) => {
    const updated = await updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    // If the task being viewed in detail modal was updated, keep detail sync
    if (detailTask && detailTask.id === id) {
      setDetailTask(updated);
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete task.";
      alert(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = async (taskIds: Task["id"][]) => {
    try {
      await Promise.all(taskIds.map((id) => deleteTask(id)));

      setTasks((prev) => prev.filter((task) => !taskIds.includes(task.id)));
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete selected tasks.";

      alert(msg);
      await fetchTasks();
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-[#E8E8EA] text-[#171717] px-4 py-8 sm:px-6 sm:py-10 md:py-12">
      <main className="max-w-[1100px] mx-auto w-full">
        {/* Error notification banner if API connection fails */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
            <button
              onClick={fetchTasks}
              className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 hover:bg-amber-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* 1. Task Dashboard Section with In Progress Folder Cards */}
        <TaskDashboard
          inProgressTasks={inProgressTasks}
          onTaskClick={handleTaskClick}
        />

        {/* 2. All Tasks Section with Filters and Add Task button */}
        <TaskList
          tasks={tasks}
          filteredTasks={filteredTasks}
          currentFilter={currentFilter}
          isLoading={isLoading}
          onFilterChange={setCurrentFilter}
          onTaskClick={handleTaskClick}
          onAddTaskClick={handleOpenCreateModal}
          onDeleteSelected={handleDeleteSelected}
        />

        {/* Modals */}
        <TaskDetailModal
          task={detailTask}
          isOpen={detailTask !== null}
          onClose={() => setDetailTask(null)}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteConfirm}
        />

        <TaskFormModal
          isOpen={isFormOpen}
          mode={formMode}
          taskToEdit={taskToEdit}
          onClose={() => {
            setIsFormOpen(false);
            setTaskToEdit(null);
          }}
          onSubmitCreate={handleCreateTask}
          onSubmitEdit={handleUpdateTask}
        />

        <DeleteConfirmationModal
          task={taskToDelete}
          isOpen={taskToDelete !== null}
          isDeleting={isDeleting}
          onClose={() => setTaskToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      </main>
    </div>
  );
}

export default App;
