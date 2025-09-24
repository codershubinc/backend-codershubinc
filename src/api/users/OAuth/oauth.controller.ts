import {
    BadRequestException,
    ConflictException,
    Body,
    Controller,
    Param,
    Post,
    Res,
    HttpStatus,
    Req
} from "@nestjs/common";
import type { Response } from 'express';
import { OAuthService } from "./oauth.service";
import Cookies from "../utils/cookies";

@Controller('user/oauth')
export class OAuthController {
    constructor(private readonly oauthService: OAuthService) { }

    @Post('signup')
    async signup(
        @Body() body: any,
        @Res() res: Response,
        @Req() req
    ) {
        const { success, failure, } = body;
        console.log('Signup request body:', body);
        console.log('failure url 0:', failure);
        console.log('success url 0:', success);

        try {
            if (req.cookies?.session) {
                return res.status(HttpStatus.CONFLICT).json({
                    status: HttpStatus.CONFLICT,
                    message: 'User already has an active session',
                    error: 'Conflict',
                    statusCode: 409,
                    redirectUrl: success
                });
            }

            if (!failure || !success) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Missing required fields',
                    error: 'Bad Request',
                    statusCode: 400,
                    details: {
                        failure: !failure ? 'Missing failure' : undefined,
                        success: !success ? 'Missing success' : undefined
                    }
                });
            }

            const response = await this.oauthService.signup(success, failure);
            console.log('OAuth signup response:', response);

            return res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'OAuth signup successful',
                data: response,
                redirectUrl: success
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'OAuth signup failed',
                error: error.message,
                redirectUrl: failure
            });
        }
    }

    @Post('login')
    async login(
        @Body() body: any,
        @Param() params: any,
        @Res() res: Response,
        @Req() req: any
    ) {
        try {
            if (req.cookies?.session) {
                return res.status(HttpStatus.CONFLICT).json({
                    status: HttpStatus.CONFLICT,
                    message: 'User already has an active session',
                    error: 'Conflict',
                    statusCode: 409
                });
            }

            if (!params.userId || !params.secret) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Missing authentication parameters',
                    error: 'Bad Request',
                    statusCode: 400,
                    details: {
                        userId: !params.userId ? 'Missing userId' : undefined,
                        secret: !params.secret ? 'Missing secret' : undefined
                    }
                });
            }

            const { userId, secret } = params;
            const response = await this.oauthService.login(userId, secret);

            // Set session cookie
            Cookies.createSessionCookie(res, response.session);

            // Don't expose session in response
            const { session, ...safeResponse } = response;

            return res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'OAuth login successful',
                data: safeResponse
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: 'OAuth login failed',
                error: error.message
            });
        }
    }
}