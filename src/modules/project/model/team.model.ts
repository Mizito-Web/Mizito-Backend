import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Date, Document, now } from 'mongoose';

@Schema()
export class Team {
  _id: string;

  @ApiProperty({
    example: 'K3rn3lpanic team',
    description: 'Name of the team',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'The image url of the team',
  })
  @Prop({ required: false })
  imageUrl: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export type TaskDocument = Team & Document;
export const TeamSchema = SchemaFactory.createForClass(Team);
