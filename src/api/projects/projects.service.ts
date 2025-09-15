import { Injectable } from "@nestjs/common";



@Injectable()
export class ProjectsService {
    getProjects(): string {
        return "List of projects";
    }
}
