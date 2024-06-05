import { User } from "../login/user.model";
import { Category } from "../shared/task-form/task-form.component";


export class Task {
  constructor(
    public title: string,
    public description: string,
    public selectedUsers: User[] | null,
    public date: Date,
    public priority: string,
    public category: Category,
    public subtasks: { title: string, checked: boolean }[] | null,
    public columnId: string,
    public id: string,
  ) {}
}
