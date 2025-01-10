import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Date, Document, Double, Int32, ObjectId, Types, now } from 'mongoose';

@Schema()
export class Task {
  _id: string;

  @ApiProperty({ example: 'Task1', description: 'The title of the task' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    example: 'This task is about ...',
    description: 'The description of the task',
  })
  @Prop({ required: false })
  description: string;

  @ApiProperty({
    example: '12.4',
    description: 'The progress percentage of the task',
  })
  @Prop({ required: true, default: 0, type: Number })
  progress: Number;

  @ApiProperty({
    example: 'This task is about ...',
    description: 'The description of the task',
  })
  @Prop({ required: false, type: Date })
  dueDate: Date;

  @ApiProperty({
    example: '100',
    description:
      'Priority of task. The higher the number, the higher the priority',
  })
  @Prop({ required: false, type: Number, default: 0 })
  priority: Number;

  @ApiProperty({
    example: '5129048051729380124',
    description: 'The project that this task belongs to.',
  })
  @Prop({ required: true })
  projectId: string;

  @Prop({ default: now, type: Date })
  createdAt: Date;

  @Prop({ default: now, type: Date })
  updatedAt: Date;
}

export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);
