import { Account, OAuthProvider } from "node-appwrite";
import client from "./appwrite.client";

class OAuth {
    account = new Account(client);

    async createOAuth2SessionGoogle(
        successUrl: string,
        failureUrl: string,
    ): Promise<any> {
        try {
            return await this.account.createOAuth2Token(
                OAuthProvider.Google,
                successUrl,
                failureUrl
            );
        } catch (error) {
            console.error('Error creating OAuth2 session with Google:', error);
            throw error;
        }
    }
}
