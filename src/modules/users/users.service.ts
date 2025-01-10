import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/user.model';
import { UserLoginData } from '../auth/interfaces/user-login-data.interface';
import { CreateUser } from './interfaces/create-user.interface';
import { NewUser } from './interfaces/new-user.interface';

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
      'refreshToken _id email'
    );
    return user;
  }

  async getUserUsedValidateUser(query: object): Promise<UserLoginData> {
    return await this.userModel
      .findOne(query, 'email password status firstName lastName')
      .lean();
  }

  async getUser(query: object) {
    return await this.userModel.findOne(query);
  }

  async createUser(query: Partial<CreateUser>): Promise<NewUser> {
    let existUser;

    if (query.email) {
      existUser = await this.getUser({
        email: query.email,
      });
    }

    if (existUser) {
      throw new ConflictException('The user already exist');
    }

    const user = await this.userModel.create(query);
    const { email, status, _id }: NewUser = user;

    return { email, status, _id };
  }
}
