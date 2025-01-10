import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './model/task.model';
import { SubTask, SubTaskSchema } from './model/subtask.model';
import { ReportSchema, Report } from './model/report.model';
import { UsersModule } from '../users/users.module';
import { ProjectModule } from '../project/project.module';
import { ProjectService } from '../project/project.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: SubTask.name, schema: SubTaskSchema },
      { name: Report.name, schema: ReportSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => ProjectModule),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
