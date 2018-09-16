import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards
} from '@nestjs/common';

import { role } from '../../constants';
import { AdminOrMeGuard } from '../../guards/admin-or-me.guard';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { RegisterGuard } from '../../guards/register.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @UseGuards(new JwtAuthGuard([role.admin]))
  public async get(@Query('q') q) {
    const query = q && q !== '' ? JSON.parse(q) : q;

    return await this.service.findAll(query);
  }

  @Get(':id')
  @UseGuards(new JwtAuthGuard([role.contributor, role.admin]), AdminOrMeGuard)
  public async getById(@Param('id') id: string, @Req() req) {
    return await this.service.findById(id);
  }

  @Post()
  @UseGuards(RegisterGuard)
  public async post(@Body() entityDto) {
    return await this.service.create(entityDto);
  }

  @Patch(':id/change-password')
  @UseGuards(new JwtAuthGuard([role.contributor, role.admin]), AdminOrMeGuard)
  public async changePassword(@Param('id') id: string, @Body() partialEntity, @Req() req) {
    return await this.service.changePassword(id, partialEntity.password);
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
