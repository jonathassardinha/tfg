import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

import { Repository } from '../Repository';

export interface User {
  email: string;
  projectIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserRepository extends Repository<User> {
  constructor (private firebase: AngularFirestore) {
    super();

  }

  async createByEmail(email: string) {
    let user = await this.firebase.collection<User>('users').add({email: email, projectIds: []});
    return (await user.get()).data();
  }

  async getByProperty(property: string, match: string) {
    let user = await this.firebase.collection<User>('users').ref.where(property, '==', match).get();
    return user.docs.map(doc => doc.data());
  }
}