import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDTO } from './dto/create-project.dto';
import { Project, ProjectDocument } from './model/project.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { MemberShip, MemberShipDocument } from './model/membership.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(MemberShip.name)
    private readonly memberShipModel: Model<MemberShipDocument>,
    private usersService: UsersService
  ) {}
  async getProjects(): Promise<
    { _id: string; name: string; imageUrl: string; teamId: string }[]
  > {
    const projects = await this.projectModel.find().lean();
    return projects;
  }

  async checkUserInTeam(userId: string, teamId: string) {
    return await this.usersService.isUserPartOfTeam(userId, teamId);
  }

  async getProjectsByTeamId(teamId: string) {
    const projects = await this.projectModel.find({ teamId }).lean();
    return projects;
  }

  async getProject(projectId: string) {
    return await this.projectModel.findById(projectId).lean();
  }

  async createProject(
    userId: string,
    data: CreateProjectDTO
  ): Promise<{ _id: string; name: string; imageUrl: string; teamId: string }> {
    const { name, teamId, imageUrl } = data;
    const project = {
      name,
      teamId,
      imageUrl: imageUrl ? imageUrl : null,
      ownerId: userId,
    };
    const teamProjects = await this.getProjectsByTeamId(teamId);
    if (teamProjects.some((project) => project.name === name)) {
      throw new ConflictException('Project already exists');
    }

    const newProject = await this.projectModel.create(project);
    newProject.save();

    return { ...newProject };
  }

  async removeProject(userId: string, projectId: string) {
    const project = await this.getProject(projectId);
    if (!project) {
      throw new ConflictException('Project not found');
    }
    if (project.ownerId !== userId) {
      throw new UnauthorizedException('You are not the owner of this project');
    }

    // remove users of this project
    const members = await this.memberShipModel.find({ projectId });
    for (const member of members) {
      await this.memberShipModel.deleteOne({ projectId, userId: member._id });
    }
    await this.projectModel.deleteOne({ _id: projectId });
    return true;
  }

  async updateProject(userId: string, projectId: string, query: object) {
    const project = await this.getProject(projectId);
    if (!project) {
      throw new ConflictException('Project not found');
    }
    if (userId !== project.ownerId) {
      throw new UnauthorizedException('You are not the owner of this project');
    }
    if (!projectId) throw new ConflictException('Project not found');
    if (!query) throw new ConflictException('Query not found');
    await this.projectModel.updateOne({ _id: projectId }, { $set: query });
  }

  async addUserToProject(
    userId: string,
    addingUserId: string,
    projectId: string
  ) {
    const project = await this.getProject(projectId);
    const teamId = project.teamId;
    // check if the userId is the owner of the project
    if (project.ownerId !== userId) {
      throw new UnauthorizedException(
        'You are not the owner of this project. only the owner can add/remove members of project'
      );
    }
    // check if the user belongs to the team of project
    if (!(await this.checkUserInTeam(addingUserId, teamId))) {
      throw new ConflictException('User is not a member of this team.');
    }
    // add a new member to the project
    const memberShip = {
      userId: addingUserId,
      projectId: projectId,
    };
    const isAlreadyMember = await this.memberShipModel.findOne(memberShip);
    if (isAlreadyMember) {
      throw new ConflictException('User is already a member of this project.');
    }
    const newMemberShip = await this.memberShipModel.create(memberShip);
    newMemberShip.save();
    return newMemberShip;
  }

  async isUserInProject(userId: string, projectId: string) {
    const project = await this.getProject(projectId);
    if (!project) {
      throw new ConflictException('Project not found');
    }
    const projectMembers = await this.memberShipModel.find({
      projectId,
      userId,
    });
    return projectMembers.length > 0;
  }

  async removeUserFromProject(
    userId: string,
    removingUserId: string,
    projectId: string
  ) {
    // first check if the user is in the project
    const project = await this.getProject(projectId);
    if (!project) {
      throw new ConflictException('Project not found');
    }
    const teamId = project.teamId;
    // check if the userId is the owner of the project
    if (project.ownerId !== userId) {
      throw new UnauthorizedException(
        'You are not the owner of this project. only the owner can add/remove members of project'
      );
    }
    // check if the user belongs to the project
    if (!(await this.isUserInProject(removingUserId, projectId))) {
      throw new ConflictException('User is not a member of this project.');
    }
    // remove the user from the project
    await this.memberShipModel.deleteOne({
      userId: removingUserId,
      projectId: projectId,
    });
    // TODO: do we have to remove user activity? I guess not
  }
}
