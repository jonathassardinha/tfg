import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import User from "src/app/data/User";

import { Repository } from '../Repository';

@Injectable({
  providedIn: 'root'
})
export class UserRepository extends Repository<User> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  async createByUsername(username: string) {
    let userRef = await this.firebase.collection<Partial<User>>('users').add({username: username, projectsIds: []});
    let user = (await userRef.get()).data();
    user.id = userRef.id;
    return new User(user.id, user.username, user.projectsIds);
  }

  async updateById(id: string, userData: Partial<User>) {
    await this.firebase.collection('users').doc<User>(id).update(userData);
  }

  async getByProperty(property: string, match: string) {
    let user = await this.firebase.collection<User>('users').ref.where(property, '==', match).get();
    return user.docs.map(doc => {
      let userData = doc.data();
      userData.id = doc.id;
      return userData;
    });
  }
}