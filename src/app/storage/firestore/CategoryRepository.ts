import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase/app';

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
    let categories = [];
    for (let i = 0; i < ids.length; i+=10) {
      let queryArray = ids.slice(i, i+10);
      let categoriesRef = await this.firebase.collection<Category>('categories').ref.where(firebase.default.firestore.FieldPath.documentId(), 'in', queryArray).get();
      categoriesRef.docs.forEach(doc => {
        let category = doc.data();
        category.id = doc.id;
        categories.push(category);
      });
    }

    return categories;
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
    //     categories: firebase.default.firestore.FieldValue.arrayUnion(newDocRef.id)
    //   });
    //   if (instance.parent) {
    //     await this.firebase.collection('categories').doc(instance.parent).update({
    //       categories: firebase.default.firestore.FieldValue.arrayUnion(newDocRef.id)
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
      categories: firebase.default.firestore.FieldValue.arrayUnion(categoryRef)
    })
    if (instance.parent) {
      await this.firebase.collection('categories').doc(instance.parent).update({
        categories: firebase.default.firestore.FieldValue.arrayUnion(categoryRef)
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
