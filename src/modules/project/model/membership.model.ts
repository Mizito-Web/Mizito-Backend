import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Date, Document, now } from 'mongoose';

@Schema()
export class MemberShip {
  _id: string;

  @ApiProperty({
    example: '15812904',
    description: 'Id of the member',
  })
  @Prop({ required: true })
  userId: Types.ObjectId;

  @ApiProperty({
    example: '5109234854123',
    description: 'Id of the team',
  })
  @Prop({ required: true })
  projectId: Types.ObjectId;

  @Prop({ default: now, type: Date })
  createdAt: Date;

  @Prop({ default: now, type: Date })
  updatedAt: Date;
}

export type MemberShipDocument = MemberShip & Document;
export const MemberShipSchema = SchemaFactory.createForClass(MemberShip);
