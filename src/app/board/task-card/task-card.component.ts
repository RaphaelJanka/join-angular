import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../../add-task/task.model';
import { TaskService } from '../../add-task/task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;
 

  constructor() {}

  ngOnInit(): void {
  }

  getCheckedSubtasksCount(): number {
    if (this.task.subtasks) {
      return this.task.subtasks.filter(subtask => subtask.checked).length;
    }
    return 0;
  }
  

  getProgressBarValue(): number {
    if (
      this.task.subtasks &&
      this.task.subtasks.length
    ) {
      return (this.getCheckedSubtasksCount() / this.task.subtasks.length) * 100;
    } else {
      return 0;
    }
  }


}
