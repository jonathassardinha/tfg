import { EventEmitter, Injectable } from "@angular/core";
import { AuthService } from "./auth-service";
import { ProjectService } from "./project-service";
import { NetworkService } from "./network-service";
import { CategoryService } from "./category-service";
import { CodeService } from "./code-service";
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  public userFullyLoaded = new EventEmitter<boolean>();

  constructor (
    private authService: AuthService,
    private projectService: ProjectService,
    private networkService: NetworkService,
    private categoryService: CategoryService,
    private codeService: CodeService,
    private route: ActivatedRoute
  ) {
    this.authService.userLogEvent.subscribe((eventType: string) => {
      if (eventType === 'login') {
        this.loadUserData().then();
      }
    })
  }

  async loadUserData() {
    await this.projectService.loadUserProjects();
    let selectedProject = this.route.firstChild.snapshot.firstChild.params['projId'];
    if (selectedProject) {
      this.projectService.currentProject = this.projectService.projects.find(project => project.id === selectedProject);
      await this.networkService.loadUserNetworks();
      await this.categoryService.loadUserCategories();
      await this.codeService.loadUserCodes();
      this.userFullyLoaded.emit(true);
    }
  }

}
