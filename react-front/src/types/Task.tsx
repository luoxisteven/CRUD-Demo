export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id?: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
}