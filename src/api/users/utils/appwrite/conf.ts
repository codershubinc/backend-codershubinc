
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
    appwriteEndpoint: process.env.APPWRITE_ENDPOINT || 'http://localhost/v1',
    appwriteProjectId: process.env.APPWRITE_PROJECT_ID || 'your_project_id',
    appwriteApiKey: process.env.APPWRITE_API_KEY || 'your_api_key',
};


export default config;