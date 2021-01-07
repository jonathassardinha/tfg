import { EventEmitter, Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Project from "../data/Project";
import { ProjectRepository } from "../storage/firestore/ProjectRepository";
import { AuthService } from "./auth-service";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  loadingUserProjects: EventEmitter<boolean> = new EventEmitter();
  projectSelected: EventEmitter<boolean> = new EventEmitter();

  projects: Project[] = [];

  private _currentProject: Project;

  constructor (
    private projectRepository: ProjectRepository,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.authService.userLogEvent.subscribe(eventType => {
      if (eventType === 'logout') {
        this.logoutUser();
      }
    });
  }

  get currentProject() {
    return this._currentProject;
  }

  set currentProject(value: Project) {
    this._currentProject = value;
    this.projectSelected.emit(true);
  }

  async getProjectById(id: string) {
    return await this.projectRepository.getById(id);
  }

  getProject(id: string) {
    return this.projectRepository.getProjectById(id);
  }

  async loadUserProjects() {
    this.loadingUserProjects.emit(true);
    if (this.authService.user.projectIds.length !== 0) {
      this.projects = await this.projectRepository.getByIds(this.authService.user.projectIds);
    }
    this.loadingUserProjects.emit(false);
  }

  private logoutUser() {
    this.projects = [];
    this.currentProject = null;
  }

}
