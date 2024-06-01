import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { TaskService } from '../add-task/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription, take } from 'rxjs';
import { Task } from '../add-task/task.model';
import { Category } from '../add-task/add-task.component';

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
  visible: boolean = false;
  selectedTask = new BehaviorSubject<Task | null>(null);
  selectedTaskCategory!: Category;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private route: ActivatedRoute,
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
        this.taskService.updateTask(
          this.draggedTask,
          this.draggedTask.id,
          this.taskService.authUser.token
        );
      }
    }
  }

  dragEnd() {
    this.draggedTask = null;
  }

  showDialog(task: Task) {
    this.selectedTaskCategory = {
      name: task.category.name,
      color: task.category.color,
    };
    this.taskService.selectedTask.next(task);
    this.router.navigate(['/board', task.id]);
    this.visible = true;
  }

  ngOnDestroy(): void {
    this.taskSubscription?.unsubscribe();
  }

  closeDialog() {
    this.taskService.setIsEdited(false);
    this.removeIdFromRoute();
  }

  private removeIdFromRoute() {
    const urlWithoutId = this.router.url.split('/')[1];
    history.replaceState({}, '', `/${urlWithoutId}`);
  }
}
