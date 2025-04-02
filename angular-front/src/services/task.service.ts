import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { Task, TaskFormData } from '../models/task.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private errorSubject = new BehaviorSubject<string | null>(null);

  tasks$ = this.tasksSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchTasks();
  }

  // Fetch all tasks
  fetchTasks(): void {
    this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => {
        this.tasksSubject.next(tasks);
        this.errorSubject.next(null);
      }),
      catchError(error => {
        this.errorSubject.next('Failed to fetch tasks');
        console.error(error);
        throw error;
      })
    ).subscribe();
  }

  // Create a new task
  createTask(taskData: TaskFormData): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData).pipe(
      tap(newTask => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next([...currentTasks, newTask]);
        this.errorSubject.next(null);
      }),
      catchError(error => {
        this.errorSubject.next('Failed to create task');
        throw error;
      })
    );
  }

  // Update a task
  updateTask(id: number, taskData: Partial<TaskFormData>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, taskData).pipe(
      tap(updatedTask => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next(
          currentTasks.map(task => task.id === id ? updatedTask : task)
        );
        this.errorSubject.next(null);
      }),
      catchError(error => {
        this.errorSubject.next('Failed to update task');
        throw error;
      })
    );
  }

  // Delete a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next(
          currentTasks.filter(task => task.id !== id)
        );
        this.errorSubject.next(null);
      }),
      catchError(error => {
        this.errorSubject.next('Failed to delete task');
        throw error;
      })
    );
  }
}