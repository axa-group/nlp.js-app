import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(
    private readonly allowedRoles: string[]
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context).then((canPass) => {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      return this.allowedRoles.includes(user.role);
    });
  }

  handleRequest(err, tokenPayload) {
    if (err || !tokenPayload) {
      throw err || new UnauthorizedException();
    }
    return tokenPayload;
  }
}
