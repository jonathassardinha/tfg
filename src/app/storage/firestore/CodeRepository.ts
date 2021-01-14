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

  async getByIds(ids: string[]) {
    let codesRef = await this.firebase.collection<Code>('codes').ref.where(firebase.firestore.FieldPath.documentId(), 'in', ids).get();
    return codesRef.docs.map(doc => {
      let code = doc.data();
      code.id = doc.id;
      return code;
    });
  }

  async saveToCategory(code: Code, parentCategory: Category) {

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

    await this.firebase.collection('codes').doc(codeRef).set(dataToSave);
    if (parentCategory) {
      await this.firebase.collection('categories').doc(parentCategory.id).update({
        'codes': firebase.firestore.FieldValue.arrayUnion(codeRef)
      });
    }

    code.id = codeRef;
    return code;
  }

  async updateById(id: string, data: Partial<Code>) {
    await this.firebase.doc<Code>(`codes/${id}`).update({
      name: data.name,
      color: data.color,
      textColor: data.textColor
    });
  }
}
