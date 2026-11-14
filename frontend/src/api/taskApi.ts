import api from './axios';
import type { Task, TaskCreate, TaskUpdate } from '../types/task';

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
};

export const createTask = async (payload: TaskCreate): Promise<Task> => {
  const response = await api.post<Task>('/tasks', payload);
  return response.data;
};

export const updateTask = async (id: number, payload: TaskUpdate): Promise<Task> => {
  const response = await api.put<Task>(`/tasks/${id}`, payload);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
