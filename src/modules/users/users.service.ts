import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './model/user.model';
import { UserLoginData } from '../auth/interfaces/user-login-data.interface';
import { CreateUser } from './interfaces/create-user.interface';
import { NewUser } from './interfaces/new-user.interface';
import { Team, TeamDocument } from '../project/model/team.model';
import {
  TeamMemberShip,
  TeamMemberShipDocument,
} from './model/membership.model';
import { CreateTeamDTO } from '../project/dto/create-team.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { ObjectId } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,
    @InjectModel(TeamMemberShip.name)
    private readonly teamMembershipModel: Model<TeamMemberShipDocument>
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
      .findOne(query, 'email password firstName lastName')
      .lean();
  }

  async getUser(query: object) {
    const user = await this.userModel.findOne(query).lean();
    return user;
  }

  async createUser(query: Partial<RegisterDto>): Promise<NewUser> {
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
    const { email, _id }: NewUser = user;

    return { email, _id };
  }

  async isUserPartOfTeam(userId: string, teamId: string): Promise<boolean> {
    const membership = await this.teamMembershipModel.findOne({
      userId: new Types.ObjectId(userId),
      teamId: new Types.ObjectId(teamId),
    });
    return !!membership;
  }

  async updateUser(userId: string, query: object) {
    await this.userModel.updateOne({ _id: userId }, { $set: query });
  }

  async createTeam(userId: string, data: CreateTeamDTO) {
    const teamData = {
      ownerId: new Types.ObjectId(userId),
      ...data,
    };
    const newTeam = await this.teamModel.create(teamData);
    newTeam.save();
    return newTeam;
  }

  async removeTeam(userId: string, teamId: string) {
    const team = await this.teamModel.findById(teamId).lean();
    if (!team) throw new NotFoundException('Team not found');
    if (team.ownerId.toString() !== userId) {
      throw new UnauthorizedException('You are not the owner of this team');
    }
    await this.teamModel.deleteOne({ _id: teamId });
  }

  async addUserToTeam(userId: string, addingUserId: string, teamId: string) {
    const team = await this.teamModel.findById(teamId).lean();
    if (!team) throw new NotFoundException('Team not found');
    if (team.ownerId.toString() !== userId) {
      throw new UnauthorizedException('You are not the owner of this team');
    }
    const memberShip = {
      userId: new Types.ObjectId(addingUserId),
      teamId: new Types.ObjectId(teamId),
    };
    const isAlreadyMember = await this.teamMembershipModel
      .findOne(memberShip)
      .lean();
    if (isAlreadyMember) {
      throw new ConflictException('User is already a member of this team.');
    }
    const newMemberShip = await this.teamMembershipModel.create(memberShip);
    newMemberShip.save();
    return newMemberShip;
  }

  async removeUserFromTeam(
    userId: string,
    removingUserId: string,
    teamId: string
  ) {
    const team = await this.teamModel.findById(teamId).lean();
    if (!team) throw new NotFoundException('Team not found');
    if (team.ownerId.toString() !== userId) {
      throw new UnauthorizedException('You are not the owner of this team');
    }
    const memberShip = {
      userId: removingUserId,
      teamId: teamId,
    };
    const isAlreadyMember = await this.teamMembershipModel
      .findOne(memberShip)
      .lean();
    if (!isAlreadyMember) {
      throw new ConflictException('User is not a member of this team.');
    }
    await this.teamMembershipModel.deleteOne(memberShip);
    return true;
  }
}
