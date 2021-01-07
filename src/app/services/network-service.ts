import { EventEmitter, Injectable, OnDestroy } from "@angular/core";
import Network from "../data/Network";
import CanvasCategory from "../data/Canvas/CanvasCategory";
import Category from "../data/Category";
import Code from "../data/Code";
import Relationship from "../data/Relationship";
import CanvasEdge from "../data/Canvas/CanvasEdge";
import { NetworkRepository } from "../storage/firestore/NetworkRepository";
import { CategoryService } from "./category-service";
import { CodeService } from "./code-service";
import { AuthService } from "./auth-service";
import { ProjectService } from "./project-service";

@Injectable({
  providedIn: 'root'
})
export class NetworkService implements OnDestroy {

  private _currentNetwork: Network;

  public networkSelected = new EventEmitter<boolean>();

  public networks: Network[];
  public vertices: {
    categories: Category[],
    codes: Code[]
  };

  private networksLoaded = false;

  constructor(
    private networkRepository: NetworkRepository,
    private projectService: ProjectService,
    private authService: AuthService
  ) {
    this.authService.userLogEvent.subscribe((eventType: string) => {
      if (eventType === 'logout') {
        this.logoutUser();
      }
    });
    this.projectService.projectSelected.subscribe(() => {
      this.loadUserNetworks().then();
    })
  }

  get currentNetwork() {
    return this._currentNetwork;
  }

  set currentNetwork(value: Network) {
    this._currentNetwork = value;
    this.networkSelected.emit(true);
  }

  async ngOnDestroy() {
  }

  async getNetworkById(id: string) {
    return await this.networkRepository.getById(id);
  }

  async getNetworksByIds(ids: string[]) {
    return await this.networkRepository.getByIds(ids);
  }

  async loadNetworkById(id: string) {
    this.currentNetwork = await this.getNetworkById(id);
  }

  async loadUserNetworks() {
    if (this.authService.user && !this.networksLoaded) {
      this.networks = await this.getNetworksByIds(this.projectService.currentProject.networks);
      this.currentNetwork = this.networks[0];
      this.networksLoaded = true;
    }
  }

  async updateRelationships(networkId: string, updateRelationships: Relationship[]) {
    await this.networkRepository.updateRelationshipById(networkId, updateRelationships);
  }

  async updateNetworkById(networkId: string, updateData: Partial<Network>) {
    await this.networkRepository.updateById(networkId, updateData);
  }

  private logoutUser() {
    this.currentNetwork = null;
    this.networksLoaded = false;
  }

}