import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './model/task.model';
import { Model } from 'mongoose';
import { SubTask, SubTaskDocument } from './model/subtask.model';
import { ReportDocument, Report } from './model/report.model';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectModel(SubTask.name)
    private readonly subTaskModel: Model<SubTaskDocument>,
    @InjectModel(Report.name)
    private readonly reportModel: Model<ReportDocument>
  ) {}

  async createTask() {}

  async createSubTask() {}

  async addReport() {}

  async getProjectTasks(projectId: string) {}

  async getTask(taskId: string) {}

  async updateSubTaskStatus(subTaskId: string) {}

  async updateTaskDetails(taskId: string, query: object) {}

  async updateSubTaskDetails(subTaskId: string, query: object) {}

  async updateReportDetails(reportId: string, query: object) {}

  async removeTask(taskId: string) {}

  async removeSubTask(subTaskId: string) {}

  async getSubTask(subTaskId: string) {}
}
