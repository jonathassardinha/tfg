import { Injectable } from "@angular/core";

import Category from "../data/Category";
import { CategoryRepository } from "../storage/firestore/CategoryRepository";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository
  ) {}

  getAllCategories() {
    return this.categoryRepository.getAllCategories();
  }

  subscribeToCategories(ids: string[]){
    return this.categoryRepository.subscribeToCategories(ids)
  }

  getParentcategories(categories: Category[]){
    return categories.filter(category => category.parent == null)
  }

  getChildCategories(categories: Category[], parentId:string){
    return categories.filter(category => category.parent == parentId)
  }

  async getCategoriesByIds(ids: string[]) {
    let categories: Category[] = [];
    for (let i = 0; i < ids.length; i+=10) {
      let queryArray = ids.slice(i, i+10);
      categories.push(...await this.categoryRepository.getByIds(queryArray));
    }

    return categories;
  }

  async saveCategory(category: Category, projId: string) {
    return this.categoryRepository.saveToProject(category, projId)
  }

  async updateCategories(updateData: Partial<Category>[]) {
    for (let data of updateData) {
      await this.categoryRepository.updateById(data.id, data);
    }
  }

  async updateCategoryContent(category: Category, updateData: Partial<Category>){
    await this.categoryRepository.updateContent(category, updateData);
  }

}
