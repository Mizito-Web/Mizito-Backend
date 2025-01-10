import { Date } from 'mongoose';

export class TaskObject {
  title: string;
  description: string;
  projectId: string;
  memberIds: string[];
  dueDate?: Date;
  priority?: Number;
  progress?: Number;
  createdAt?: Date;
  updatedAt?: Date;
}
