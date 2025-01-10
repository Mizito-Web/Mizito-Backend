import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './model/task.model';
import { Model } from 'mongoose';
import { SubTask, SubTaskDocument } from './model/subtask.model';
import { ReportDocument, Report } from './model/report.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UsersService } from '../users/users.service';
import { ProjectService } from '../project/project.service';
import { CreateSubTaskDTO } from './dto/create-subtask.dto';
import { Assignment, AssignmentDocument } from './model/assignment.model';
import { TaskObject } from './dto/task.dto';
import { SubTaskObject } from './dto/subtask.dto';
import { CreateReportDTO } from './dto/create-report.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectModel(SubTask.name)
    private readonly subTaskModel: Model<SubTaskDocument>,
    @InjectModel(Report.name)
    private readonly reportModel: Model<ReportDocument>,
    @InjectModel(Assignment.name)
    private readonly assignmentModel: Model<AssignmentDocument>,
    private usersService: UsersService,
    private projectService: ProjectService
  ) {}

  async createTask(creatorId: string, data: CreateTaskDTO) {
    const project = await this.projectService.getProject(data.projectId);
    if (project.ownerId !== creatorId) {
      throw new UnauthorizedException('You are not the owner of this project');
    }
    const task = await this.taskModel.create(data);
    task.save();
    return task;
  }

  async getTasksForUser(userId: string, projectId: string) {
    const assignments = await this.assignmentModel
      .find({ userId: userId })
      .lean();
    const tasks = await Promise.all(
      assignments.map(async (assignment) => {
        const task = await this.taskModel.findById(assignment.taskId).lean();
        return task.projectId === projectId ? task : null;
      })
    );
    const result = tasks.filter((task) => task !== null);
    return result;
  }

  async getTaskMembers(taskId: string) {
    const members = await this.assignmentModel.find({ taskId: taskId });
    return members.map((member) => member.userId);
  }

  async createSubTask(creatorId: string, data: CreateSubTaskDTO) {
    if (!data.taskId) {
      throw new NotFoundException('Task not found');
    }
    const members = await this.getTaskMembers(data.taskId);
    if (!members.includes(creatorId)) {
      throw new UnauthorizedException('You are not a member of this task');
    }

    const { title, taskId } = data;
    const subtask = {
      title,
      taskId,
      isCompleted: false,
    };
    const subTask = await this.subTaskModel.create(subtask);
    subTask.save();
    return { ...subTask };
  }

  async addReport(userId: string, data: CreateReportDTO) {
    if (!data.taskId) {
      throw new NotFoundException('Task not found');
    }
    const members = await this.getTaskMembers(data.taskId);
    const owner = (await this.projectService.getProject(data.taskId)).ownerId;
    if (!members.includes(userId) && owner !== userId) {
      throw new UnauthorizedException(
        'You are not a member of this task or owner of the project'
      );
    }
    const report = await this.reportModel.create(data);
    report.save();
    return report;
  }

  async getProjectTasks(projectId: string) {
    return await this.taskModel.find({ projectId: projectId }).lean();
  }

  async getTask(taskId: string): Promise<TaskObject> {
    const task = await this.taskModel.findById(taskId).lean();
    const members = await this.getTaskMembers(taskId);
    return { ...task, memberIds: members };
  }

  async updateTaskDetails(userId: string, taskId: string, query: object) {
    const task = await this.taskModel.findById(taskId).lean();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const owner = (await this.projectService.getProject(task.projectId))
      .ownerId;
    const members = await this.getTaskMembers(taskId);
    if (owner !== userId && !members.includes(userId)) {
      throw new UnauthorizedException(
        'You are not the owner of this project or a member of this task'
      );
    }
    await this.taskModel.updateOne({ _id: taskId }, { $set: query });
  }

  async updateSubTaskDetails(userId: string, subTaskId: string, query: object) {
    const subTask = await this.subTaskModel.findById(subTaskId).lean();
    if (!subTask) {
      throw new NotFoundException('Subtask not found');
    }
    const owner = (await this.projectService.getProject(subTask.taskId))
      .ownerId;
    const members = await this.getTaskMembers(subTask.taskId);
    if (owner !== userId && !members.includes(userId)) {
      throw new UnauthorizedException(
        'You are not the owner of this project or a member of this task'
      );
    }
    await this.subTaskModel.updateOne({ _id: subTaskId }, { $set: query });
  }

  async updateReportDetails(userId: string, reportId: string, query: object) {
    const report = await this.reportModel.findById(reportId).lean();
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    const owner = (await this.projectService.getProject(report.taskId)).ownerId;
    const members = await this.getTaskMembers(report.taskId);
    if (owner !== userId && !members.includes(userId)) {
      throw new UnauthorizedException(
        'You are not the owner of this project or a member of this task'
      );
    }
    await this.reportModel.updateOne({ _id: reportId }, { $set: query });
  }

  async removeTask(userId: string, taskId: string) {
    const task = await this.taskModel.findById(taskId).lean();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const owner = (await this.projectService.getProject(task.projectId))
      .ownerId;
    if (owner !== userId) {
      throw new UnauthorizedException('You are not the owner of this project');
    }
    await this.taskModel.deleteOne({ _id: taskId });
  }

  async removeSubTask(userId: string, subTaskId: string) {
    const subTask = await this.subTaskModel.findById(subTaskId).lean();
    if (!subTask) {
      throw new NotFoundException('Subtask not found');
    }
    const members = await this.getTaskMembers(subTask.taskId);
    if (!members.includes(userId)) {
      throw new UnauthorizedException('You are not a member of this task');
    }
    await this.subTaskModel.deleteOne({ _id: subTaskId });
  }

  async getSubTask(subTaskId: string): Promise<SubTaskObject> {
    const subTask = await this.subTaskModel.findById(subTaskId).lean();
    return { ...subTask };
  }

  async addMember(userId: string, addingUserId: string, taskId: string) {
    const task = await this.taskModel.findById(taskId).lean();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const members = await this.getTaskMembers(taskId);
    if (members.includes(addingUserId)) {
      throw new ConflictException('User is already a member of this task');
    }
    const owner = (await this.projectService.getProject(task.projectId))
      .ownerId;
    if (owner !== userId) {
      throw new UnauthorizedException('You are not the owner of this project');
    }

    await this.taskModel.updateOne(
      { _id: taskId },
      { $push: { memberIds: addingUserId } }
    );
  }

  async removeMember(userId: string, removingUserId: string, taskId: string) {
    const task = await this.taskModel.findById(taskId).lean();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const members = await this.getTaskMembers(taskId);
    if (!members.includes(removingUserId)) {
      throw new ConflictException('User is not a member of this task');
    }
    const owner = (await this.projectService.getProject(task.projectId))
      .ownerId;
    if (owner !== userId) {
      throw new UnauthorizedException('You are not the owner of this project');
    }

    await this.taskModel.updateOne(
      { _id: taskId },
      { $pull: { memberIds: removingUserId } }
    );
  }
}
