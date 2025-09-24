import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/auth/users.module';
import { OAuthModule } from './users/OAuth/oauth.module';


export const modules = [
    ProjectsModule,
    UsersModule,
    OAuthModule
] 