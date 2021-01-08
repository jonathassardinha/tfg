import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

import { Repository } from '../Repository';
import Network from '../../data/Network';
import Relationship from "src/app/data/Relationship";

@Injectable({
  providedIn: 'root'
})
export class NetworkRepository extends Repository<Network> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  async getById(id: string) {
    let networkRef = await this.firebase.collection('networks').doc<Network>(id).get().toPromise();
    let network = networkRef.data();
    network.id = networkRef.id;
    return network;
  }

  async getByIds(ids: string[]) {
    let networksRefs = await this.firebase.collection<Network>('networks').ref.where('__name__', 'in', ids).get();
    return networksRefs.docs.map(doc => {
      let network = doc.data();
      network.id = doc.id;
      return network;
    });
  }

  async saveById(id: string, network: Network) {
    await this.firebase.collection('networks').doc<Network>(id).update(network);
  }

  async updateRelationshipById(id: string, relationships: Relationship[]) {
    await this.firebase.doc<Network>(`networks/${id}`).update({relationships: relationships});
  }

  async updateById(id: string, updateData: Partial<Network>) {
    await this.firebase.doc<Network>(`networks/${id}`).update(updateData);
  }
}