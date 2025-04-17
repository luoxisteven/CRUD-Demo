import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../../services/task.service';
import { Task, TaskFormData } from '../../../../../models/task.model';
import { Observable } from 'rxjs';
import { TaskFormComponent } from '../../components/task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  tasks$: Observable<Task[]>;
  error$: Observable<string | null>;
  editingTask: Task | null = null;
  openList: boolean = true; // Toggle state for task list

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$;
    this.error$ = this.taskService.error$;
  }

  onTaskSubmit(data: TaskFormData): void {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask.id!, data).subscribe({
        next: () => (this.editingTask = null)
      });
    } else {
      this.taskService.createTask(data).subscribe();
    }
  }

  startEdit(task: Task): void {
    this.editingTask = task;
  }

  cancelEdit(): void {
    this.editingTask = null;
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe();
  }

  toggleList(): void {
    this.openList = !this.openList;
  }
}