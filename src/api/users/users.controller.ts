import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDto, UpdateUserDto } from './models';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        try {
            const user = await this.usersService.create(createUserDto);
            return user;
        } catch (error) {
            if (error.code === 11000) {
                throw new HttpException('Email already exists', HttpStatus.CONFLICT);
            }
            throw new HttpException('Failed to create user', HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @Get('email/:email')
    async findByEmail(@Param('email') email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.usersService.update(id, updateUserDto);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const user = await this.usersService.remove(id);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return { message: 'User deleted successfully' };
    }

    @Patch(':id/login')
    async updateLastLogin(@Param('id') id: string) {
        const user = await this.usersService.updateLastLogin(id);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @Post('verify-password')
    async verifyPassword(@Body() body: { email: string; password: string }) {
        if (!body.email || !body.password) {
            throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
        }

        const user = await this.usersService.verifyPassword(body.email, body.password);
        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    @Patch(':id/change-password')
    async changePassword(@Param('id') id: string, @Body() body: { oldPassword: string; newPassword: string }) {
        if (!body.oldPassword || !body.newPassword) {
            throw new HttpException('Old password and new password are required', HttpStatus.BAD_REQUEST);
        }

        try {
            const user = await this.usersService.changePassword(id, body.oldPassword, body.newPassword);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return user;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}