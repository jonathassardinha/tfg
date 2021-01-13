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

  async create(name: string, description: string) {
    let projectRef = await this.firebase.collection<Partial<Project>>('projects').add({
      name: name,
      description: description,
      categories: [],
      codes: [],
      sources: [],
      networks: []
    });
    let project = (await projectRef.get()).data();
    return new Project(projectRef.id, project.name, project.description, project.networks, project.sources, project.categories, project.codes);
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
