import {
    Body,
    ConflictException,
    Controller,
    HttpStatus,
    Post,
    Req,
    BadRequestException,
    UnauthorizedException,
    InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import Cookies from '../utils/cookies';

@Controller('user/auth')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('/signup')
    async signup(
        @Body() body,
        @Req() req
    ) {
        // Check if user is already logged in
        if (req.cookies['session']) {
            throw new ConflictException({
                status: HttpStatus.CONFLICT,
                message: 'User already has an active session',
                error: 'Conflict',
                statusCode: 409
            });
        }

        const { email, password, name } = body;

        // Validate required fields
        if (!email || !password || !name) {
            throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Missing required fields',
                error: 'Bad Request',
                statusCode: 400,
                details: {
                    email: !email ? 'Email is required' : undefined,
                    password: !password ? 'Password is required' : undefined,
                    name: !name ? 'Name is required' : undefined
                }
            });
        }

        try {
            const user = await this.usersService.signup({ email, password, name });
            return {
                status: HttpStatus.CREATED,
                message: 'User created successfully',
                data: {
                    userId: user.id,
                    email: user.email,
                    name: user.name
                }
            };
        } catch (error) {
            if (error.code === 11000) { // MongoDB duplicate key error
                throw new ConflictException({
                    status: HttpStatus.CONFLICT,
                    message: 'Email already exists',
                    error: 'Conflict',
                    statusCode: 409
                });
            }
            throw new InternalServerErrorException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error creating user',
                error: 'Internal Server Error',
                statusCode: 500
            });
        }
    }

    @Post('/login')
    async login(
        @Body() body,
        @Req() req,
    ) {
        const isLoggedIn = req.cookies['session'];
        console.log('isLoggedIn:', isLoggedIn);

        if (isLoggedIn) {
            throw new ConflictException({
                status: HttpStatus.CONFLICT,
                message: 'User already has an active session',
                error: 'Conflict',
                statusCode: 409
            });
        }

        const { email, password } = body;

        if (!email || !password) {
            throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Missing credentials',
                error: 'Bad Request',
                statusCode: 400,
                details: {
                    email: !email ? 'Email is required' : undefined,
                    password: !password ? 'Password is required' : undefined
                }
            });
        }

        try {
            const session = await this.usersService.login({ email, password });
            // Set session cookie
            Cookies.createSessionCookie(req.res, session);

            // Remove sensitive data
            const { secret, ...safeSession } = session;
            return {
                status: HttpStatus.OK,
                message: 'Login successful',
                data: safeSession
            };
        } catch (error) {
            throw new UnauthorizedException({
                status: HttpStatus.UNAUTHORIZED,
                message: 'Invalid credentials',
                error: 'Unauthorized',
                statusCode: 401
            });
        }
    }

    @Post('/logout')
    async logout(
        @Body() body,
        @Req() req
    ) {
        if (!req.cookies['session']) {
            throw new UnauthorizedException({
                status: HttpStatus.UNAUTHORIZED,
                message: 'No active session',
                error: 'Unauthorized',
                statusCode: 401
            });
        }

        const { userId, sessionId } = body.data;
        if (!userId || !sessionId) {
            throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Missing required fields',
                error: 'Bad Request',
                statusCode: 400,
                details: {
                    userId: !userId ? 'User ID is required' : undefined,
                    sessionId: !sessionId ? 'Session ID is required' : undefined
                }
            });
        }

        try {
            await this.usersService.logout(userId, sessionId);
            // Clear session cookie
            req.res.clearCookie('session');

            return {
                status: HttpStatus.OK,
                message: 'Logout successful'
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Error during logout',
                error: 'Internal Server Error',
                statusCode: 500
            });
        }
    }

    @Post('/me')
    async getCurrentUser(
        @Body() body,
        @Req() req
    ) {
        if (!req.cookies['session']) {
            throw new UnauthorizedException({
                status: HttpStatus.UNAUTHORIZED,
                message: 'No active session',
                error: 'Unauthorized',
                statusCode: 401
            });
        }

        const { sessionId } = body.data;
        if (!sessionId) {
            throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Session ID is required',
                error: 'Bad Request',
                statusCode: 400
            });
        }

        try {
            const user = await this.usersService.getCurrentUser(sessionId);
            if (!user) {
                throw new UnauthorizedException({
                    status: HttpStatus.UNAUTHORIZED,
                    message: 'Invalid session',
                    error: 'Unauthorized',
                    statusCode: 401
                });
            }

            return {
                status: HttpStatus.OK,
                message: 'User details retrieved successfully',
                data: {
                    userId: user.id,
                    email: user.email,
                    name: user.name
                }
            };
        } catch (error) {
            throw new UnauthorizedException({
                status: HttpStatus.UNAUTHORIZED,
                message: 'Invalid session',
                error: 'Unauthorized',
                statusCode: 401
            });
        }
    }
}