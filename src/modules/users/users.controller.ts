import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
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
  @ApiOperation({ summary: 'Add a user to a team' })
  @ApiBody({
    schema: {
      example: {
        userId: '12345',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User added to the team successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({ status: 404, description: 'Team not found.' })
  @ApiResponse({
    status: 409,
    description: 'User is already a member of the team.',
  })
  @Post(':teamId/members')
  async addUserToTeam(
    @Req() req: { user: { id: string } },
    @Param('teamId') teamId: string,
    @Body('userId') userId: string
  ) {
    return await this.usersService.addUserToTeam(req.user.id, userId, teamId);
  }
}
