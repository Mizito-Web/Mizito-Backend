import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Document, now } from 'mongoose';

@Schema()
export class Invitation {
  _id: string;

  @ApiProperty({
    example: '5129048051729380124',
    description: 'The id of the user',
  })
  @Prop({ required: true })
  userId: Types.ObjectId;

  @ApiProperty({
    example: '5129048051729380124',
    description: 'The id of the team',
  })
  @Prop({ required: true })
  teamId: Types.ObjectId;

  @ApiProperty({
    example: '50192489012851',
    description: 'The id of the user who is inviting',
  })
  @Prop({ required: true })
  invitingId: string;

  @ApiProperty({
    example: false,
    description: 'Wether the invitation has been accepted or not',
    default: false,
    required: true,
  })
  hasAccepted: boolean;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export type InvitationDocument = Invitation & Document;
export const InvitationSchema = SchemaFactory.createForClass(Invitation);
