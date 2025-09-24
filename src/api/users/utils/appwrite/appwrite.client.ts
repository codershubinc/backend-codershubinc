import { Client } from "node-appwrite"; 
import { envConfig } from "../../../../config/index";
const client = new Client();

console.table({
    appwriteEndpoint: envConfig.appwrite.endpoint,
    appwriteProjectId: envConfig.appwrite.projectId,
    appwriteApiKey: envConfig.appwrite.apiKey ? 'Provided' : 'Not Provided',
});

client  
    .setEndpoint(envConfig.appwrite.endpoint || '') // Your Appwrite Endpoint
    .setProject(envConfig.appwrite.projectId || '') // Your project ID
    .setKey(envConfig.appwrite.apiKey || ''); // Your API Key

export default client;
