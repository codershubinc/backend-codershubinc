import { Account, OAuthProvider } from "node-appwrite";
import client from "./appwrite.client";

class oAuth {
    account = new Account(client);

    async createOAuth2SessionGoogle(
        success: string,
        failure: string
    ): Promise<any> {
        try {
            console.log('failure url:', failure);
            console.log('success url:', success);

            return await this.account.createOAuth2Token(
                OAuthProvider.Google,
                success,
                failure,
                []
            );
        } catch (error) {
            console.error('Error creating OAuth2 session with Google:', error);
            throw error;
        }
    }
}

const OAuth = new oAuth();
export default OAuth;