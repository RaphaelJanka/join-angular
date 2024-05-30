import { Injectable } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../login/user.model';
import { Task } from './task.model';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  authUser!: User;
  errorMessage!: string;
  taskUrl =
    'https://join-17ed6-default-rtdb.europe-west1.firebasedatabase.app/tasks';

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
          this.router.navigate(['/board']);
        });
    });
  }
  

  updateTask(task: Task, taskId: string, authToken: string | null) {
    const url = `${this.taskUrl}/${taskId}.json?auth=${authToken}`;
    this.http.put(url, task).subscribe({
      next: () => {
        console.log('Task updated successfully');
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
}
