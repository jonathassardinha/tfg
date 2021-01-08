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
export class NetworkService {

  constructor(
    private networkRepository: NetworkRepository
  ) {}

  async getNetworkById(id: string) {
    return await this.networkRepository.getById(id);
  }

  async getNetworksByIds(ids: string[]) {
    let networks: Network[] = [];
    for (let i = 0; i < ids.length; i+=10) {
      let queryArray = ids.slice(i, i+10);
      networks.push(...(await this.networkRepository.getByIds(queryArray)));
    }

    return networks;
  }

  async updateRelationships(networkId: string, updateRelationships: Relationship[]) {
    await this.networkRepository.updateRelationshipById(networkId, updateRelationships);
  }

  async updateNetworkById(networkId: string, updateData: Partial<Network>) {
    await this.networkRepository.updateById(networkId, updateData);
  }

}