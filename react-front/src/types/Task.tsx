export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: number;
  _id?: number | undefined;
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

export function normalizeTask(task: any): Task {
  if (task.id === undefined && task._id !== undefined) {
    return {
      ...task,
      id: task._id
    };
  }
  return task as Task;
}