import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CryptoModule } from '../crypto/crypto.module';
import { UsersModule } from '../users/users.module';
import { settings } from './settings';
import { Auth } from './auth.entity';
import { JwtStrategy } from './jwt-strategy.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    UsersModule,
    CryptoModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: settings.secret,
      signOptions: {
        expiresIn: settings.expiresIn
      }
    })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
