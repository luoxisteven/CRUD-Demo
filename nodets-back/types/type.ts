// types/type.ts
export interface DBConfig {
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
  host: string | undefined;
  dialect: string | undefined;
}

export interface TaskData {
  id: number;
  title: string;
  description: string | null;
  status: 'To Do' | 'In Progress' | 'Done';
}

export interface TaskWithMethods extends TaskData {
  update: (updateData: Partial<TaskData>) => Promise<TaskWithMethods>;
  destroy: () => Promise<boolean>;
}