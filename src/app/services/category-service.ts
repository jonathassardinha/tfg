import { EventEmitter, Injectable } from "@angular/core";

import Category from "../data/Category";
import { CategoryRepository } from "../storage/firestore/CategoryRepository";
import { AuthService } from "./auth-service";
import { ProjectService } from "./project-service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  public loadingCategories = new EventEmitter<boolean>();
  public categories: Category[] = [];
  public areCategoriesLoaded = false;

  constructor(
    private categoryRepository: CategoryRepository,
    private authService: AuthService,
    private projectService: ProjectService
  ) {
    this.authService.userLogEvent.subscribe(eventType => {
      if (eventType === 'logout') {
        this.logoutUser();
      }
    });
    this.projectService.projectSelected.subscribe(() => {
      this.loadUserCategories().then();
    })
  }

  async loadUserCategories() {
    this.loadingCategories.emit(true);
    if (this.authService.user && !this.areCategoriesLoaded) {
      this.categories = await this.getCategoriesByIds(this.projectService.currentProject.categories);
      this.areCategoriesLoaded = true;
    }
    this.loadingCategories.emit(false);
  }

  async getCategoriesByIds(ids: string[]) {
    return await this.categoryRepository.getByIds(ids);
  }

  async saveCategory(category: Category, projId: string) {
    this.categoryRepository.saveToProject(category, projId)
  }

  async updateCategories(updateData: Partial<Category>[]) {
    for (let data of updateData) {
      await this.categoryRepository.updateById(data.id, data);
    }
  }

  getAllCategories() {
    return this.categoryRepository.getAllCategories();
  }

  getParentcategories(categories: Category[]){
    return categories.filter(category => category.parent == null)
  }

  getChildCategories(categories: Category[], parentId:string){
    return categories.filter(category => category.parent == parentId)
  }

  private logoutUser() {
    this.areCategoriesLoaded = false;
    this.categories = [];
  }

}
