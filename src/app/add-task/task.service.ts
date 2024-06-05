import { Injectable } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../login/user.model';
import { Task } from './task.model';
import { BehaviorSubject, Subject, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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
  selectedSubtasks = new BehaviorSubject<{title: string, checked: boolean}[]>([]);
  isUpdated = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
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
          this.updateTaskId(task, taskId, user.token);
        });
    });
  }
  

  updateTaskId(task: Task, taskId: string, authToken: string | null) {
    const url = `${this.taskUrl}/${taskId}.json?auth=${authToken}`;
    this.http.put(url, task).subscribe({
      next: () => {
        if (this.router.url === '/board') {
          this.isUpdated.next(true);
        } else {
          this.router.navigate(['/board']);
        }
       
      },
      error: (error) => {
        console.error('Error updating task:', error);
      },
    });
  }


  updateTask(editedTask: Task) {
    const url = `${this.taskUrl}/${editedTask.id}.json?auth=${this.authUser.token}`;
    return this.http.put(url, editedTask);
  }


  fetchAllTasks() {
    if (!this.authUser) {
      return;
    }
    return this.http.get<Task[]>(
      this.taskUrl + '.json?auth=' + this.authUser.token
    );
  }


  setIsEdited(value: boolean) {
    this.isEditedSubject.next(value);
  }

  setSelectedSubtasks(subtasks: {title:string, checked: boolean}[]) {
    this.selectedSubtasks.next(subtasks);
  }
}
