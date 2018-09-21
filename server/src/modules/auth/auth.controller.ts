import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../guards/auth.guard';
import { AdminOrMineRefreshTokenGuard } from '../../guards/admin-or-mine-refresh-token.guard';
import { RawTokensResponse } from './interfaces/raw-tokens-response.interface';
import { ITokenResponse } from './interfaces/token-response.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  public async login(@Body() body) {
    const rawResponse = await this.service.login(body);

    return this.formatTokensResponse(rawResponse);
  }

  @Post('token/refresh')
  public async refreshToken(@Body() body) {
    const refreshToken = body.refresh_token;
    const accessToken = await this.service.refreshAccessToken(refreshToken);

    return this.formatTokensResponse({ refreshToken, accessToken });
  }

  @Post('token/reject')
  @UseGuards(new JwtAuthGuard([]), AdminOrMineRefreshTokenGuard)
  public async rejectToken(@Body() body, @Res() res) {
    await this.service.rejectToken(body.refresh_token);

    return res.status(HttpStatus.NO_CONTENT).json();
  }

  private formatTokensResponse({ accessToken, refreshToken }: RawTokensResponse): ITokenResponse {
    return {
      access_token: accessToken,
      refresh_token: refreshToken
    };
  }
}
