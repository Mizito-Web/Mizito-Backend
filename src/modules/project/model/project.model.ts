import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Date, Document, now } from 'mongoose';

@Schema()
export class Project {
  _id: string;

  @ApiProperty({
    example: '5129048051729380124',
    description: 'The team that this project belongs to.',
  })
  @Prop({ required: true })
  teamId: string;

  @ApiProperty({ example: 'Project1', description: 'The Name of the Project' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'The image url of the project',
  })
  @Prop({ required: false })
  imageUrl: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export type TaskDocument = Project & Document;
export const UserSchema = SchemaFactory.createForClass(Project);
