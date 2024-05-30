import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { User } from '../login/user.model';
import { Task } from './task.model';
import { TaskService } from './task.service';
import { Subscription, take } from 'rxjs';

export interface Category {
  name: string;
}

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnInit, OnDestroy {
  taskCreationForm!: FormGroup;
  isMultiSelectExpanded: boolean = false;
  isDropdownExpanded: boolean = false;
  users: User[] = [];
  selectedUsers: User[] = [];
  priorityOptions: any[] | undefined = [
    { priority: 'Urgent', value: 'urgent' },
    { priority: 'Medium', value: 'medium' },
    { priority: 'Low', value: 'low' },
  ];
  categories: Category[] | undefined = [
    { name: 'Technical Task' },
    { name: 'User Story' },
  ];
  selectedSubtasks: string[] = [];
  minDate!: Date;
  userSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.minDate = new Date();
    this.fetchUsers();
    this.taskCreationForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      selectedUsers: new FormControl<User[] | null>(null, [
        Validators.required,
      ]),
      date: new FormControl(null, [Validators.required]),
      priority: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      subtasks: new FormControl<string[] | null>(null),
    });
    console.log('date', new Date());
  }

  fetchUsers() {
    const users = this.authService.getUsers();
    if (users.length > 0) {
      this.users = users;
    } else {
      this.authService.authenticatedUser.pipe(take(1)).subscribe((user) => {
        if (user) {
          this.userSub = this.authService.loadUsers(user.token)?.subscribe(() => {
            this.users = this.authService.users;
          });
        }
      });
    }
  }

  toggleIcons(name: string) {
    if (name === 'category') {
      this.isDropdownExpanded = !this.isDropdownExpanded;
    }
    if (name === 'contacts') {
      this.isMultiSelectExpanded = !this.isMultiSelectExpanded;
    }
  }

  onSubmit() {
    const newTask = new Task(
      this.taskCreationForm.value.title,
      this.taskCreationForm.value.description,
      this.taskCreationForm.value.selectedUsers,
      this.taskCreationForm.value.date,
      this.taskCreationForm.value.priority,
      this.taskCreationForm.value.category,
      this.taskCreationForm.value.subtasks,
      new Date(),
      'toDo',
      ''
    );
    this.taskService.addTask(newTask);
    this.taskCreationForm.reset();
  }

  onClear() {
    this.taskCreationForm.reset();
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
