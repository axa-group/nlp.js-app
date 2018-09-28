import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

import { role } from '../../constants';
import { AdminOrMeGuard } from '../../guards/admin-or-me.guard';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { RegisterGuard } from '../../guards/register.guard';
import { LoggerService } from '../shared/services/logger.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { NewUserDto } from './dtos/new-user.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiUseTags('users')
@Controller('users')
export class UsersController {
  private readonly logger: LoggerService = new LoggerService(UsersController.name);

  constructor(private readonly service: UsersService) {}

  @Get()
  @UseGuards(new JwtAuthGuard([role.admin]))
  public async get(@Query('q') q) {
    const query = q && q !== '' ? JSON.parse(q) : q;
    const items = await this.service.findAll(query);

    this.logger.log('get request received! %j', items);

    return items;
  }

  @Get(':id')
  @UseGuards(new JwtAuthGuard([role.contributor, role.admin]), AdminOrMeGuard)
  public async getById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post()
  @UseGuards(RegisterGuard)
  public async post(@Body() entityDto: NewUserDto) {
    return await this.service.create(entityDto);
  }

  @Patch(':id/change-password')
  @UseGuards(new JwtAuthGuard([role.contributor, role.admin]), AdminOrMeGuard)
  public async changePassword(@Param('id') id: string, @Body() { password }: ChangePasswordDto, @Res() res) {
    await this.service.changePassword(id, password);

    return res.status(HttpStatus.NO_CONTENT).json();
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
