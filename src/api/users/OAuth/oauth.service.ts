import { Injectable } from "@nestjs/common";
import OAuth from "../utils/appwrite/oAuth";
import SessionManager from "../utils/session";


@Injectable()
export class OAuthService {

    async signup(
        success: string,
        failure: string,
    ) {
        console.log('failure url 1:', failure);
        console.log('success url 1:', success);

        return await OAuth.createOAuth2SessionGoogle(
            success,
            failure
        )
    }
    async login(
        userId: string,
        secret: string
    ) {
        // Implement login logic here
        return await SessionManager.createSession(userId, secret);
    }
}