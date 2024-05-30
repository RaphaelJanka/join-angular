import { User } from "../login/user.model";

export class Task {
  constructor(
    public title: string,
    public description: string,
    public selectedUsers: User[] | null,
    public date: Date,
    public priority: string,
    public category: string,
    public subtasks: string[] | null,
    public creationTime: Date,
    public columnId: string,
    public id: string
  ) {}
}
