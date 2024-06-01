import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../add-task/task.service';
import { Subscription } from 'rxjs';
import { Task } from '../../add-task/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss'
})
export class TaskEditComponent implements OnInit {
  taskSubscription!: Subscription;
  task!: Task
  
  constructor(private taskService: TaskService, private router: Router) {}
  
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
    
  }
}
