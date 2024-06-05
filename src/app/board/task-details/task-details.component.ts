import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Task } from '../../add-task/task.model';
import { Subscription } from 'rxjs';
import { TaskService } from '../../add-task/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
  task!: Task | null;
  taskSubscription!: Subscription;
  checkedSubtasks: { title: string; checked: boolean }[] | null = [];
  isEdited: boolean = false;
  editModeSubscription!: Subscription;
  updatedSubtaskSubscription!: Subscription;

  constructor(public taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.taskSubscription = this.taskService.selectedTask.subscribe(
      (task: Task | null) => {
        if (task) {
          this.task = task;
          this.checkedSubtasks = task.subtasks;
          console.log(this.checkedSubtasks);
        } else {
          this.router.navigate(['/board']);
        }
      }
    );
    this.editModeSubscription = this.taskService.isEdited$.subscribe(
      (isEdited) => {
        this.isEdited = isEdited;
      }
    );
  }

  onEdit() {
    this.taskService.setIsEdited(true);
    if (this.task) {
      this.router.navigate(['/board', this.task.id, 'edit']);
    }
  }

  updateSubtask(subtask: { title: string; checked: boolean }): void {
    if (this.task?.subtasks) {
      this.checkedSubtasks = this.task.subtasks.map((st) => {
        if (st.title === subtask.title) {
          return { ...st, checked: subtask.checked };
        } else {
          return st;
        }
      });
      this.task.subtasks = this.checkedSubtasks;

      this.updatedSubtaskSubscription = this.taskService
        .updateTask(this.task)
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.taskSubscription?.unsubscribe();
    this.editModeSubscription?.unsubscribe();
    this.updatedSubtaskSubscription?.unsubscribe();
  }
}
