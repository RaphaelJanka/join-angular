import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { TaskService } from '../add-task/task.service';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { Task } from '../add-task/task.model';

interface BoardColumns {
  name: string;
  id: string;
  tasks: Task[];
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'], // corrected styleUrls
})
export class BoardComponent implements OnInit, OnDestroy {
  boardColumns: BoardColumns[] = [
    { name: 'To Do', id: 'toDo', tasks: [] },
    { name: 'In Progress', id: 'progress', tasks: [] },
    { name: 'Await Feedback', id: 'feedback', tasks: [] },
    { name: 'Done', id: 'done', tasks: [] },
  ];
  tasks: Task[] = [];
  draggedTask: Task | undefined | null;
  taskSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authenticatedUser.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.taskService.authUser = user;
        this.taskSubscription = this.taskService
          .fetchAllTasks(user)
          ?.subscribe((tasks) => {
            if (tasks) {
              const taskArray = Object.values(tasks);
              taskArray.forEach((task) => {
                const column = this.boardColumns.find(
                  (column) => column.id === task.columnId
                );
                if (column) {
                  column.tasks.push(task);
                }
              });
            }
          });
      }
    });
    console.log('boardColumns', this.boardColumns);
  }

  dragStart(task: Task) {
    this.draggedTask = task;
  }

  drop(columnId: string) {
    if (this.draggedTask) {
      this.boardColumns.forEach((column) => {
        column.tasks = column.tasks.filter((task) => task !== this.draggedTask);
      });
      const column = this.boardColumns.find((column) => column.id === columnId);
      if (column) {
        this.draggedTask.columnId = column.id;
        column.tasks.push(this.draggedTask);
        console.log(this.draggedTask);
        this.taskService.updateTask(this.draggedTask, this.draggedTask.id, this.taskService.authUser.token);
      }
    }
  }

  dragEnd() {
    this.draggedTask = null;
  }

  ngOnDestroy(): void {
    this.taskSubscription?.unsubscribe();
  }
}
