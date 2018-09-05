import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Get()
    public async get() {
        return await this.service.findAll();
    }

    @Get(':id')
    public async getById(@Param('id') id: string) {
        return await this.service.findById(id);
    }

    @Post()
    public async post(@Body() entityDto) {
        return await this.service.create(entityDto);
    }

    @Patch(':id')
    public async patch(@Param('id') id: string, @Body() partialEntity) {
        return await this.service.updateOne(id, partialEntity);
    }

    @Delete(':id')
    public async delete(@Param('id') id: string) {
        return await this.service.deleteOne(id);
    }
}
