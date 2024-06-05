import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { TaskService } from '../add-task/task.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { Task } from '../add-task/task.model';
import { Category } from '../shared/task-form/task-form.component';

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
  updatedTaskSubscription: Subscription | undefined;
  visible: boolean = false;
  isDialogAddTaskVisible: boolean = false;
  selectedTask = new BehaviorSubject<Task | null>(null);
  selectedTaskCategory!: Category;
  dropChangeSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {}

  
  ngOnInit() {
    this.authService.authenticatedUser.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.taskService.authUser = user;
        this.loadAllTasks();
      }
    });
    this.updatedTaskSubscription = this.taskService.isUpdated.subscribe(
      (updated) => {
        if (updated) {
          this.loadAllTasks();
          this.visible = false;
          this.taskService.isUpdated.next(false);
          this.isDialogAddTaskVisible = false;
        }
      }
    );
  }


  loadAllTasks() {
    this.taskSubscription = this.taskService
      .fetchAllTasks()
      ?.subscribe((tasks) => {
        if (tasks) {
          this.resetColumns();
          this.loadColumns(tasks);
        }
      });
  }


  resetColumns() {
    this.boardColumns.forEach((column) => {
      column.tasks = [];
    });
  }


  loadColumns(tasks: Task[]) {
    const taskArray = Object.values(tasks);
    taskArray.forEach((task) => {
      const column = this.boardColumns.find(
        (column) => column.id === task.columnId
      );
      if (column) {
        column.tasks.push(task);
      }
    });
    this.boardColumns.forEach((column) => {
      this.sortColumns(column);
    });
  }

  sortColumns(column: BoardColumns) {
    column.tasks.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
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
        this.sortColumns(column);
        this.dropChangeSubscription = this.taskService.updateTask(this.draggedTask).subscribe();
      }
    }
  }

  dragEnd() {
    this.draggedTask = null;
  }

  showDialogAddTask() {
    this.isDialogAddTaskVisible = true;
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

  closeDialog(dialog: string) {
    if (dialog === 'detail') {
      this.taskService.setIsEdited(false);
      this.taskService.selectedTask.next(null);
      this.router.navigate(['/board']);
    }
    if (dialog === 'addTask') {
      this.isDialogAddTaskVisible = false;
    }
  }

  ngOnDestroy(): void {
    this.taskSubscription?.unsubscribe();
    this.updatedTaskSubscription?.unsubscribe();
    this.dropChangeSubscription?.unsubscribe();
  }
}
