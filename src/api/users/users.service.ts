import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { EmailPassLogin, EmailPassSignIn } from './models/auth.model';
import SimpleAuth from './utils/appwrite/auth';
import CommonAuth from './utils/appwrite/common.auth';

@Injectable()
export class UsersService {
    constructor() { }

    async signup(data: EmailPassSignIn) {
        return await SimpleAuth.signup(data);
    }
    async login(
        data: EmailPassLogin,
        req
    ) {
        const isLoggedIn = req.cookies['session_id'] ? true : false;
        // return error already logged in
        if (isLoggedIn) throw new ConflictException({
            statusCode: HttpStatus.CONFLICT,
            message: 'User already logged in',
            error: 'Conflict'
        })
        return await SimpleAuth.login(data);
    }
    async logout(userId: string, sessionId: string) {
        return await SimpleAuth.logout(userId, sessionId);
    }

    async getCurrentUser(sessionId: string) {
        return await CommonAuth.getCurrentUser(sessionId);
    }
}