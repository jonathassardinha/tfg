import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from 'firebase/app';
import 'firebase/firestore';

import Project from '../../data/Project';
import { Repository } from '../Repository';

@Injectable({
  providedIn: 'root'
})
export class ProjectRepository extends Repository<Project> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  async getById(id: string) {
    let project = await this.firebase.collection('projects').doc<Project>(id).get().toPromise();
    return project.data();
  }

  getProjectById(id: string) {
    return this.firebase.collection('projects').doc<Project>(id).valueChanges();
  }

  getAllProjects() {
    return this.firebase.collection<Project>('projects').valueChanges();
  }

  async getByIds(ids: string[]) {
    let projectRefs = await this.firebase.collection<Project>('projects').ref.where(firebase.firestore.FieldPath.documentId(), 'in', ids).get();
    return projectRefs.docs.map(doc => {
      let project = doc.data();
      project.id = doc.id;
      return project;
    });
  }

  async updateById(id: string, projectData: Partial<Project>) {
    await this.firebase.collection('projects').doc<Project>(id).update(projectData);
  }

}
