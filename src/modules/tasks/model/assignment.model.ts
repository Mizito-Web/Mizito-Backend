import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Date, Document, Double, Int32, ObjectId, Types, now } from 'mongoose';

@Schema()
export class Assignment {
  _id: string;

  @ApiProperty({ example: '15812903890124', description: 'The id of the task' })
  @Prop({ required: true })
  taskId: string;

  @ApiProperty({
    example: '58120934123',
    description: 'The id of the user involved',
  })
  @Prop({ required: true })
  userId: string;

  @Prop({ default: now, type: Date })
  createdAt: Date;

  @Prop({ default: now, type: Date })
  updatedAt: Date;
}

export type AssignmentDocument = Assignment & Document;
export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
