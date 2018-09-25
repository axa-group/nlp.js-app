import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../guards/auth.guard';
import { AdminOrMineRefreshTokenGuard } from '../../guards/admin-or-mine-refresh-token.guard';
import { LoginDto } from './dtos/login.dto';
import { RefreshDto } from './dtos/refresh.dto';
import { RawTokensResponse } from './interfaces/raw-tokens-response.interface';
import { ITokenResponse } from './interfaces/token-response.interface';
import { AuthService } from './auth.service';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  public async login(@Body() body: LoginDto) {
    const rawResponse = await this.service.login(body);

    return this.formatTokensResponse(rawResponse);
  }

  @Post('token/refresh')
  public async refreshToken(@Body() body: RefreshDto) {
    const refreshToken = body.refresh_token;
    const accessToken = await this.service.refreshAccessToken(refreshToken);

    return this.formatTokensResponse({ refreshToken, accessToken });
  }

  @Post('token/reject')
  @ApiBearerAuth()
  @UseGuards(new JwtAuthGuard([]), AdminOrMineRefreshTokenGuard)
  public async rejectToken(@Body() body: RefreshDto, @Res() res) {
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
