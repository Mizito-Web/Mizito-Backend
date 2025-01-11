import { forwardRef, Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './model/project.model';
import { Team, TeamSchema } from './model/team.model';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';
import { MemberShip, MemberShipSchema } from './model/membership.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Team.name, schema: TeamSchema },
      { name: MemberShip.name, schema: MemberShipSchema },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
