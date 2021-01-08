import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from 'firebase/app';
import 'firebase/firestore';

import Category from '../../data/Category';
import { Repository } from '../Repository';
import { Observable } from "rxjs";

export interface User {
  email: string;
  projectIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoryRepository extends Repository<Category> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  async getByIds(ids: string[]) {
    let categoriesRef = await this.firebase.collection<Category>('categories').ref.where(firebase.firestore.FieldPath.documentId(), 'in', ids).get();
    return categoriesRef.docs.map(doc => {
      let category = doc.data();
      category.id = doc.id;
      return category;
    });
  }

  getAllCategories(): Observable<Category[]>{
    return this.firebase.collection<Category>('categories').valueChanges()
  }


    // async saveToProject(instance: Category, projId: string) {
    //   var newDocRef = await this.firebase.collection('categories').add({
    //     'name': instance.name,
    //     'color': instance.color,
    //     'parent': instance.parent ? instance.parent : null,
    //     'categories' : instance.categories ? instance.categories : [],
    //     'codes' : instance.codes ? instance.codes : [],
    //     'position' : instance.position ? instance.position : []
    //   });
    //   await this.firebase.collection('projects').doc(projId).update({
    //     categories: firebase.firestore.FieldValue.arrayUnion(newDocRef.id)
    //   });
    //   if (instance.parent) {
    //     await this.firebase.collection('categories').doc(instance.parent).update({
    //       categories: firebase.firestore.FieldValue.arrayUnion(newDocRef.id)
    //     })
    //   }
    //   return;
    // }

  async saveToProject(instance: Category, projId: string) {
    var categoryRef = this.firebase.createId()
    await this.firebase.collection('categories').doc(categoryRef).set({
      'id': categoryRef,
      'name': instance.name,
      'color': instance.color,
      'parent': instance.parent ? instance.parent : null,
      'categories' : instance.categories ? instance.categories : [],
      'codes' : instance.codes ? instance.codes : []
    })
    await this.firebase.collection('projects').doc(projId).update({
      categories: firebase.firestore.FieldValue.arrayUnion(categoryRef)
    })
    if (instance.parent) {
      await this.firebase.collection('categories').doc(instance.parent).update({
        categories: firebase.firestore.FieldValue.arrayUnion(categoryRef)
      })
    }
  }

  async updateById(id: string, data: Partial<Category>) {
    await this.firebase.doc<Category>(`categories/${id}`).update({
      name: data.name,
      color: data.color,
      textColor: data.textColor
    });
  }
}
