import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from 'firebase/app';
import 'firebase/firestore';

import Category from '../../data/Category';
import { Repository } from '../Repository';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryRepository extends Repository<Category> {
  constructor (private firebase: AngularFirestore) {
    super();
  }

  getAllCategories(): Observable<Category[]>{
    return this.firebase.collection<Category>('categories').valueChanges()
  }

  subscribeToCategories(ids: string[]){
    let categories = this.firebase.collection<Category>('categories', ref => ref.where('id','in', ids )).valueChanges()
    return categories;
  }

  async getByIds(ids: string[]) {
    let categoriesRef = await this.firebase.collection<Category>('categories').ref.where(firebase.firestore.FieldPath.documentId(), 'in', ids).get();
    return categoriesRef.docs.map(doc => {
      let category = doc.data();
      category.id = doc.id;
      return category;
    });
  }

  async saveToProject(instance: Category, projId: string) {
    var categoryRef = this.firebase.createId()
    await this.firebase.collection('categories').doc(categoryRef).set({
      'id': categoryRef,
      'name': instance.name,
      'description': instance.description,
      'color': instance.color,
      'parent': instance.parent ? instance.parent : null,
      'categories' : instance.categories ? instance.categories : [],
      'codes' : instance.codes ? instance.codes : []
    })
    await this.firebase.collection('projects').doc(projId).update({
      categories: firebase.firestore.FieldValue.arrayUnion(categoryRef)
    });
    if (instance.parent) {
      await this.firebase.collection('categories').doc(instance.parent).update({
        categories: firebase.firestore.FieldValue.arrayUnion(categoryRef)
      });
    }

    instance.id = categoryRef;

    return instance;
  }

  async updateById(id: string, data: Partial<Category>) {
    await this.firebase.doc<Category>(`categories/${id}`).update({
      name: data.name,
      color: data.color,
      textColor: data.textColor
    });
  }

  async updateContent(category: Category, data: Partial<Category>) {
    if (category.parent != data.parent) {
      if (data.parent) {
        this.firebase.collection('categories').doc(data.parent).update({
          categories: firebase.firestore.FieldValue.arrayUnion(category.id)
        })
      }
      if (category.parent) {
        this.firebase.collection('categories').doc(category.parent).update({
          categories: firebase.firestore.FieldValue.arrayRemove(category.id)
        })
      }
    }

    await this.firebase.doc<Category>(`categories/${category.id}`).update({
      name: data.name,
      description: data.description,
      parent: data.parent ? data.parent : null,
      color: data.color
    });
  }
}
