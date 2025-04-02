import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskFormData } from '../models/task.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) { }

  // Get all tasks
  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Get a task by ID
  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // Create a new task
  create(task: TaskFormData): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // Update a task
  update(id: number, task: Partial<TaskFormData>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  // Delete a task
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}