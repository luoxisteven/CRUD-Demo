import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TaskFormData } from '../../../../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  @Input() editingTask: Task | null = null;
  @Output() submitTask = new EventEmitter<TaskFormData>();
  @Output() cancelEdit = new EventEmitter<void>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['To Do']
    });
  }

  ngOnChanges(): void {
    if (this.editingTask) {
      this.taskForm.patchValue(this.editingTask);
    } else {
      this.taskForm.reset({ status: 'To Do' });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.submitTask.emit(this.taskForm.value);
    }
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
}