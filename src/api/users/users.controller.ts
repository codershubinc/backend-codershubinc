import {
    Body,
    ConflictException,
    Controller,
    HttpStatus,
    Post,
    Req,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('/auth/signup')
    async signup(
        @Body() body
    ) {
        const { email, password, name } = body;
        console.log('Signup request:', body);
        return this.usersService.signup({ email, password, name });
    }
    @Post('/auth/login')
    async login(
        @Body() body,
        @Req() req
    ) {
        const { email, password } = body;
        console.log('Login request:', body);
        return this.usersService.login({ email, password }, req);
    }
    @Post('/auth/logout')
    async logout(
        @Body() body
    ) {
        const { userId, sessionId } = body.data;
        return this.usersService.logout(userId, sessionId);
    }
    @Post('/auth/me')
    async getCurrentUser(
        @Body() body
    ) {
        const { sessionId } = body.data;
        return this.usersService.getCurrentUser(sessionId);
    }
}