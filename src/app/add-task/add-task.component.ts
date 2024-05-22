import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface User {
  name: string;
}

export interface Category {
  name: string;
}

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnInit {

  taskCreationForm!: FormGroup;
  users: User[] = [
    { name: 'Raphael' },
    { name: 'Kristin' }, // Für später: Bei gleichen Namen werden alle ausgewählt. Irgendwie Id einfügen
    { name: 'Andrew' },
  ];
  selectedUsers: any[] = []

  priorityOptions: any[] | undefined = [
    { priority: 'Urgent', value: 'urgent' },
    { priority: 'Medium', value: 'medium' },
    { priority: 'Low', value: 'low' },
  ];

  categories: Category[] | undefined = [{ name: 'Technical Task' }, { name: 'User Story' }];
  selectedSubtasks: string[] = [];
  
  ngOnInit(): void {
    this.taskCreationForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      selectedUsers: new FormControl<User[] | null>(null, [
        Validators.required,
      ]),
      date: new FormControl(null, [Validators.required]),
      priority: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      subtasks: new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    console.log(this.taskCreationForm.value);
    
  }
}
