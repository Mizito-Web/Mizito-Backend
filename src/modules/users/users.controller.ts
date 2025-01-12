import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateTeamDTO } from '../project/dto/create-team.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiBody({
    schema: {
      example: {
        name: 'K3rn3lpanic team',
        imageUrl: 'https://example.com/image.png',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Team created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @Post('/teams')
  async createTeam(
    @Req() req: { user: { id: string } },
    @Body() data: CreateTeamDTO
  ) {
    return await this.usersService.createTeam(req.user.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiBody({
    schema: {
      example: {
        firstName: 'matin',
        avatar: 'https://example.com/image.png',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @Patch('/')
  async updateUser(@Req() req: { user: { id: string } }, @Body() data: object) {
    return await this.usersService.updateUser(req.user.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({ status: 201, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User does not exist.' })
  @Get('/:userName')
  async getUser(
    @Req() req: { user: { id: string } },
    @Param('userName') userName: string
  ) {
    const user = await this.usersService.getUser({ userName });
    if (!user) {
      throw new NotFoundException('User does not exist.');
    }
    return {
      userId: user._id,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite a user to a team' })
  @ApiBody({
    schema: {
      example: {
        userId: '12345',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Invited user to team successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  @ApiResponse({
    status: 409,
    description: 'User is already a member of the team.',
  })
  @Post('/teams/:teamId/members/invitation')
  async inviteUserToTeam(
    @Req() req: { user: { id: string } },
    @Param('teamId') teamId: string,
    @Body('userId') userId: string
  ) {
    return await this.usersService.inviteUser(req.user.id, userId, teamId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept an team invitation' })
  @ApiResponse({
    status: 201,
    description: 'Invitation has been accepted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  @ApiResponse({
    status: 409,
    description: 'User is already a member of the team.',
  })
  @Post('/teams/:teamId/members/invitation/:invitationId')
  async acceptInvitation(
    @Req() req: { user: { id: string } },
    @Param('teamId') teamId: string,
    @Param('invitationId') invitationId: string
  ) {
    return await this.usersService.acceptInvitation(req.user.id, invitationId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a user from team' })
  @ApiResponse({
    status: 201,
    description: 'User removed from the team successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  @ApiResponse({
    status: 409,
    description: 'User is not a member of the team.',
  })
  @Delete('/teams/:teamId/members/:userId')
  async removeUserFromTeam(
    @Req() req: { user: { id: string } },
    @Param('teamId') teamId: string,
    @Param('userId') userId: string
  ) {
    return await this.usersService.removeUserFromTeam(
      req.user.id,
      userId,
      teamId
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a team' })
  @ApiResponse({ status: 200, description: 'Team removed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  @Delete('/:teamId')
  async removeTeam(
    @Req() req: { user: { id: string } },
    @Param('teamId') teamId: string
  ) {
    return await this.usersService.removeTeam(req.user.id, teamId);
  }

  /*
  TODO: list
  Get team,
  update team,
  Delete account

  */
}
