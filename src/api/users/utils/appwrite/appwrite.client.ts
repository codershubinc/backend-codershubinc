import { Client } from "node-appwrite";
import config from "./conf";

const client = new Client();

console.table({
    appwriteEndpoint: config.appwriteEndpoint,
    appwriteProjectId: config.appwriteProjectId,
    appwriteApiKey: config.appwriteApiKey ? 'Provided' : 'Not Provided',

})

client
    .setEndpoint(config.appwriteEndpoint) // Your Appwrite Endpoint
    .setProject(config.appwriteProjectId) // Your project ID
   .setKey(config.appwriteApiKey); // Your

export default client;
