import { Task, TaskFormData } from '../types/Task';
import config from '../config';

type AwsTaskRow = {
  Id: string;
  title?: string;
  description?: string;
  status?: string;
};

// Keep a session-scoped mapping between AWS ObjectId strings and numeric IDs expected by the UI
const awsIdToNum = new Map<string, number>();
const numToAwsId = new Map<number, string>();

function hashStringToNumber(input: string): number {
  // Simple 32-bit hash to generate a stable numeric id from string ObjectId
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  // Ensure positive number
  return Math.abs(hash);
}

function getOrCreateNumericId(awsId: string): number {
  const existing = awsIdToNum.get(awsId);
  if (existing !== undefined) return existing;
  const num = hashStringToNumber(awsId);
  awsIdToNum.set(awsId, num);
  numToAwsId.set(num, awsId);
  return num;
}

function getAwsIdOrThrow(id: number): string {
  const awsId = numToAwsId.get(id);
  if (!awsId) {
    throw new Error('Unknown task id mapping for AWS Lambda backend');
  }
  return awsId;
}

async function postWithFallback(body: Record<string, any>): Promise<Response> {
  let lastError: any = null;
  for (const base of config.apiUrls) {
    try {
      const res = await fetch(`${base}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) return res;
      lastError = new Error(`HTTP ${res.status} ${res.statusText}`);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError ?? new Error('All Lambda endpoints failed');
}

function fromAws(row: AwsTaskRow): Task {
  const idNum = getOrCreateNumericId(row.Id);
  return {
    id: idNum,
    title: row.title ?? '',
    description: row.description ?? '',
    status: (row.status as Task['status']) ?? 'To Do',
  };
}

export const taskApi = {
  // List all tasks
  async getAll(): Promise<Task[]> {
    const res = await postWithFallback({ action: 'list' });
    const data: AwsTaskRow[] = await res.json();
    return data.map(fromAws);
  },

  // Get a task by numeric id (mapped to AWS Id)
  async getById(id: number): Promise<Task> {
    const awsId = getAwsIdOrThrow(id);
    const res = await postWithFallback({ action: 'get', id: awsId });
    if (!res.ok) {
      throw new Error(`Failed to fetch task with ID ${id}: ${res.statusText}`);
    }
    const row: AwsTaskRow = await res.json();
    // Ensure mapping is refreshed
    getOrCreateNumericId(row.Id);
    return fromAws(row);
  },

  // Create a new task
  async create(task: TaskFormData): Promise<Task> {
    const res = await postWithFallback({
      action: 'create',
      title: task.title,
      description: task.description,
      status: task.status,
    });
    if (!res.ok) {
      throw new Error(`Failed to create task: ${res.statusText}`);
    }
    const row: AwsTaskRow = await res.json();
    return fromAws(row);
  },

  // Update a task
  async update(id: number, task: Partial<TaskFormData>): Promise<Task> {
    const awsId = getAwsIdOrThrow(id);
    const payload: Record<string, any> = { action: 'update', id: awsId };
    if (task.title !== undefined) payload.title = task.title;
    if (task.description !== undefined) payload.description = task.description;
    if (task.status !== undefined) payload.status = task.status;

    const res = await postWithFallback(payload);
    if (!res.ok) {
      throw new Error(`Failed to update task with ID ${id}: ${res.statusText}`);
    }
    const row: AwsTaskRow = await res.json();
    // Keep mapping fresh
    getOrCreateNumericId(row.Id);
    return fromAws(row);
  },

  // Delete a task
  async delete(id: number): Promise<void> {
    const awsId = getAwsIdOrThrow(id);
    const res = await postWithFallback({ action: 'delete', id: awsId });
    if (!res.ok) {
      throw new Error(`Failed to delete task with ID ${id}: ${res.statusText}`);
    }
    // Remove mapping after successful deletion
    const existingAwsId = numToAwsId.get(id);
    if (existingAwsId) {
      numToAwsId.delete(id);
      awsIdToNum.delete(existingAwsId);
    }
  },
};


