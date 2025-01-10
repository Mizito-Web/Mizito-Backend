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

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export type TaskDocument = SubTask & Document;
export const UserSchema = SchemaFactory.createForClass(SubTask);
