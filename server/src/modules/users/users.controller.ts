import {
  Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';

import { role } from '../../constants';
import { thrower } from '../../helpers';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @UseGuards(new JwtAuthGuard([role.admin]))
  public async get(@Req() req) {
    return await this.service.findAll();
  }

  @Get(':id')
  @UseGuards(new JwtAuthGuard([role.contributor, role.admin]))
  public async getById(@Param('id') id: string, @Req() req) {
    const loggedUser = req.user;
    const user = await this.service.findById(id);

    // INFO: Test of "allow only admins or yourself"
    return (loggedUser.role === role.admin || (loggedUser.username === user.username)) ?
              user : thrower(UnauthorizedException);
  }

  @Post()
  @UseGuards(new JwtAuthGuard([role.admin]))
  public async post(@Body() entityDto) {

    // TODO: encrypt password before saving

    return await this.service.create(entityDto);
  }

  @Patch(':id')
  @UseGuards(new JwtAuthGuard([role.contributor, role.admin]))
  public async patch(@Param('id') id: string, @Body() partialEntity) {
    return await this.service.updateOne(id, partialEntity);
  }

  @Delete(':id')
  @UseGuards(new JwtAuthGuard([role.admin]))
  public async delete(@Param('id') id: string) {
    return await this.service.deleteOne(id);
  }
}
