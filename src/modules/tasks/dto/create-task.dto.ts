import { Date } from 'mongoose';

export class CreateTaskDTO {
  title: string;
  description: string;
  projectId: string;
  memberIds: string[];
  dueDate?: Date;
  priority?: number;
  progress?: number;
}
