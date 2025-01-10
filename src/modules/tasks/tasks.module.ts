import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './model/task.model';
import { SubTask, SubTaskSchema } from './model/subtask.model';
import { ReportSchema } from './model/report.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: SubTask.name, schema: SubTaskSchema },
      { name: Report.name, schema: ReportSchema },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
