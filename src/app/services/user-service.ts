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
import { User } from "../storage/firestore/CodeRepository";

import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';

const LOCAL_STORAGE_KEYS = {
  userEmail: 'userEmail',
  lastSelectedNetwork: 'lastSelectedNetwork'
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user: User;
  private _projects: Project[];
  private _currentProject: Project;
  private _networks: Network[];
  private _currentNetwork: Network;
  private _categories: Category[] = [];
  private _codes: Code[] = [];

  public userFullyLoaded = new EventEmitter<boolean>();
  public networkSelected = new EventEmitter<boolean>();
  public loadingUserProjects = new EventEmitter<boolean>();
  public loadingUserCategories = new EventEmitter<boolean>();
  public loadingUserCodes = new EventEmitter<boolean>();
  public userLogEvent = new EventEmitter<boolean>();

  constructor (
    private authService: AuthService,
    private projectService: ProjectService,
    private networkService: NetworkService,
    private categoryService: CategoryService,
    private codeService: CodeService,
    private route: ActivatedRoute
  ) {
    let ref = firebase.app().database().ref('.info/connected');
    ref.on('value', (snapshot) => {
      if (snapshot.val()) {
        firebase.app().firestore().enableNetwork().then(() => {
          if (this.user) {
            this.loginUserWithData(this.user.email, false).then();
          }
        });
      } else {
        firebase.app().firestore().disableNetwork().then();
      }
    });
  }

  async loginUser(email: string, storeEmail = true) {
    this.user = await this.authService.loginUser(email);
    if (storeEmail) localStorage.setItem(LOCAL_STORAGE_KEYS.userEmail, email);
  }

  async loginUserWithData(email: string, storeEmail = true) {
    await this.loginUser(email, storeEmail);
    this.loadingUserProjects.emit(true);
    await this.loadUserProjects();
    this.loadingUserProjects.emit(false);
    let projectId = this.route.firstChild.firstChild.snapshot.paramMap.get('projId');
    if (projectId) {
      this.currentProject = this.projects.find(project => project.id === projectId);
      await this.loadUserNetworks();
      await this.loadUserCategories();
      await this.loadUserCodes();
      this.userFullyLoaded.emit(true);
    }
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
  }

  async loadUserProjects() {
    this.projects = await this.projectService.getProjectsByIds(this.user.projectIds);
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
      this.userFullyLoaded.emit(true);
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

  public get currentProject(): Project {
    return this._currentProject;
  }
  public set currentProject(value: Project) {
    this._currentProject = value;
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
    localStorage.setItem(LOCAL_STORAGE_KEYS.lastSelectedNetwork, this._currentNetwork.id);
    this.networkSelected.emit(true);
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
