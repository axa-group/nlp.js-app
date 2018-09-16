import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(
    protected readonly allowedRoles: string[]
  ) {
    super();
  }

  public async canActivate(context: ExecutionContext) {
    const canPass = await super.canActivate(context);
    console.log('JwtAuthGuard > canActivate > canPass', canPass);
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    console.log('JwtAuthGuard > canActivate > user.role -> ', user.role);

    return this.allowedRoles.includes(user.role);
  }

  public handleRequest(err, tokenPayload) {
    if (err || !tokenPayload) {
      throw err || new UnauthorizedException();
    }
    return tokenPayload;
  }
}
