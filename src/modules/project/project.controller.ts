import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDTO } from './dto/create-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/team/:teamId')
  async getProjects(@Param('teamId') teamId: string) {
    return await this.projectService.getProjectsByTeamId(teamId);
  }

  @Get('/:projectId')
  async getProject(@Param('projectId') projectId: string) {
    return await this.projectService.getProject(projectId);
  }

  @Post('/')
  createProject(@Body() data: CreateProjectDTO) {
    const userId = '';
    return this.projectService.createProject(userId, data);
  }

  @Put('/:projectId')
  updateProject(@Param('projectId') projectId: string, @Body() query: object) {
    const userId = '';

    return this.projectService.updateProject(userId, projectId, query);
  }

  @Delete('/:projectId')
  removeProject(@Param('projectId') projectId: string) {
    const userId = '';

    return this.projectService.removeProject(userId, projectId);
  }
}
