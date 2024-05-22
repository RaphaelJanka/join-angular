export class Task {
  constructor(
    public title: string,
    public description: string,
    public selectedUsers: [] | undefined,
    public date: Date,
    public priority: string,
    public category: string,
    public subtasks: string[],
    public id: number
  ) {}
}
