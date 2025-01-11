import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDTO } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all projects for a team' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @Get('/team/:teamId')
  async getProjects(@Req() req, @Param('teamId') teamId: string) {
    if (!(await this.projectService.checkUserInTeam(req.user.id, teamId))) {
      throw new UnauthorizedException('You are not a member of this team');
    }
    return await this.projectService.getProjectsByTeamId(teamId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @Get('/:projectId')
  async getProject(@Req() req, @Param('projectId') projectId: string) {
    return await this.projectService.getProject(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ schema: {
    example: {
      name: 'Project1',
      teamId: '5129048051729380124',
      imageUrl: 'https://example.com/image.png'
    }
  } })
  @ApiResponse({ status: 201, description: 'Project created successfully.' })
  @ApiResponse({ status: 409, description: 'Project already exists.' })
  @Post('/')
  createProject(@Req() req, @Body() data: CreateProjectDTO) {
    return this.projectService.createProject(req.user.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a project' })
  @ApiBody({ type: Object })
  @ApiResponse({ status: 200, description: 'Project updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @Patch('/:projectId')
  updateProject(
    @Req() req,
    @Param('projectId') projectId: string,
    @Body() query: object
  ) {
    return this.projectService.updateProject(req.user.id, projectId, query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @Delete('/:projectId')
  removeProject(
    @Req() req: { user: { id: string } },
    @Param('projectId') projectId: string
  ) {
    return this.projectService.removeProject(req.user.id, projectId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a member to a project' })
  @ApiBody({ schema: { example: { userId: '12345' } } })
  @ApiResponse({ status: 201, description: 'Member added successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 409, description: 'User is already a member.' })
  @Post('/:projectId/members')
  addMember(
    @Req() req: { user: { id: string } },
    @Param('projectId') projectId: string,
    @Body() data: { userId: string }
  ) {
    return this.projectService.addUserToProject(
      req.user.id,
      data.userId,
      projectId
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a member from a project' })
  @ApiResponse({ status: 200, description: 'Member removed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'User not found in the project.' })
  @Delete('/:projectId/members/:userId')
  removeMember(
    @Req() req: { user: { id: string } },
    @Param('projectId') projectId: string,
    @Param('userId') userId: string
  ) {
    return this.projectService.removeUserFromProject(
      req.user.id,
      userId,
      projectId
    );
  }
}
