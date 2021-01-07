import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase/app';

import Code from '../../data/Code';
import { Repository } from '../Repository';

export interface User {
  email: string;
  projectIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CodeRepository extends Repository<Code> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  async getByIds(ids: string[]) {
    let codesRef = await this.firebase.collection<Code>('codes').ref.where(firebase.default.firestore.FieldPath.documentId(), 'in', ids).get();
    return codesRef.docs.map(doc => {
      let category = doc.data();
      category.id = doc.id;
      return category;
    });
  }

  async saveToCategories(code: Code, catIds: string[]) {

    let codeRef = this.firebase.createId()
    let sourceData = {
      'id': code.source.id,
      'range': code.source.range
    }

    let dataToSave = {
      'id': codeRef,
      'name': code.name,
      'content': code.content,
      'color': code.color,
      'textColor': code.textColor,
      'source': sourceData
    }

    await this.firebase.collection('codes').doc(codeRef).set(dataToSave)
    for (let cat of catIds) {
      this.firebase.collection('categories').doc(cat).update({
        'codes': firebase.default.firestore.FieldValue.arrayUnion(codeRef)
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
}
