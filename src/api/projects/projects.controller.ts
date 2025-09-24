import { Controller, Param } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { projectsData } from "./data";


@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Get()
    getProjects(): string {
        return this.projectsService.getProjects();
    }

    @Get(':name')
    getProjectByName(@Param('name') name: string): any {
        try {
            console.log(`Fetching project: ${name}`);
            

            console.log(`Fetching project: ${name}` + projectsData[name]);
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            if (!name) throw new Error('Project name is required');
            if (!projectsData[name]) throw new Error(`Project '${name}' not found`);
            
            return projectsData[name];
        } catch (err) {
            return { error: `Project '${name}' not found.` };
        }
    }
}