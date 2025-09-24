import * as dotenv from 'dotenv';
dotenv.config();

const envConfig = {
    appwrite: {
        endpoint: process.env.APPWRITE_ENDPOINT || 'http://localhost/v1',
        projectId: process.env.APPWRITE_PROJECT_ID || 'your_project_id',
        apiKey: process.env.APPWRITE_API_KEY || 'your_api_key',
    }
}

export default envConfig;