import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDTO } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/team/:teamId')
  async getProjects(@Req() req, @Param('teamId') teamId: string) {
    if (!(await this.projectService.checkUserInTeam(req.user.id, teamId))) {
      throw new UnauthorizedException('You are not a member of this team');
    }
    return await this.projectService.getProjectsByTeamId(teamId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/:projectId')
  async getProject(@Req() req, @Param('projectId') projectId: string) {
    return await this.projectService.getProject(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/')
  createProject(@Req() req, @Body() data: CreateProjectDTO) {
    return this.projectService.createProject(req.user.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('/:projectId')
  updateProject(
    @Req() req,
    @Param('projectId') projectId: string,
    @Body() query: object
  ) {
    return this.projectService.updateProject(req.user.id, projectId, query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/:projectId')
  removeProject(@Req() req, @Param('projectId') projectId: string) {
    return this.projectService.removeProject(req.user.id, projectId);
  }
}
