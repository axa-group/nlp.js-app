import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(protected readonly allowedRoles: string[] = []) {
    super();
  }

  public async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    return !this.allowedRoles || !this.allowedRoles.length || this.allowedRoles.includes(user.role);
  }

  public handleRequest(err, tokenPayload) {
    if (err || !tokenPayload) {
      throw err || new UnauthorizedException();
    }
    return tokenPayload;
  }
}
