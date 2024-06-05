import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../login/auth.service';
import { TaskService } from '../../add-task/task.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../login/user.model';
import { Task } from '../../add-task/task.model';
import { Subscription, take } from 'rxjs';
import { Router } from '@angular/router';

export interface Category {
  name: string;
  color: string;
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit, OnDestroy {
  taskForm!: FormGroup;
  isMultiSelectExpanded: boolean = false;
  isDropdownExpanded: boolean = false;
  isPriorityClicked: boolean = false;
  users: User[] = [];
  selectedUsers: User[] | null = [];
  priorityOptions: any[] | undefined = [
    { priority: 'Urgent', value: 'Urgent', icon: 'pi pi-angle-double-up' },
    { priority: 'Medium', value: 'Medium', icon: 'pi pi-equals' },
    { priority: 'Low', value: 'Low', icon: 'pi pi-angle-double-down' },
  ];
  categories: Category[] | undefined = [
    { name: 'Technical Task', color: '#66E4A1' },
    { name: 'User Story', color: '#1234A8' },
  ];
  selectedSubtasks: { title: string; checked: boolean }[] = [];
  minDate!: Date;
  userSub!: Subscription;
  selectedTaskSub!: Subscription;
  editedTaskSub!: Subscription;
  editedTask!: Task;
  editMode: boolean = false;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.minDate = new Date();
    this.authService.authenticatedUser.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.taskService.authUser = user;
        this.initUserSub(user.token);
        this.initEditedTaskSub();
      }
    });
  }

  initUserSub(token: string | null) {
    this.userSub = this.authService.loadUsers(token)?.subscribe(() => {
      this.users = this.authService.users;
    });
  }

  initEditedTaskSub() {
    this.selectedTaskSub = this.taskService.selectedTask.subscribe((task) => {
      if (task) {
        this.editMode = true;
        this.selectedUsers = task.selectedUsers;
        this.editedTask = task;
        this.minDate = new Date(this.editedTask.date);
        this.initEditForm();
      } else {
        this.initForm();
        this.editMode = false;
      }
    });
  }

  initForm() {
    this.taskForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      selectedUsers: new FormControl<User[] | null>(null, [
        Validators.required,
      ]),
      date: new FormControl(null, [Validators.required]),
      priority: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      subtasks: new FormControl(null),
    });
  }

  initEditForm() {
    this.taskForm = new FormGroup({
      title: new FormControl(this.editedTask.title, [Validators.required]),
      description: new FormControl(this.editedTask.description, [
        Validators.required,
      ]),
      selectedUsers: new FormControl<User[] | null>(
        this.editedTask.selectedUsers,
        [Validators.required]
      ),
      date: new FormControl(new Date(this.editedTask.date), [
        Validators.required,
      ]),
      priority: new FormControl(this.editedTask.priority, [
        Validators.required,
      ]),
      category: new FormControl(this.editedTask.category, [
        Validators.required,
      ]),
      subtasks: new FormControl<{ title: string; checked: boolean }[] | null>(
        this.editedTask.subtasks
      ),
    });
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
    if (!this.editMode) {
      this.createNewtask();
    } else {
      this.updateEditedTask();
    }
    this.taskForm.reset();
  }

  createNewtask() {
    const subtasks: { title: string; checked: boolean }[] = [];
    this.taskForm.value.subtasks.forEach((subtask: string) => {
      subtasks.push({
        title: subtask,
        checked: false,
      });
    });
    const newTask = new Task(
      this.taskForm.value.title,
      this.taskForm.value.description,
      this.taskForm.value.selectedUsers,
      this.taskForm.value.date,
      this.taskForm.value.priority,
      this.taskForm.value.category,
      subtasks,
      'toDo',
      ''
    );
    this.taskService.addTask(newTask);
  }

  updateEditedTask() {
    const editedTask = new Task(
      this.taskForm.value.title,
      this.taskForm.value.description,
      this.taskForm.value.selectedUsers,
      this.taskForm.value.date,
      this.taskForm.value.priority,
      this.taskForm.value.category,
      this.taskForm.value.subtasks,
      this.editedTask.columnId,
      this.editedTask.id
    );
    this.editedTaskSub = this.taskService.updateTask(editedTask).subscribe({
      next: () => {
        this.taskService.isUpdated.next(true);
      },
    });
  }

  onClear() {
    this.taskForm.reset();
  }

  onCancel() {
    this.router.navigate(['/board', this.editedTask.id]);
    this.editMode = false;
    this.taskService.setIsEdited(false);
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.selectedTaskSub?.unsubscribe();
    this.editedTaskSub?.unsubscribe()
  }
}
