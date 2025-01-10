import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/user.model';
import { UserLoginData } from '../auth/interfaces/user-login-data.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}
  async updateUserRefreshToken(userId: string, refreshToken: string | null) {
    await this.userModel.updateOne({ _id: userId }, { $set: { refreshToken } });
  }
  async getUserAndRefreshToken(userId: string): Promise<Partial<User>> {
    const user = await this.userModel.findById(
      userId,
      'refreshToken _id email status type'
    );
    return user;
  }

  async getUserUsedValidateUser(query: object): Promise<UserLoginData> {
    return await this.userModel
      .findOne(
        query,
        'email password type registerType status firstName lastName'
      )
      .lean();
  }
}
