import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Date, Document, Double, Int32, ObjectId, Types, now } from 'mongoose';

@Schema()
export class Report {
  _id: string;

  @ApiProperty({
    example: 'This report is about ...',
    description: 'The description of the report',
  })
  @Prop({ required: false })
  description: string;

  @ApiProperty({
    example: '5129048051729380124',
    description: 'The task that this report belongs to.',
  })
  @Prop({ required: true })
  taskId: string;

  @Prop({ default: now, type: Date })
  createdAt: Date;

  @Prop({ default: now, type: Date })
  updatedAt: Date;
}

export type ReportDocument = Report & Document;
export const ReportSchema = SchemaFactory.createForClass(Report);
