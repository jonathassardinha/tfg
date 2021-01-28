import { EventEmitter, Injectable } from "@angular/core";
import { AuthService } from "./auth-service";
import { ProjectService } from "./project-service";
import { NetworkService } from "./network-service";
import { CategoryService } from "./category-service";
import { CodeService } from "./code-service";
import { ActivatedRoute } from "@angular/router";
import Project from "../data/Project";
import Network from "../data/Network";
import Category from "../data/Category";
import Code from "../data/Code";
import User from "../data/User";

import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import { UserRepository } from "../storage/firestore/UserRepository";
import Source from "../data/Source";
import { SourceService } from "./source-service";

export const LOCAL_STORAGE_KEYS = {
  username: 'qualidataUsername',
  lastSelectedNetwork: 'qualidataLastSelectedNetwork'
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user: User;
  private _projects: Project[] = [];
  private _currentProject: Project;
  private _sources: Source[] = [];
  private _networks: Network[] = [];
  private _currentNetwork: Network;
  private _categories: Category[] = [];
  private _codes: Code[] = [];

  public currentSource: Source;
  public isAppConnected = false;
  public userFullyLoaded = new EventEmitter<boolean>();
  public networkSelected = new EventEmitter<boolean>();
  public loadingUserProjects = new EventEmitter<boolean>();
  public loadingUserCategories = new EventEmitter<boolean>();
  public loadingUserCodes = new EventEmitter<boolean>();
  public loggingInUser = new EventEmitter<boolean>();
  public connectionEvent = new EventEmitter<boolean>();

  constructor (
    private userRepository: UserRepository,
    private authService: AuthService,
    private projectService: ProjectService,
    private networkService: NetworkService,
    private categoryService: CategoryService,
    private codeService: CodeService,
    private sourceService: SourceService,
    private route: ActivatedRoute
  ) {
    let ref = firebase.app().database().ref('.info/connected');
    ref.on('value', (snapshot) => {
      this.connectionEvent.emit(snapshot.val());
      this.isAppConnected = snapshot.val();
      if (snapshot.val()) {
        firebase.app().firestore().enableNetwork().then(() => {
          let username = localStorage.getItem(LOCAL_STORAGE_KEYS.username);
          if (username) {
            this.loginUserWithData(username, false).then();
          }
        });
      } else {
        if (localStorage.getItem(LOCAL_STORAGE_KEYS.username)) {
          this.loggingInUser.emit(true);
        }
        firebase.app().firestore().disableNetwork().then();
      }
    });
  }

  async signupUser(username: string) {
    this.user = await this.authService.signupUser(username);
    this._projects = [];
    this._sources = [];
    this._networks = [];
    this._categories = [];
    this._categories = [];
    this._codes = [];
    this._currentNetwork = null;
    this._currentProject = null;
    this.loadingUserProjects.emit(false);
  }

  async loginUser(username: string, storeUsername = true) {
    this.user = await this.authService.loginUser(username);
    if (storeUsername) localStorage.setItem(LOCAL_STORAGE_KEYS.username, username);
  }

  async loginUserWithData(username: string, storeUsername = true) {
    this.loggingInUser.emit(true);
    await this.loginUser(username, storeUsername);
    if (this.user) {
      this.loadingUserProjects.emit(true);
      await this.loadUserProjects();
      this.loadingUserProjects.emit(false);
      let projectId = this.route.firstChild.firstChild.snapshot.paramMap.get('projId');
      this.currentProject = this.projects.find(project => project.id === projectId);
      if (this.currentProject) {
        await this.loadUserSources();
        await this.loadUserNetworks();
        await this.loadUserCategories();
        await this.loadUserCodes();
        this.userFullyLoaded.emit(true);
      }
    }
    this.loggingInUser.emit(true);
  }

  async logoutUser() {
    this._user = null;
    this._projects = [];
    this._currentProject = null;
    this._networks = [];
    this._currentNetwork = null;
    this._categories = [];
    this._codes = [];
    localStorage.removeItem(LOCAL_STORAGE_KEYS.lastSelectedNetwork);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.username);
  }

  async loadUserProjects() {
    this.projects = await this.projectService.getProjectsByIds(this.user.projectsIds);
  }

  async loadUserSources() {
    if (this.currentProject) this.sources = await this.sourceService.getSourcesByIds(this.currentProject.sources);
  }

  async loadUserNetworks() {
    if (this.currentProject) {
      this.networks = await this.networkService.getNetworksByIds(this.currentProject.networks);
      let lastSelectedNetworkId = localStorage.getItem(LOCAL_STORAGE_KEYS.lastSelectedNetwork);
      if (lastSelectedNetworkId) {
        this.currentNetwork = this.networks.find(network => network.id === lastSelectedNetworkId);
      } else {
        this.currentNetwork = this.networks[0];
      }
    }
  }

  async loadUserNetworksData() {
    let projectId = this.route.firstChild.firstChild.snapshot.paramMap.get('projId');
    if (projectId && this.projects) {
      this.currentProject = this.projects.find(project => project.id === projectId);
      await this.loadUserNetworks();
      await this.loadUserCategories();
      await this.loadUserCodes();
    }
  }

  async loadUserCategories() {
    if (this.currentProject) {
      this.categories = await this.categoryService.getCategoriesByIds(this.currentProject.categories);
    }
  }

  async loadUserCodes() {
    if (this.currentProject) {
      this.codes = await this.codeService.getCodesByIds(this.currentProject.codes);
    }
  }

  async addProjectToUser(name: string, description: string) {
    let newProject = await this.projectService.createProject(name, description);
    this.projects.push(newProject);
    this.loadingUserProjects.emit(true);
    this.user.projectsIds.push(newProject.id);
    await this.userRepository.updateById(this.user.id, {projectsIds: this.user.projectsIds});
    this.loadingUserProjects.emit(false);
  }

  async addSourceToProject(source: Source) {
    let newSource = await this.sourceService.saveToProject(source, this.currentProject.id);
    this.sources.push(newSource);
  }

  async addNetworkToUserProject(network: Network) {
    let newNetwork = await this.networkService.createNetwork(network);
    this.networks.push(newNetwork);
    this.currentProject.networks.push(newNetwork.id);
    await this.projectService.updateProjectById(this._currentProject.id, {networks: this.currentProject.networks});
    this.currentNetwork = newNetwork;
  }

  async addCategoryToProject(category: Category) {
    let newCategory = await this.categoryService.saveCategory(category, this.currentProject.id);
    this.categories.push(newCategory);
    this.currentProject.categories.push(newCategory.id);
    await this.projectService.updateProjectById(this.currentProject.id, {
      categories: this.currentProject.categories
    });
  }

  async addCodeToProject(code: Code, parentCategory: Category) {
    let newCode = await this.codeService.saveCode(code, this.currentProject.id);
    this.codes.push(newCode);
    this.currentProject.codes.push(newCode.id);
    if (parentCategory) parentCategory.codes.push(newCode.id);
    await this.projectService.updateProjectById(this.currentProject.id, {
      codes: this.currentProject.codes
    });
  }

  async updateNetwork(networkData: Partial<Network>, categoriesData: Partial<Category>[], codesData: Partial<Code>[]) {
    if (categoriesData.length) {
      await this.categoryService.updateCategories(categoriesData);
      categoriesData.forEach(categoryData => {
        let category = this.categories.find(category => category.id === categoryData);
        if (category) {
          category.name = categoryData.name;
          category.color = categoryData.color;
          category.textColor = categoryData.textColor;
        }
      });
    }
    if (codesData.length) {
      await this.codeService.updateCodes(codesData);
      codesData.forEach(codeData => {
        let code = this.categories.find(code => code.id === codeData);
        if (code) {
          code.name = codeData.name;
          code.color = codeData.color;
          code.textColor = codeData.textColor;
        }
      });
    }
    await this.networkService.updateNetworkById(this.currentNetwork.id, networkData);
    this.currentNetwork.positions = networkData.positions;
    this.currentNetwork.relationships = networkData.relationships;
  }

  public get user(): User {
    return this._user;
  }
  public set user(value: User) {
    this._user = value;
  }

  public get projects(): Project[] {
    return this._projects;
  }
  public set projects(value: Project[]) {
    this._projects = value;
  }

  public get sources(): Source[] {
    return this._sources;
  }
  public set sources(value: Source[]) {
    this._sources = value;
  }


  public get currentProject(): Project {
    return this._currentProject;
  }
  public set currentProject(value: Project) {
    this._currentProject = value;
    this.categories = [];
    this.sources = [];
    this.codes = [];
    this.networks = [];
    this.loadingUserProjects.emit(false);
  }

  public get networks(): Network[] {
    return this._networks;
  }
  public set networks(value: Network[]) {
    this._networks = value;
  }

  public get currentNetwork(): Network {
    return this._currentNetwork;
  }
  public set currentNetwork(value: Network) {
    this._currentNetwork = value;
    if (value) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.lastSelectedNetwork, this._currentNetwork.id);
      this.networkSelected.emit(true);
    }
  }

  public get categories(): Category[] {
    return this._categories;
  }
  public set categories(value: Category[]) {
    this._categories = value;
  }

  public get codes(): Code[] {
    return this._codes;
  }
  public set codes(value: Code[]) {
    this._codes = value;
  }

}
