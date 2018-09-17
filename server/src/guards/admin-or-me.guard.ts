import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from '../modules/users/users.service';
import { role } from '../constants';
import { thrower } from '../helpers';

@Injectable()
export class AdminOrMeGuard extends AuthGuard('jwt') {
  constructor(private readonly usersService: UsersService) {
    super([role.admin]);
  }

  public async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const loggedUser = req.user;
    const { id } = req.params;
    const user = await this.usersService.findById(id);

    return this.allowAdminsOrYourself(loggedUser, user) || thrower(UnauthorizedException);
  }

  private allowAdminsOrYourself(loggedUser, requestedUser) {
    return loggedUser.role === role.admin || loggedUser.username === requestedUser.username;
  }
}
