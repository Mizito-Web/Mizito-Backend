import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Date, Document, now } from 'mongoose';

@Schema()
export class SubTask {
  _id: string;

  @ApiProperty({
    example: '5129048051729380124',
    description: 'The task that this subtask belongs to.',
  })
  @Prop({ required: true })
  taskId: string;

  @ApiProperty({ example: 'SubTask1', description: 'The title of the task' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    example: 'true',
    description: 'If the subtask is completed or not.',
  })
  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: now, type: Date })
  createdAt: Date;

  @Prop({ default: now, type: Date })
  updatedAt: Date;
}

export type SubTaskDocument = SubTask & Document;
export const SubTaskSchema = SchemaFactory.createForClass(SubTask);
