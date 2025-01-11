import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Date, Document, now, Types } from 'mongoose';

@Schema()
export class Team {
  _id: string;

  @Transform(({ value }) => value.toString())
  @ApiProperty({
    example: '5801924125',
    description: 'Owner ID of the team',
  })
  @Prop({ required: true })
  ownerId: Types.ObjectId;

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

  @Prop({ default: now, type: Date })
  createdAt: Date;

  @Prop({ default: now, type: Date })
  updatedAt: Date;
}

export type TeamDocument = Team & Document;
export const TeamSchema = SchemaFactory.createForClass(Team);
