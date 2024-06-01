import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../add-task/task.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent implements OnInit {
@Input() task!: Task;

ngOnInit(): void {
}

}
