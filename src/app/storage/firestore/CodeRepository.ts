import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from 'firebase/app';
import 'firebase/firestore';
import Category from "src/app/data/Category";

import Code from '../../data/Code';
import { Repository } from '../Repository';

@Injectable({
  providedIn: 'root'
})
export class CodeRepository extends Repository<Code> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  subscribeToCodes(ids: string[]){
    let codes = this.firebase.collection<Code>('codes', ref => ref.where('id', 'in', ids)).valueChanges()
    return codes
  }

  async getByIds(ids: string[]) {
    let codesRef = await this.firebase.collection<Code>('codes').ref.where(firebase.firestore.FieldPath.documentId(), 'in', ids).get();
    return codesRef.docs.map(doc => {
      let code = doc.data();
      code.id = doc.id;
      return code;
    });
  }

  async saveToCategory(code: Code, parentCategory: Category) {

    let codeRef = this.firebase.createId();

    let dataToSave = {
      'id': codeRef,
      'name': code.name,
      'description': code.description,
      'fragments': null,
      'color': code.color,
      'textColor': code.textColor,
    };

    await this.firebase.collection('codes').doc(codeRef).set(dataToSave);

    if (parentCategory) {
      await this.firebase.collection('categories').doc(parentCategory.id).update({
        'codes': firebase.firestore.FieldValue.arrayUnion(codeRef)
      });
    }

    code.id = codeRef;
    return code;
  }

  async saveToProject(code: Code, projectId: string) {

    let codeRef = this.firebase.createId()
    let dataToSave = {
      'id': codeRef,
      'name': code.name,
      'description': code.description,
      'fragments': null,
      'parent': code.parent ? code.parent : null,
      'color': code.color,
      'textColor': code.textColor,
    }

    await this.firebase.collection('codes').doc(codeRef).set(dataToSave)

    await this.firebase.collection('projects').doc(projectId).update({
      codes: firebase.firestore.FieldValue.arrayUnion(codeRef)
    })

    if (code.parent) {
      await this.firebase.collection('categories').doc(code.parent).update({
        codes: firebase.firestore.FieldValue.arrayUnion(codeRef)
      })
    }

    code.id = codeRef;

    return code;

  }

  async saveToCategories(code: Code, catIds: string[]) {

    let codeRef = this.firebase.createId()

    let dataToSave = {
      'id': codeRef,
      'name': code.name,
      'description': code.description,
      'fragments': null,
      'color': code.color,
      'textColor': code.textColor,
    }

    await this.firebase.collection('codes').doc(codeRef).set(dataToSave)
    for (let cat of catIds) {
      this.firebase.collection('categories').doc(cat).update({
        'codes': firebase.firestore.FieldValue.arrayUnion(codeRef)
      })
    }
  }

  async updateById(id: string, data: Partial<Code>) {
    await this.firebase.doc<Code>(`codes/${id}`).update({
      name: data.name,
      color: data.color,
      textColor: data.textColor
    });
  }

  async addFragment(id: string, fragmentId: string) {
    await this.firebase.collection('codes').doc(id).update({
      fragments: firebase.firestore.FieldValue.arrayUnion(fragmentId)
    })
  }

  async updateContent(code: Code, data: Partial<Code>) {
    if (code.parent != data.parent) {
      if (data.parent) {
        this.firebase.collection('codes').doc(data.parent).update({
          categories: firebase.firestore.FieldValue.arrayUnion(code.id)
        })
      }
      if (code.parent) {
        this.firebase.collection('categories').doc(code.parent).update({
          categories: firebase.firestore.FieldValue.arrayRemove(code.id)
        })
      }
    }

    await this.firebase.doc<Code>(`codes/${code.id}`).update({
      name: data.name,
      description: data.description,
      parent: data.parent ? data.parent : null,
      color: data.color
    });
  }
}
