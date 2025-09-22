import { Account, ID, Users } from "node-appwrite";
import client from "./appwrite.client";
import type { EmailPassLogin, EmailPassSignIn } from "../../models/auth.model";

class auth {
    users = new Users(client);
    accounts = new Account(client);

    async signup(data: EmailPassSignIn): Promise<any> {
        try {
            return await this.accounts.create(
                ID.unique(),
                data.email,
                data.password,
                data.name
            )

        } catch (error) {
            console.error('Error during sign-up:', error);
            throw error;
        }
    }

    async login(data: EmailPassLogin): Promise<any> {
        try {
            return await this.accounts.createEmailPasswordSession(
                data.email,
                data.password
            );
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    async logout(userId: string, sessionId: string): Promise<any> {
        try {
            return await this.users.deleteSession(
                userId,
                sessionId
            );
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    }
   
}


const SimpleAuth = new auth();
export default SimpleAuth;