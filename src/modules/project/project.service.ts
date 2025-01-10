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

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
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

  async addUserToProject(){}
}
