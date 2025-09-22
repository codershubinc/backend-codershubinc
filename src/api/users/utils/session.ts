import { Account } from "node-appwrite";
import client from "./appwrite/appwrite.client";

class Session {

    account = new Account(client);

    async createSession(userId: string, secrete: string): Promise<any> {
        try {
            return await this.account.createSession(userId, secrete);
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    }
    async updateMagicURLSession(userId: string, sessionId: string): Promise<any> {
        try {
            return await this.account.updateMagicURLSession(userId, sessionId);
        } catch (error) {
            console.error('Error updating magic URL session:', error);
            throw error;
        }
    }
    async createMagicURLToken(userId: string, email: string, url: string): Promise<any> {
        try {
            return await this.account.createMagicURLToken(userId, email, url);
        } catch (error) {
            console.error('Error creating magic URL token:', error);
            throw error;
        }
    }
}
const SessionManager = new Session();
export default SessionManager;