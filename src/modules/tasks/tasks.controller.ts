import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateSubTaskDTO } from './dto/create-subtask.dto';
import { CreateReportDTO } from './dto/create-report.dto';
import { CreateTaskDTO } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDTO })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  @Post()
  async createTask(@Req() req, @Body() createTaskDto: CreateTaskDTO) {
    return await this.tasksService.createTask(req.user.id, createTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tasks for a user' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  @Get('user')
  async getTasksForUser(@Req() req, @Query('projectId') projectId: string) {
    return await this.tasksService.getTasksForUser(req.user.id, projectId);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully.' })
  @Get(':taskId')
  async getTask(@Req() req, @Param('taskId') taskId: string) {
    const task = await this.tasksService.getTask(taskId);
    if (!task.memberIds.includes(req.user.id)) {
      throw new UnauthorizedException('You are not a member of this task');
    }
    return task;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update task details' })
  @ApiBody({ type: Object })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  @Patch(':taskId')
  async updateTaskDetails(
    @Req() req,
    @Param('taskId') taskId: string,
    @Body() query: object
  ) {
    return await this.tasksService.updateTaskDetails(
      req.user.id,
      taskId,
      query
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  @Delete(':taskId')
  async removeTask(@Req() req, @Param('taskId') taskId: string) {
    return await this.tasksService.removeTask(req.user.id, taskId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a subtask' })
  @ApiBody({ type: CreateSubTaskDTO })
  @ApiResponse({ status: 201, description: 'Subtask created successfully.' })
  @Post('subtasks')
  async createSubTask(@Req() req, @Body() createSubTaskDto: CreateSubTaskDTO) {
    return await this.tasksService.createSubTask(req.user.id, createSubTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update subtask details' })
  @ApiBody({ type: Object })
  @ApiResponse({ status: 200, description: 'Subtask updated successfully.' })
  @Patch('subtasks/:subTaskId')
  async updateSubTaskDetails(
    @Req() req,
    @Param('subTaskId') subTaskId: string,
    @Body() query: object
  ) {
    return await this.tasksService.updateSubTaskDetails(
      req.user.id,
      subTaskId,
      query
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a subtask' })
  @ApiResponse({ status: 200, description: 'Subtask deleted successfully.' })
  @Delete('subtasks/:subTaskId')
  async removeSubTask(@Req() req, @Param('subTaskId') subTaskId: string) {
    return await this.tasksService.removeSubTask(req.user.id, subTaskId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a report' })
  @ApiBody({ type: CreateReportDTO })
  @ApiResponse({ status: 201, description: 'Report added successfully.' })
  @Post('reports')
  async addReport(@Req() req, @Body() createReportDto: CreateReportDTO) {
    return await this.tasksService.addReport(req.user.id, createReportDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update report details' })
  @ApiBody({ type: Object })
  @ApiResponse({ status: 200, description: 'Report updated successfully.' })
  @Patch('reports/:reportId')
  async updateReportDetails(
    @Req() req,
    @Param('reportId') reportId: string,
    @Body() query: object
  ) {
    return await this.tasksService.updateReportDetails(
      req.user.id,
      reportId,
      query
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a member to a task' })
  @ApiBody({ schema: { example: { addingUserId: '12345' } } })
  @ApiResponse({ status: 201, description: 'Member added successfully.' })
  @Post(':taskId/members')
  async addMember(
    @Req() req,
    @Param('taskId') taskId: string,
    @Body('addingUserId') addingUserId: string
  ) {
    return await this.tasksService.addMember(req.user.id, addingUserId, taskId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a member from a task' })
  @ApiResponse({ status: 200, description: 'Member removed successfully.' })
  @Delete(':taskId/members/:removingUserId')
  async removeMember(
    @Req() req,
    @Param('taskId') taskId: string,
    @Param('removingUserId') removingUserId: string
  ) {
    return await this.tasksService.removeMember(
      req.user.id,
      removingUserId,
      taskId
    );
  }
}
