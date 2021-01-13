import { Injectable } from "@angular/core";
import Project from "../data/Project";
import { ProjectRepository } from "../storage/firestore/ProjectRepository";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor (
    private projectRepository: ProjectRepository
  ) {}

  async getProjectById(id: string) {
    return await this.projectRepository.getById(id);
  }

  getProject(id: string) {
    return this.projectRepository.getProjectById(id);
  }

  async getProjectsByIds(ids: string[]) {
    let projects: Project[] = [];
    for (let i = 0; i < ids.length; i+=10) {
      let queryArray = ids.slice(i, i+10);
      projects.push(...await this.projectRepository.getByIds(queryArray));
    }

    return projects;
  }

  async updateProjectById(id: string, projectData: Partial<Project>) {
    await this.projectRepository.updateById(id, projectData);
  }

  async createProject(name: string, description: string) {
    return await this.projectRepository.create(name, description);
  }
}
