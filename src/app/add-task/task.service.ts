import { Injectable } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../login/user.model';
import { Task } from './task.model';
import { BehaviorSubject, Subject, take } from 'rxjs';
import { Router } from '@angular/router';
import { EventEmitter } from 'node:stream';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  authUser!: User;
  errorMessage!: string;
  taskUrl =
    'https://join-17ed6-default-rtdb.europe-west1.firebasedatabase.app/tasks';
  private isEditedSubject = new Subject<boolean>();
  isEdited$ = this.isEditedSubject.asObservable();
  selectedTask = new BehaviorSubject<Task | null>(null);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  addTask(task: Task) {
    this.authService.authenticatedUser.pipe(take(1)).subscribe((user) => {
      if (!user) {
        return;
      }
      this.http
        .post<{ name: string }>(this.taskUrl + '.json?auth=' + user.token, task)
        .subscribe((responseData) => {
          const taskId = responseData.name;
          task.id = taskId;
          this.updateTask(task, taskId, user.token);
        });
    });
  }

  updateTask(task: Task, taskId: string, authToken: string | null) {
    const url = `${this.taskUrl}/${taskId}.json?auth=${authToken}`;
    this.http.put(url, task).subscribe({
      next: () => {
        console.log('Task updated successfully');
        this.router.navigate(['/board']);
      },
      error: (error) => {
        console.error('Error updating task:', error);
      },
    });
  }

  fetchAllTasks(user: User | null) {
    if (!user) {
      return;
    }
    return this.http.get<Task[]>(this.taskUrl + '.json?auth=' + user.token);
  }


  setIsEdited(value: boolean) {
    this.isEditedSubject.next(value);
  }
}
