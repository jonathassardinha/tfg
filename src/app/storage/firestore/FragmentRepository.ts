import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase/app';

import Fragment from '../../data/Fragment';
import { Repository } from '../Repository';

export interface User {
  email: string;
  projectIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FragmentRepository extends Repository<Fragment> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  // async getByIds(ids: string[]) {
  //   let codesRef = await this.firebase.collection<Fragment>('fragments').ref.where(firebase.default.firestore.FieldPath.documentId(), 'in', ids).get();
  //   return codesRef.docs.map(doc => doc.data());
  // }

  async getByIds(ids: string[]) {
    let fragments = [];
    for (let i = 0; i < ids.length; i+=10) {
      let queryArray = ids.slice(i, i+10);
      let fragmentsRef = await this.firebase.collection<Fragment>('fragments').ref.where(firebase.default.firestore.FieldPath.documentId(), 'in', queryArray).get();
      fragmentsRef.docs.forEach(doc => {
        let fragment = doc.data();
        fragment.id = doc.id;
        fragments.push(fragment);
      });
    }
    return fragments;
  }

  subscribeToAll() {
    return this.firebase.collection<Fragment>('fragments').valueChanges()
  }

  async saveFragment(fragment: Fragment) {
    let fragRef = this.firebase.createId()

    let saveRange = {
      startXPath: fragment.range.startXPath,
      startOffset: fragment.range.startOffset,
      endXPath: fragment.range.endXPath,
      endOffset: fragment.range.endOffset
    }

    let saveData = {
      id: fragRef,
      sourceId: fragment.sourceId,
      range: saveRange,
      content: fragment.content,
      codes: fragment.codes
    }

    console.log(saveData)

    await this.firebase.collection('fragments').doc(fragRef).set(saveData)
    return fragRef

  }
}
