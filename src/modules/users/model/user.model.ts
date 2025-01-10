import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, ObjectId, Types, now } from 'mongoose';
import { USER } from 'src/modules/auth/constants/user.constants';

@Schema()
export class User {
  _id: string;

  @ApiProperty({ example: 'Bob', description: 'it is a first name' })
  @Prop({ required: false })
  firstName: string;

  @ApiProperty({ example: 'Wang', description: 'it is a last name' })
  @Prop({ required: false })
  lastName: string;

  @ApiProperty({ example: 'example@email.com', description: 'it is an email' })
  @Prop({ required: false })
  email: string;

  @ApiProperty({ description: 'it is a token for recovery user account' })
  @Prop({ required: false })
  accountRecoveryToken: string;

  @ApiProperty({ description: 'it is a session validation key' })
  @Prop({ required: false })
  sessionValidationKey: string;

  @Prop({ type: String, select: false })
  password: string;

  @ApiProperty({
    example: 'IMS_TYPE_COMPLETED',
    description: 'it is a status of user',
  })
  @Prop({ required: true, default: USER.STATUS.NEW, enum: USER.STATUS })
  status: string;

  @ApiProperty({ example: 'ADMIN', description: 'it is a type of user' })
  @Prop({ required: true, default: USER.TYPE.ADMIN, enum: USER.TYPE })
  type: string;

  @ApiProperty({ example: '1234542453', description: 'it is a phone number' })
  @Prop({ required: false })
  phone: string;

  @Prop({ required: false, select: false })
  refreshToken: string;

  @Prop({
    select: false,
    enum: USER.REGISTER_TYPE,
    default: USER.REGISTER_TYPE.NORMAL,
  })
  registerType: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
