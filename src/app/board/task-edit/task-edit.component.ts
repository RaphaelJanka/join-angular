import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../../add-task/task.service';
import { Subscription } from 'rxjs';
import { Task } from '../../add-task/task.model';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../login/user.model';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent implements OnInit, OnDestroy {
  taskSubscription!: Subscription;
  task!: Task;
  editTaskForm: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    selectedUsers: new FormControl<User[] | null>(null, [Validators.required]),
    date: new FormControl(null, [Validators.required]),
    priority: new FormControl(null, [Validators.required]),
    category: new FormControl(null, [Validators.required]),
    subtasks: new FormControl<string[] | null>(null),
  });
  

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.taskSubscription = this.taskService.selectedTask.subscribe(
      (task: Task | null) => {
        if (task) {
          this.task = task;
          this.setForm();
        } else {
          this.router.navigate(['/board']);
        }
      }
    );
  }

  
  setForm() {
    this.editTaskForm = new FormGroup({
      title: new FormControl(this.task.title, [Validators.required]),
      description: new FormControl(this.task.description, [
        Validators.required,
      ]),
      selectedUsers: new FormControl<User[] | null>(this.task.selectedUsers, [
        Validators.required,
      ]),
      date: new FormControl(this.task.date, [Validators.required]),
      priority: new FormControl(this.task.priority, [Validators.required]),
      category: new FormControl(this.task.category, [Validators.required]),
      subtasks: new FormControl<{title: string, checked: boolean}[] | null>(this.task.subtasks),
    });
  }


  ngOnDestroy(): void {
    this.taskSubscription?.unsubscribe();
  }
}
