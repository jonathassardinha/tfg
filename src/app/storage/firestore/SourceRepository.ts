import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from 'firebase/app'
import 'firebase/firestore';

import { Repository } from '../Repository';
import Source from '../../data/Source';
import { InstantiateExpr } from '@angular/compiler';
import { updateLanguageServiceSourceFile } from "typescript";

@Injectable({
  providedIn: 'root'
})

export class SourceRepository extends Repository<Source> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  async getById(id: string) {
    let source = await this.firebase.collection('sources').doc<Source>(id).get().toPromise();
    return source.data();
  }

  async getByIds(ids: string[]) {
    let sources = await this.firebase.collection<Source>('sources').ref.where(firebase.firestore.FieldPath.documentId(), 'in', ids).get();
    return sources.docs.map(doc => {
      let category = doc.data()
      category.id = doc.id;
      return category;
    });
  }

  async saveToProject(instance: Source, projId: string) {
    let sourceRef = this.firebase.createId()
    await this.firebase.collection('sources').doc(sourceRef).set({
      'id': sourceRef,
      'title': instance.title,
      'content': instance.content
    })
    await this.firebase.collection('projects').doc(projId).update({
        sources: firebase.firestore.FieldValue.arrayUnion(sourceRef)
    })
    instance.id = sourceRef;
    return instance;
  }

  async update(instance: Source) {
    this.firebase.collection('sources').doc(instance.id).update({
      'content': instance.content
    })
  }
}

