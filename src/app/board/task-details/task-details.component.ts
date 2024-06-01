import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Task } from '../../add-task/task.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TaskService } from '../../add-task/task.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
  task!: Task | null;
  private taskSubscription!: Subscription;
  checkedSubtasks: string[] = [];
  isEdited: boolean = false;
  editModeSubscription!: Subscription;

  constructor(
    public taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskSubscription = this.taskService.selectedTask.subscribe(
      (task: Task | null) => {
        if (task) {
          this.task = task;
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
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.router.navigate(['/board', taskId, 'edit']);
    }
  }

  
  ngOnDestroy(): void {
    this.taskSubscription?.unsubscribe();
    this.editModeSubscription?.unsubscribe();
  }
}
