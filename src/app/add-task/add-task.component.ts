import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  isMultiSelectExpanded: boolean = false;
  isDropdownExpanded: boolean = false;

  users: User[] = [
    { name: 'Raphael' },
    { name: 'Kristin' }, // Für später: Bei gleichen Namen werden alle ausgewählt. Irgendwie Id einfügen
    { name: 'Andrew' },
  ];
  selectedUsers: any[] = [];

  priorityOptions: any[] | undefined = [
    { priority: 'Urgent', value: 'urgent' },
    { priority: 'Medium', value: 'medium' },
    { priority: 'Low', value: 'low' },
  ];

  categories: Category[] | undefined = [
    { name: 'Technical Task' },
    { name: 'User Story' },
  ];
  selectedSubtasks: string[] = [];
  minDate!: Date;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.url);
    this.minDate = new Date();
    this.taskCreationForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      selectedUsers: new FormControl<User[] | null>(null, [
        Validators.required,
      ]),
      date: new FormControl(null, [Validators.required]),
      priority: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      subtasks: new FormControl(null),
    });
  }

  toggleIcons(name: string) {
    if (name === 'category') {
      this.isDropdownExpanded = !this.isDropdownExpanded;
    }
    if (name === 'contacts') {
      this.isMultiSelectExpanded = !this.isMultiSelectExpanded;
    }
  }

  onSubmit() {
    console.log(this.taskCreationForm.value);
  }

  onClear() {
    this.taskCreationForm.reset();
  }
}
