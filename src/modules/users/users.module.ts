import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.model';
import { TeamMemberShip, TeamMemberShipSchema } from './model/membership.model';
import { Team, TeamSchema } from '../project/model/team.model';
import { Invitation, InvitationSchema } from './model/invitation.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TeamMemberShip.name, schema: TeamMemberShipSchema },
      { name: Team.name, schema: TeamSchema },
      { name: Invitation.name, schema: InvitationSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
