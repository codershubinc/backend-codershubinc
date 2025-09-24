import { Account } from "node-appwrite";
import client from "./appwrite.client";

class commonAuth {
    accounts = new Account(client)

    async getCurrentUser(sessionId: string): Promise<any> {
        try {
            client.setSession(sessionId);
            return await this.accounts.get();
        } catch (error) {
            console.error('Error getting current user:', error);
            throw error;
        }
    } 
}

const CommonAuth = new commonAuth();
export default CommonAuth;