import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { Roles } from '../enums/role.enum';
import { UsersService } from 'src/modules/users/users.service';

const RoleGuard = (roles: Roles | Roles[]): Type<CanActivate> => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(private readonly userService: UsersService) {}

    async canActivate(context: ExecutionContext) {
      try {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const { role: userRole } = await this.userService.getRoleInShop(
          user.sub
        );

        request.user['role'] = userRole;

        if (typeof roles == 'object') {
          if (userRole != undefined) {
            if (!roles.includes(userRole)) {
              throw new ForbiddenException(
                `You must be one of the ${roles
                  .join(',')
                  .toLocaleLowerCase()} but you are ${userRole.toLocaleLowerCase()} now.`
              );
            }
          } else {
            throw new NotFoundException(
              'The user not found with this JWT or JWT is invalid'
            );
          }

          return roles.includes(userRole);
        } else if (typeof roles == 'string') {
          if (userRole != undefined) {
            if (userRole !== roles) {
              throw new ForbiddenException(
                `You must be ${roles.toLocaleLowerCase()} but you are ${userRole.toLocaleLowerCase()} now.`
              );
            }
          } else {
            throw new NotFoundException(
              'The user not found with this JWT or JWT is invalid'
            );
          }

          return userRole === roles;
        } else return true;
      } catch (error) {
        console.log(error);
        throw new BadRequestException(`${error}`);
      }
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
