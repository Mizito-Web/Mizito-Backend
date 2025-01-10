import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, now } from 'mongoose';

@Schema()
export class MemberShip {
  _id: string;

  @ApiProperty({
    example: '5129048051729380124',
    description: 'The id of the user',
  })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({
    example: '5129048051729380124',
    description: 'The id of the team',
  })
  @Prop({ required: true })
  teamId: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export type MemberShipDocument = MemberShip & Document;
export const MemberShipSchema = SchemaFactory.createForClass(MemberShip);
