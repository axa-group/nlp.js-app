import { ExecutionContext, Injectable } from '@nestjs/common';

import { role } from '../constants';
import { UsersService } from '../modules/users/users.service';
import { JwtAuthGuard } from './auth.guard';

@Injectable()
export class RegisterGuard extends JwtAuthGuard {

  constructor(
    private readonly usersService: UsersService
  ) {
    super([role.admin]);
  }

  public async canActivate(context: ExecutionContext) {
    const alreadyExistsAdmin = await this.alreadyExistsAdmin();

    return (alreadyExistsAdmin) ? await super.canActivate(context) : true;
  }

  private async alreadyExistsAdmin() {
    return !!await this.usersService.findOneByQuery({ where: { role: role.admin } });
  }
}
