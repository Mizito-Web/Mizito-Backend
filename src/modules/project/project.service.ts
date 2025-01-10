import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProjectDTO } from './dto/create-project.dto';
import { Project, ProjectDocument } from './model/project.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>
  ) {}
  async getProjects(): Promise<
    { _id: string; name: string; imageUrl: string; teamId: string }[]
  > {
    const projects = await this.projectModel.find().lean();
    return projects;
  }

  async getProjectsByTeamId(teamId: string) {
    const projects = await this.projectModel.find({ teamId }).lean();
    return projects;
  }

  async getProject(projectId: string) {
    return await this.projectModel.findById(projectId).lean();
  }

  async createProject(
    data: CreateProjectDTO
  ): Promise<{ _id: string; name: string; imageUrl: string; teamId: string }> {
    // check for authority to create project here

    ///
    const { name, teamId, imageUrl } = data;
    const project = {
      name,
      teamId,
      imageUrl: imageUrl ? imageUrl : null,
    };
    // check for duplicate project generation in a team
    const teamProjects = await this.getProjectsByTeamId(teamId);
    if (teamProjects.some((project) => project.name === name)) {
      throw new ConflictException('Project already exists');
    }

    const newProject = await this.projectModel.create(project);
    newProject.save();

    return { ...newProject };
  }

  async removeProject(projectId: string) {
    // check for authority to remove the project here

    ///
    await this.projectModel.deleteOne({ _id: projectId });
    return true;
  }

  async updateProject(projectId: string, query: object) {
    // check for authority to update the project here

    ///
    if (!projectId) throw new ConflictException('Project not found');
    if (!query) throw new ConflictException('Query not found');
    await this.projectModel.updateOne({ _id: projectId }, { $set: query });
  }
}
