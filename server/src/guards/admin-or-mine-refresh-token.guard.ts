import { ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../modules/auth/auth.service';
import { role } from '../constants';
import { thrower } from '../helpers';

@Injectable()
export class AdminOrMineRefreshTokenGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super([role.admin]);
  }

  public async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const loggedUser = req.user;
    const { refresh_token } = req.body;
    const tokenPayload = await this.authService.getRefreshTokenPayload(refresh_token);

    if (tokenPayload) {
      return this.allowAdminsOrYourself(loggedUser, tokenPayload) || thrower(UnauthorizedException);
    }

    throw new NotFoundException();
  }

  private allowAdminsOrYourself(loggedUser, tokenPayload) {
    return loggedUser.role === role.admin || loggedUser.username === tokenPayload.username;
  }
}
