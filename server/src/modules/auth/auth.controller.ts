import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  public async login(@Body() body) {
    return await this.service.login(body);
  }
}
