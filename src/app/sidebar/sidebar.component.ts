import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
 
  items: MenuItem[] = [
    {
      items: [
        {
          label: 'Summary',
          route: '/summary',
        },
        {
          label: 'Add Task',
          route: '/addTask',
        },
        {
          label: 'Board',
          route: '/board',
        },
        {
          label: 'Contacts',
          route: '/contacts',
        },
      ],
    },
  ];
  constructor() {}
}
