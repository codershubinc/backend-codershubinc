import { Module } from '@nestjs/common'; 
import { UsersController } from './users.controller';
import { UsersService } from './users.service'; 

@Module({ 
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService], // Export the service to make it available to other modules
})
export class UsersModule { }