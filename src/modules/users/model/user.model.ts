import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, now } from 'mongoose';

@Schema()
export class User {
  _id: string;

  @ApiProperty({
    example: 'k3rn3lpanic',
    description: 'The username of the user',
  })
  @Prop({ required: true, unique: true })
  userName: string;

  @ApiProperty({ example: 'Bob', description: 'it is a first name' })
  @Prop({ required: false })
  firstName: string;

  @ApiProperty({ example: 'Wang', description: 'it is a last name' })
  @Prop({ required: false })
  lastName: string;

  @ApiProperty({ example: 'example@email.com', description: 'it is an email' })
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, select: false })
  password: string;

  @ApiProperty({ example: '1234542453', description: 'it is a phone number' })
  @Prop({ required: false })
  phone: string;

  @Prop({ required: false, select: false })
  refreshToken: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'The image url of the user avatar',
  })
  @Prop({ required: false })
  avatar: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
